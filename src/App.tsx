import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import Checkout from './checkout'
import SuccessPayment from './succesPayment'

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Checkout />} />
        <Route path='/success-payment' element={<SuccessPayment />} />
      </Routes>
    </Router>
  )
}

export default App
