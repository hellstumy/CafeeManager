import { useState } from 'react'
import delbutton from '../assets/icons/delete.svg'
import qrimg from '../assets/icons/qrcode.svg'
import QRCodeModal from './Modals/QRCodeModal'

export default function Table({ t }) {
  const [isQRCodeOpen, setIsQRCodeOpen] = useState(false)
  return (
    <div className="table_card">
      <div className="table-card_title">
        <p className="table-number">{t.table_number}</p>
        <button className="table-delete">
          <img src={delbutton} alt="" />
        </button>
      </div>
      <div>
        <p className="table_seats">Seats</p>
        <p className="table_seats">{t.seats} </p>
      </div>
      <div className="table_isActive">
        <p>Active</p>
        <label class="switch">
          <input type="checkbox" checked={t.is_active} />
          <span class="slider"></span>
        </label>
      </div>
      <button onClick={() => setIsQRCodeOpen(true)} className="view_qr">
        <img src={qrimg} alt="qr" /> View QR
      </button>
      <QRCodeModal
        isOpen={isQRCodeOpen}
        t={t}
        onClose={() => setIsQRCodeOpen(false)}
      />
    </div>
  )
}
