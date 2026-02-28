import { useEffect, useState } from 'react'
import delbutton from '../assets/icons/delete.svg'
import qrimg from '../assets/icons/qrcode.svg'
import QRCodeModal from './Modals/QRCodeModal'
import { deleteTable } from '../api/api'
import { updateTable } from '../api/api'
export default function Table({ t, onStatusChanged }) {
  const [isQRCodeOpen, setIsQRCodeOpen] = useState(false)
  const [isActive, setIsActive] = useState(t.is_active)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    setIsActive(t.is_active)
  }, [t.is_active])

  const handleDelete = () => {
    try {
      deleteTable(t.id)
    } catch (err) {
      console.log(err)
      alert('Error, Please try later!')
    }
  }

  const handleStatusChange = async (e) => {
    const nextValue = e.target.checked
    const prevValue = isActive

    setIsActive(nextValue)
    setIsUpdating(true)

    try {
      const data = await updateTable(t.id, { is_active: nextValue })
      onStatusChanged?.(data?.table || { ...t, is_active: nextValue })
    } catch (err) {
      setIsActive(prevValue)
      console.log(err)
      alert('Failed to update table status. Please try again.')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="table_card">
      <div className="table-card_title">
        <p className="table-number">{t.table_number}</p>
        <button onClick={() => handleDelete()} className="table-delete">
          <img src={delbutton} alt="" />
        </button>
      </div>
      <div>
        <p className="table_seats">Seats</p>
        <p className="table_seats">{t.seats} </p>
      </div>
      <div className="table_isActive">
        <p>Active</p>
        <label className="switch">
          <input
            type="checkbox"
            checked={isActive}
            onChange={handleStatusChange}
            disabled={isUpdating}
          />
          <span className="slider"></span>
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
