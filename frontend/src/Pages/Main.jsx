import Sidebar from '../Components/Sidebar'
import Dashboard from '../Subpages/Main/Dashboard'

export default function Main() {
  return (
    <>
      <main>
        <Sidebar />
        <div className="main_container">
          <Dashboard />
        </div>
      </main>
    </>
  )
}
