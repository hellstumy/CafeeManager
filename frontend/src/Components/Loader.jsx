import { useTranslation } from 'react-i18next'

export default function Loader({
  label,
  inline = false,
  fullScreen = false,
  size = 'md',
}) {
  const { t } = useTranslation()
  const displayLabel = label === undefined ? t('loader.default') : label
  const wrapClass = [
    'loader-wrap',
    inline ? 'loader-wrap-inline' : '',
    fullScreen ? 'loader-wrap-full' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={wrapClass} role="status">
      <span className={`loader-orbit loader-orbit-${size}`} aria-hidden="true" />
      {displayLabel ? <p className="loader-label">{displayLabel}</p> : null}
    </div>
  )
}
