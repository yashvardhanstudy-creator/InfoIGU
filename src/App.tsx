// import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
// import Departments from './pages/Departments'
import Department from './pages/Department'
import Profile from './pages/Profile'
function App() {

  return (
    <Routes>
      <Route path="/" element={<Profile researchinterests='research' biosketch='hell' />} />
      <Route path="/department" element={<Department />} />

      <Route path="/profile" element={<Profile researchinterests='research' />} />
    </Routes>
  )
}

export default App
