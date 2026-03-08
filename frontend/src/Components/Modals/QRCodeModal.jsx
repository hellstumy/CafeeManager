import './Modal.css'
import { useTranslation } from 'react-i18next'

export default function QRCodeModal({ isOpen, onClose, table }) {
  const { t } = useTranslation()
  if (!isOpen) return null

  async function handleDownload() {
    const response = await fetch(table.qr_code_url)
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `qr-table-${table.table_number}.png`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">
          <h2>{t('modals.qrCode.title', { number: table.table_number })}</h2>
          <button onClick={onClose}>&#735;</button>
        </div>
        <div className="qr_container">
          <img src={table.qr_code_url} alt="" />
          <p className="table_num">
            {t('modals.qrCode.table', { number: table.table_number })}
          </p>
        </div>
        <div className="form-buttons">
          <button onClick={handleDownload} className="form-cancel">
            {t('modals.common.download')}
          </button>
          <button onClick={onClose} className="form-accept">
            {t('modals.common.close')}
          </button>
        </div>
      </div>
    </div>
  )
}
