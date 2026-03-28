import Stripe from 'stripe'
import { query } from '../db/db.js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const normalizePlan = (plan) => {
  const normalized = (plan || 'free').toString().toLowerCase()
  if (normalized === 'bussines') return 'business'
  return normalized
}

const epochToDate = (epochSeconds) => {
  if (!epochSeconds || Number.isNaN(Number(epochSeconds))) return null
  return new Date(Number(epochSeconds) * 1000)
}

const addInterval = (date, interval, count = 1) => {
  if (!date || !interval) return null
  const result = new Date(date.getTime())
  const safeCount = Number(count) || 1
  if (interval === 'day') {
    result.setDate(result.getDate() + safeCount)
  } else if (interval === 'week') {
    result.setDate(result.getDate() + safeCount * 7)
  } else if (interval === 'month') {
    result.setMonth(result.getMonth() + safeCount)
  } else if (interval === 'year') {
    result.setFullYear(result.getFullYear() + safeCount)
  } else {
    return null
  }
  return result
}

const findUserIdByStripeIds = async (subscriptionId, customerId) => {
  if (!subscriptionId && !customerId) return null
  const result = await query(
    'SELECT id FROM users WHERE stripe_subscription_id = $1 OR stripe_customer_id = $2',
    [subscriptionId || null, customerId || null]
  )
  return result.rows?.[0]?.id || null
}

export const stripeWebhook = async (req, res) => {
  console.log('⚡ Stripe webhook received')

  const sig = req.headers['stripe-signature']

  let event
  try {
    // ⚡ используем raw body
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.log('Webhook error:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  console.log('Webhook event type:', event.type)

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const userId = Number(session.client_reference_id)
    const plan = normalizePlan(session.metadata?.plan || 'free')
    const subscriptionId = session.subscription || null
    const customerId = session.customer || null

    if (!userId || Number.isNaN(userId)) {
      console.log('Invalid userId in webhook:', session)
      return res.status(400).send('Invalid userId')
    }

    let subscription
    try {
      if (subscriptionId) {
        subscription = await stripe.subscriptions.retrieve(subscriptionId)
      }
    } catch (err) {
      console.log('Stripe subscription fetch error:', err)
    }

    const subscriptionStatus = subscription?.status || 'active'
    let subscriptionEnd = epochToDate(subscription?.current_period_end)
    if (!subscriptionEnd) {
      subscriptionEnd = epochToDate(subscription?.trial_end)
    }
    if (!subscriptionEnd) {
      const interval =
        subscription?.items?.data?.[0]?.price?.recurring?.interval || null
      const intervalCount =
        subscription?.items?.data?.[0]?.price?.recurring?.interval_count || 1
      const startEpoch =
        subscription?.current_period_start || subscription?.start_date || null
      const startDate = epochToDate(startEpoch)
      subscriptionEnd = addInterval(startDate, interval, intervalCount)
    }

    try {
      await query(
        `UPDATE users
         SET plan = $1,
             subscription_status = $2,
             subscription_end = $3,
             stripe_customer_id = $4,
             stripe_subscription_id = $5
         WHERE id = $6`,
        [
          plan,
          subscriptionStatus,
          subscriptionEnd,
          customerId,
          subscriptionId,
          userId,
        ]
      )
      console.log(`Subscription activated for user ${userId} with plan ${plan}`)
    } catch (err) {
      console.log('DB error:', err)
      return res.status(500).send('Database error')
    }
  }

  if (event.type === 'customer.subscription.updated') {
    const subscription = event.data.object
    const subscriptionId = subscription?.id || null
    const customerId = subscription?.customer || null
    const subscriptionStatus = subscription?.status || 'active'
    let subscriptionEnd = epochToDate(subscription?.current_period_end)
    if (!subscriptionEnd) {
      subscriptionEnd = epochToDate(subscription?.trial_end)
    }
    if (!subscriptionEnd) {
      const interval =
        subscription?.items?.data?.[0]?.price?.recurring?.interval || null
      const intervalCount =
        subscription?.items?.data?.[0]?.price?.recurring?.interval_count || 1
      const startEpoch =
        subscription?.current_period_start || subscription?.start_date || null
      const startDate = epochToDate(startEpoch)
      subscriptionEnd = addInterval(startDate, interval, intervalCount)
    }

    try {
      const userId = await findUserIdByStripeIds(subscriptionId, customerId)
      if (!userId) {
        console.log('User not found for subscription update:', {
          subscriptionId,
          customerId,
        })
      } else {
        await query(
          `UPDATE users
           SET subscription_status = $1,
               subscription_end = $2,
               stripe_customer_id = COALESCE($3, stripe_customer_id),
               stripe_subscription_id = COALESCE($4, stripe_subscription_id)
           WHERE id = $5`,
          [
            subscriptionStatus,
            subscriptionEnd,
            customerId,
            subscriptionId,
            userId,
          ]
        )
      }
    } catch (err) {
      console.log('DB error:', err)
      return res.status(500).send('Database error')
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object
    const subscriptionId = subscription?.id || null
    const customerId = subscription?.customer || null

    try {
      const userId = await findUserIdByStripeIds(subscriptionId, customerId)
      if (!userId) {
        console.log('User not found for subscription delete:', {
          subscriptionId,
          customerId,
        })
      } else {
        await query(
          `UPDATE users
           SET plan = 'free',
               subscription_status = 'expired',
               subscription_end = NULL
           WHERE id = $1`,
          [userId]
        )
        console.log(`Subscription ended for user ${userId}, set to free`)
      }
    } catch (err) {
      console.log('DB error:', err)
      return res.status(500).send('Database error')
    }
  }

  res.sendStatus(200)
}
