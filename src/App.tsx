import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Department from "./pages/Department";
import EditProfile from "./pages/EditProfile";
import Contact from "./pages/Contact";
import UserProfile from "./components/UserProfile";
import ResumePrint from "./pages/ResumePrint";
import DevSQL from "./pages/DevSQL";
import { lazy, Suspense } from 'react';

const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const Auth = lazy(() => import('./pages/Auth'));

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
    <Suspense fallback={<div className="p-8 text-center text-[#1A365D] font-bold">Loading Page...</div>}>
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
    </Suspense >
  );
}

export default App;
