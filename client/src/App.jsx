import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Navbar from './components/Navbar'
import Product from './pages/Product'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './components/AdminLayout'
import AddProduct from './pages/admin/AddProduct'
import ProductList from './pages/admin/ProductList'
import UpdateProduct from './pages/admin/UpdateProduct'

function App() {

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
            <Route path="/admin" element={<AdminLayout />}>
                <Route path='/admin/products' element={<ProductList />} />
                <Route path='/admin/product' element={<AddProduct />} />
                <Route path='/admin/product/:id' element={<UpdateProduct />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
