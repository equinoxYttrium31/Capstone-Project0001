import './App.css'
import Header from './components/header/Header'
import Main_Dashboard from './pages/main_dashboard/Main_Dashboard'
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className='main_cont'>
      <div className="header">
          <Header></Header>
      </div>
      <div className="dashboard">
          <Main_Dashboard></Main_Dashboard>
      </div>
      {/* Toast notifications */}
      <Toaster position='bottom-right'
        reverseOrder={false}
        gutter={3}
        toastOptions={{
          duration: 2000,
          style: { zIndex: 9999 }
        }} />
    </div>
  )
}

export default App