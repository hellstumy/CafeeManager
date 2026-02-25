import './Modal.css'

export default function QRCodeModal({ isOpen, onClose, t }) {
  if (!isOpen) return null

  async function handleDownload() {
    const response = await fetch(t.qr_code_url)
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `qr-table-${t.table_number}.png`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">
          <h2>QR Code - Table {t.table_number}</h2>
          <button onClick={onClose}>&#735;</button>
        </div>
        <div className="qr_container">
          <img src={t.qr_code_url} alt="" />
          <p className="table_num">Table {t.table_number}</p>
        </div>
        <div className="form-buttons">
          <button onClick={handleDownload} className="form-cancel">
            Download
          </button>
          <button onClick={onClose} className="form-accept">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
