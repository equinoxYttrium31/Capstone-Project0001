import './App.css'
import Header from './components/header/Header'
import Main_Dashboard from './pages/main_dashboard/Main_Dashboard'

function App() {
  return (
    <div className='main_cont'>
      <div className="header">
          <Header></Header>
      </div>
      <div className="dashboard">
          <Main_Dashboard></Main_Dashboard>
      </div>

    </div>
  )
}

export default App