// import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
// import Departments from './pages/Departments'
import Department from './pages/Department'
import Profile from './pages/Profile'
import EditProfile from './pages/EditProfile'
function App() {

  return (
    <Routes>
      {/* <Route path="/" element={<Profile researchinterests='research' biosketch='hell' honors='f' students='s' miscellaneous='sa' research='hello' />} /> */}
      <Route path="/" element={<Profile researchinterests='research' biosketch='hell' honors='f' students='s' miscellaneous='sa' research='hello' />} />
      <Route path="/department" element={<Department />} />

      <Route path="/profile" element={<Profile researchinterests='research' />} />
    </Routes>
  )
}

export default App
