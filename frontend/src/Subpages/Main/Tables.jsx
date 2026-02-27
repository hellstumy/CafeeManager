import Table from '../../Components/Table'
import { useEffect, useState } from 'react'
import AddTableModal from '../../Components/Modals/AddTableModal'
import { getTables } from '../../api/api'
import { useSelectedRest } from '../../store/store'
export default function Tables() {
  const [isAddTableOpen, setIsAddTableOpen] = useState(false)
  const [tables, setTables] = useState([])
  const selectedRest = useSelectedRest((state) => state.selectedRest)
  useEffect(() => {
    getTables(selectedRest).then((data) => {
      setTables(data.tables)
      console.log(data.tables)
    })
  }, [])
  return (
    <div className="table-page">
      <div className="table-title">
        <h1>Tables Management</h1>
        <button onClick={() => setIsAddTableOpen(true)}>Add Table</button>
      </div>
      <p className="subtitle">Manage tables and QR codes</p>
      <div className="tables_stats">
        <div className="table-stat_card">
          <p className="table-stat_title">Total Tables</p>
          <h5 className="table-stat_value">{tables.length}</h5>
        </div>
        <div className="table-stat_card">
          <p className="table-stat_title">Active Tables</p>
          <h5 className="table-stat_value">5</h5>
        </div>
        <div className="table-stat_card">
          <p className="table-stat_title">Total Seats</p>
          <h5 className="table-stat_value">26</h5>
        </div>
      </div>
      <div className="table_list">
        {tables.map((t) => (
          <Table key={t.id} t={t} />
        ))}
      </div>
      <AddTableModal
        isOpen={isAddTableOpen}
        onClose={() => setIsAddTableOpen(false)}
      />
    </div>
  )
}
