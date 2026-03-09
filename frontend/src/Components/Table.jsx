import { useEffect, useState } from 'react'
import delbutton from '../assets/icons/delete.svg'
import qrimg from '../assets/icons/qrcode.svg'
import QRCodeModal from './Modals/QRCodeModal'
import { deleteTable } from '../api/api'
import { updateTable } from '../api/api'
import { useTranslation } from 'react-i18next'
import useNotification from '../context/useNotification'

export default function Table({ table, onStatusChanged, onDeleted }) {
  const { t } = useTranslation()
  const { notifyBad } = useNotification()
  const [isQRCodeOpen, setIsQRCodeOpen] = useState(false)
  const [isActive, setIsActive] = useState(table.is_active)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    setIsActive(table.is_active)
  }, [table.is_active])

  const handleDelete = async () => {
    try {
      await deleteTable(table.id)
      onDeleted?.(table.id)
    } catch (err) {
      console.log(err)
      notifyBad(t('alerts.tableDeleteFailed'))
    }
  }

  const handleStatusChange = async (e) => {
    const nextValue = e.target.checked
    const prevValue = isActive

    setIsActive(nextValue)
    setIsUpdating(true)

    try {
      const data = await updateTable(table.id, { is_active: nextValue })
      onStatusChanged?.(data?.table || { ...table, is_active: nextValue })
    } catch (err) {
      setIsActive(prevValue)
      console.log(err)
      notifyBad(t('alerts.tableUpdateFailed'))
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="table_card">
      <div className="table-card_title">
        <p className="table-number">{table.table_number}</p>
        <button onClick={() => handleDelete()} className="table-delete">
          <img src={delbutton} alt="" />
        </button>
      </div>
      <div>
        <p className="table_seats">{t('main.tablesPage.seats')}</p>
        <p className="table_seats">{table.seats} </p>
      </div>
      <div className="table_isActive">
        <p>{t('main.tablesPage.active')}</p>
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
        <img src={qrimg} alt="qr" /> {t('main.tablesPage.viewQr')}
      </button>
      <QRCodeModal
        isOpen={isQRCodeOpen}
        table={table}
        onClose={() => setIsQRCodeOpen(false)}
      />
    </div>
  )
}
