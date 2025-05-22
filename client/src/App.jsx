import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Navbar from './components/Navbar'
import Product from './pages/Product'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/admin/Dashboard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='px-[9vw]'>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* client routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path='/product/:id' element={<Product />} />

          {/* admin routes - protected */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                <Route path='/admin/dashboard' element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
