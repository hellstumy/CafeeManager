import { useState } from 'react'
import delbutton from '../assets/icons/delete.svg'
import qrimg from '../assets/icons/qrcode.svg'
import QRCodeModal from './Modals/QRCodeModal'

export default function Table() {
  const [isQRCodeOpen, setIsQRCodeOpen] = useState(false)
  return (
    <div className="table_card">
      <div className="table-card_title">
        <p className="table-number">1</p>
        <button className="table-delete">
          <img src={delbutton} alt="" />
        </button>
      </div>
      <div>
        <p className="table_seats">Seats</p>
        <p className="table_seats">2 people</p>
      </div>
      <div className="table_isActive">
        <p>Active</p>
        <label class="switch">
          <input type="checkbox" />
          <span class="slider"></span>
        </label>
      </div>
      <button onClick={() => setIsQRCodeOpen(true)} className="view_qr">
        <img src={qrimg} alt="qr" /> View QR
      </button>
      <QRCodeModal
        isOpen={isQRCodeOpen}
        onClose={() => setIsQRCodeOpen(false)}
      />
    </div>
  )
}
