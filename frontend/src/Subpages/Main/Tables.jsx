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
    if (!selectedRest) return

    getTables(selectedRest).then((data) => {
      setTables(data.tables)
      console.log(data.tables)
    })
  }, [selectedRest])

  const handleStatusChanged = (updatedTable) => {
    setTables((prevTables) =>
      prevTables.map((table) =>
        table.id === updatedTable.id ? { ...table, ...updatedTable } : table
      )
    )
  }

  const activeTables = tables.filter((table) => table.is_active).length
  const totalSeats = tables.reduce(
    (sum, table) => sum + Number(table.seats || 0),
    0
  )

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
          <h5 className="table-stat_value">{activeTables}</h5>
        </div>
        <div className="table-stat_card">
          <p className="table-stat_title">Total Seats</p>
          <h5 className="table-stat_value">{totalSeats}</h5>
        </div>
      </div>
      <div className="table_list">
        {tables.map((t) => (
          <Table key={t.id} t={t} onStatusChanged={handleStatusChanged} />
        ))}
      </div>
      <AddTableModal
        isOpen={isAddTableOpen}
        onClose={() => setIsAddTableOpen(false)}
      />
    </div>
  )
}
