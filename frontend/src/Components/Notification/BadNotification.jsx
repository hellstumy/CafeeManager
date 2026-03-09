import cross from '../../assets/icons/cross.svg'
import { useTranslation } from 'react-i18next'
import './Notification.css'

export default function BadNotification({ children, style }) {
  const { t } = useTranslation()

  return (
    <div style={style} className="notification bad-notification">
      <img src={cross} alt={t('notifications.errorAlt')} />
      <div className="notification-info">
        <h4>{t('notifications.errorTitle')}</h4>
        <p>{children}</p>
      </div>
    </div>
  )
}
