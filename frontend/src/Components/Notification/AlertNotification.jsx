import alert from '../../assets/icons/alert.svg'
import { useTranslation } from 'react-i18next'
import './Notification.css'

export default function AlertNotification({ children, style }) {
  const { t } = useTranslation()

  return (
    <div style={style} className="notification alert-notification">
      <img src={alert} alt={t('notifications.warningAlt')} />
      <div className="notification-info">
        <h4>{t('notifications.warningTitle')}</h4>
        <p>{children}</p>
      </div>
    </div>
  )
}
