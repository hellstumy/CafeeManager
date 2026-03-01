export default function Loader({
  label = 'Loading...',
  inline = false,
  fullScreen = false,
  size = 'md',
}) {
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
      {label ? <p className="loader-label">{label}</p> : null}
    </div>
  )
}
