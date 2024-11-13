import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from'react-toastify'
import Home from './pages/Home'
import Header from './components/Header'

function App() {
  const [count, setCount] = useState(0)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/home" element={<Home/>}/>
      </Routes>
      <ToastContainer/>
    </>
  )
}

export default App
