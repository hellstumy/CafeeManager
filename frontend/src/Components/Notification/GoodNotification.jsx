import check from '../../assets/icons/check.svg'
import { useTranslation } from 'react-i18next'
import './Notification.css'

export default function GoodNotification({ children, style }) {
  const { t } = useTranslation()

  return (
    <div style={style} className="notification good-notification">
      <img src={check} alt={t('notifications.successAlt')} />
      <div className="notification-info">
        <h4>{t('notifications.successTitle')}</h4>
        <p>{children}</p>
      </div>
    </div>
  )
}
