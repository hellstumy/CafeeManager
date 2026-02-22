import Table from '../../Components/Table'

export default function Tables() {
  return (
    <div className="table-page">
      <div className="table-title">
        <h1>Tables Management</h1>
        <button>Add Table</button>
      </div>
      <p className="subtitle">Manage tables and QR codes</p>
      <div className="tables_stats">
        <div className="table-stat_card">
          <p className="table-stat_title">Total Tables</p>
          <h5 className="table-stat_value">6</h5>
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
        <Table />
        <Table />
        <Table />
      </div>
    </div>
  )
}
