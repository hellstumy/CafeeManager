import { useEffect, useState } from 'react'
import Loader from '../Components/Loader'
import { getCurrentUser, updateCurrentUserProfile } from '../api/api'
import { useCurrentUser } from '../store/store'
import { useTranslation } from 'react-i18next'
import { savedLanguage } from '../i18n/i18n'

const API_BASE_URL = import.meta.env.VITE_API_URL
const plans = [
  {
    id: 'free',
    name: 'FREE',
    price: '$0',
    features: [
      ['Restaurants', '1'],
      ['Menu items', '20'],
      ['Tables', '15'],
      ['QR codes', '✅'],
      ['Digital menu', '✅'],
      ['Trial period', '-'],
    ],
    buttonText: 'SELECT',
  },
  {
    id: 'Pro',
    name: 'PRO',
    price: '$15/month',
    features: [
      ['Restaurants', '3'],
      ['Menu items', '50'],
      ['Tables', '20'],
      ['QR codes', '✅'],
      ['Digital menu', '✅'],
      ['Trial period', '14 days'],
    ],
    buttonText: 'SELECT',
    recommended: true,
  },
  {
    id: 'Business',
    name: 'BUSINESS',
    price: '$45/month',
    features: [
      ['Restaurants', 'Unlimited'],
      ['Menu items', 'Unlimited'],
      ['Tables', 'Unlimited'],
      ['QR codes', '✅'],
      ['Digital menu', '✅'],
      ['Trial period', '30 days'],
    ],
    buttonText: 'SELECT',
  },
]

async function subscribe({ userId, plan }) {
  try {
    const res = await fetch(`${API_BASE_URL}/stripe/create-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, plan }),
    })

    const data = await res.json()

    if (data.url) {
      // открываем Stripe Checkout в новой вкладке
      window.open(data.url, '_blank')
    } else {
      alert('You selected the free plan!')
      // можно сразу обновить UI или базу без оплаты
    }
  } catch (err) {
    console.error('Subscription error:', err)
  }
}

function getInitials(name) {
  if (!name) return 'U'
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

function normalizeUser(user) {
  return {
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'owner',
    plan: user?.plan?.toUpperCase() || '...',
  }
}

export default function Profile() {
  const { i18n } = useTranslation()
  const { t } = useTranslation()
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
    localStorage.setItem('language', lng)
  }

  const setCurrentUser = useCurrentUser((state) => state.setCurrentUser)

  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [saveError, setSaveError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [savedProfile, setSavedProfile] = useState({})
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
  })

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true)
        setError('')
        const data = await getCurrentUser()
        const user = normalizeUser(data?.user ?? data ?? null)
        setSavedProfile(user)
        setProfileForm({ name: user.name, email: user.email })
      } catch (err) {
        setError(err.message || 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  const handleChange = (field, value) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleCancel = () => {
    setProfileForm({ name: savedProfile.name, email: savedProfile.email })
    setSaveError('')
    setSaveSuccess('')
    setIsEditing(false)
  }

  const handleSave = async () => {
    const payload = {
      name: profileForm.name.trim(),
      email: profileForm.email.trim(),
    }

    if (!payload.name || !payload.email) {
      setSaveError('Name and email are required')
      return
    }

    try {
      setIsSaving(true)
      setSaveError('')
      setSaveSuccess('')

      const data = await updateCurrentUserProfile(payload)
      const user = normalizeUser(data?.user ?? data ?? null)

      setSavedProfile(user)
      setProfileForm({ name: user.name, email: user.email })
      setCurrentUser(user)
      setIsEditing(false)
      setSaveSuccess('Profile updated successfully')
    } catch (err) {
      setSaveError(err.message || 'Failed to update profile')
    } finally {
      setIsSaving(false)
      console.log(savedProfile)
    }
  }

  if (loading) {
    return <Loader label="Loading profile..." />
  }

  return (
    <section className="profile-page">
      <header className="profile-header">
        <h1>{t('profile.title')}</h1>
        <p className="subtitle">{t('profile.subtitle')}</p>
      </header>

      {error ? <p className="subtitle">{error}</p> : null}

      <article className="profile-hero">
        <div className="profile-avatar">{getInitials(savedProfile.name)}</div>
        <div className="profile-hero_info">
          <h2>{savedProfile.name || 'User'}</h2>
          <p>{savedProfile.email || '-'}</p>
        </div>
        <div className="profile-plan_box">
          <p>{t('profile.currentPlan')}</p>
          <span className="profile-role">{savedProfile.plan}</span>
        </div>
      </article>

      <div className="profile-grid">
        <article className="profile-card profile-card-wide">
          <div className="profile-card_head">
            <h3>{t('profile.subscriptionPlans')}</h3>
          </div>
          <div className="profile-plan_cards">
            {plans.map((plan) => (
              <div
                className={`profile-plan_card ${plan.recommended ? 'profile-plan_card-active' : ''}`}
                key={plan.id}
              >
                <h4>{plan.name}</h4>
                <p className="profile-plan_price">{plan.price}</p>
                <ul className="profile-plan_features">
                  {plan.features.map(([label, value]) => (
                    <li
                      className="profile-plan_feature"
                      key={`${plan.id}-${label}`}
                    >
                      <span>{label}</span>
                      <strong>{value}</strong>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() =>
                    subscribe({
                      userId: savedProfile.id,
                      plan: plan.id,
                    })
                  }
                  className="profile-plan_btn"
                  type="button"
                >
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>
        </article>

        <article className="profile-card">
          <div className="profile-card_head">
            <h3>{t('profile.profileDetails')}</h3>
            {!isEditing ? (
              <button
                className="profile-btn profile-btn-secondary"
                onClick={() => setIsEditing(true)}
                type="button"
              >
                {t('profile.editProfile')}
              </button>
            ) : null}
          </div>

          <div className="profile-form">
            <label className="profile-label">
              {t('profile.name')}
              <input
                className="profile-input"
                disabled={!isEditing || isSaving}
                onChange={(e) => handleChange('name', e.target.value)}
                type="text"
                value={profileForm.name}
              />
            </label>

            <label className="profile-label">
              {t('profile.email')}
              <input
                className="profile-input"
                disabled={!isEditing || isSaving}
                onChange={(e) => handleChange('email', e.target.value)}
                type="email"
                value={profileForm.email}
              />
            </label>
          </div>

          {saveError ? <p className="subtitle">{saveError}</p> : null}
          {saveSuccess ? <p className="subtitle">{saveSuccess}</p> : null}

          {isEditing ? (
            <div className="profile-actions">
              <button
                className="profile-btn profile-btn-primary"
                disabled={isSaving}
                onClick={handleSave}
                type="button"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button
                className="profile-btn profile-btn-secondary"
                disabled={isSaving}
                onClick={handleCancel}
                type="button"
              >
                {t('profile.cancel')}
              </button>
            </div>
          ) : null}
        </article>

        <article className="profile-card">
          <div className="profile-card_head">
            <h3>{t('profile.languageTitle')}</h3>
          </div>
          <label className="profile-label">
            {t('profile.language')}
            <select
              onChange={(e) => changeLanguage(e.target.value)}
              className="profile-input"
              defaultValue={savedLanguage}
            >
              <option value="en">English</option>
              <option value="ua">Українська</option>
              <option value="pl">Polski</option>
            </select>
          </label>
        </article>
      </div>
    </section>
  )
}
