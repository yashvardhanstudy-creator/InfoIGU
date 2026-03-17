// import { useState } from 'react'
import { Route, Routes } from "react-router";
import "./App.css";
// import Departments from './pages/Departments'
import Department from "./pages/Department";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Auth from "./pages/Auth";
function App() {
  return (
    <Routes>
      <Route path="/profile/:name" element={<Profile />} />
      <Route path="/" element={<Department />} />
      <Route
        path="/edit"
        element={
          <EditProfile
            researchinterests="research"
            biosketch="hell"
            honors="f"
            students="s"
            miscellaneous="sa"
            research="hello"
          />
        }
      />
      <Route path="/auth" element={<Auth />} />

    </Routes>
  );
}

export default App;
