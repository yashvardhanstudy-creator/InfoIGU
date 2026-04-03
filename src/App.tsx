// import { useState } from 'react'
import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
// import Departments from './pages/Departments'
import Department from "./pages/Department";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Auth from "./pages/Auth";
import Contact from "./pages/Contact";
import UserProfile from "./components/UserProfile";
import ResumePrint from "./pages/ResumePrint";
import DevSQL from "./pages/DevSQL";
import AdminDashboard from "./pages/AdminDashboard";

const NotFound = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-[#1A365D]">
    <h1 className="text-6xl font-bold mb-4">404</h1>
    <p className="text-2xl mb-8">Page Not Found</p>
    <a href="/" className="bg-[#1A365D] text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition">
      Go Back Home
    </a>
  </div>
);

const ProtectedRoute = ({ children }: any) => {
  if (!UserProfile.getName()) {
    return <Navigate to="/auth" replace />;
  }
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/profile/:name" element={<Profile />} />
      <Route path="/" element={<Department />} />
      <Route
        path="/edit"
        element={
          <ProtectedRoute>
            <EditProfile editMode={true} />
          </ProtectedRoute>
        }
      />
      <Route path="/dev" element={<DevSQL />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/resume/:name" element={<ResumePrint />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
