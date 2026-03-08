import Table from '../../Components/Table'
import { useEffect, useState } from 'react'
import AddTableModal from '../../Components/Modals/AddTableModal'
import { getTables } from '../../api/api'
import { useSelectedRest } from '../../store/store'
import TableLoader from '../../Ui/Skeleton/TableLoader'
import { useTranslation } from 'react-i18next'

export default function Tables() {
  const { t } = useTranslation()
  const [isAddTableOpen, setIsAddTableOpen] = useState(false)
  const [tables, setTables] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const selectedRest = useSelectedRest((state) => state.selectedRest)

  const fetchTables = () => {
    if (!selectedRest) {
      setTables([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    getTables(selectedRest).then((data) => {
      setTables(data.tables || [])
    }).finally(() => setIsLoading(false))
  }

  useEffect(() => {
    fetchTables()
  }, [selectedRest])

  const handleStatusChanged = (updatedTable) => {
    setTables((prevTables) =>
      prevTables.map((table) =>
        table.id === updatedTable.id ? { ...table, ...updatedTable } : table
      )
    )
  }

  const handleTableCreated = (table) => {
    if (!table?.id) {
      fetchTables()
      return
    }

    setTables((prevTables) => {
      const exists = prevTables.some((item) => item.id === table.id)
      if (exists) return prevTables
      return [...prevTables, table]
    })
  }

  const handleTableDeleted = (tableId) => {
    setTables((prevTables) => prevTables.filter((table) => table.id !== tableId))
  }

  const activeTables = tables.filter((table) => table.is_active).length
  const totalSeats = tables.reduce(
    (sum, table) => sum + Number(table.seats || 0),
    0
  )

  return (
    <div className="table-page">
      <div className="table-title">
        <h1>{t('main.tablesPage.title')}</h1>
        <button onClick={() => setIsAddTableOpen(true)}>
          {t('main.tablesPage.addTable')}
        </button>
      </div>
      <p className="subtitle">{t('main.tablesPage.subtitle')}</p>
      <div className="tables_stats">
        <div className="table-stat_card">
          <p className="table-stat_title">{t('main.tablesPage.totalTables')}</p>
          <h5 className="table-stat_value">{tables.length}</h5>
        </div>
        <div className="table-stat_card">
          <p className="table-stat_title">{t('main.tablesPage.activeTables')}</p>
          <h5 className="table-stat_value">{activeTables}</h5>
        </div>
        <div className="table-stat_card">
          <p className="table-stat_title">{t('main.tablesPage.totalSeats')}</p>
          <h5 className="table-stat_value">{totalSeats}</h5>
        </div>
      </div>
      <div className="table_list">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => <TableLoader key={index} />)
        ) : tables.length > 0 ? (
          tables.map((table) => (
            <Table
              key={table.id}
              onDeleted={handleTableDeleted}
              onStatusChanged={handleStatusChanged}
              table={table}
            />
          ))
        ) : (
          <p className="subtitle">{t('main.tablesPage.empty')}</p>
        )}
      </div>
      <AddTableModal
        isOpen={isAddTableOpen}
        onClose={() => setIsAddTableOpen(false)}
        onCreated={handleTableCreated}
      />
    </div>
  )
}
