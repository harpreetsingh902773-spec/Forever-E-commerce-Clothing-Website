import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Orders from './pages/Orders'
import PlaceOrder from './pages/PlaceOrder'
import Card from './pages/Card'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import Product from './pages/Product'
import Dashboard from './pages/Dashboard'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <ToastContainer />
      <Navbar />
      <SearchBar/>

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/Collection' element={<Collection />} />
        <Route path='/About' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/Login' element={<Login />} />
        <Route path='/Orders' element={<Orders />} />
        <Route path='/PlaceOrders' element={<PlaceOrder />} />
        <Route path='/Card' element={<Card />} />
        <Route path='/product/:productId' element={<Product/>} />
        <Route path='/Dashboard' element={<Dashboard />} />
        
      </Routes>
    <Footer />
    </div>
  )
}

export default App
