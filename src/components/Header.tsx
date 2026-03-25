import { useState } from "react";
import { Button } from "@mui/material"
import { useNavigate } from "react-router-dom"
import UserProfile from "./UserProfile";


const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!UserProfile.getName());

  const handleLogout = () => {
    UserProfile.setName("");
    UserProfile.setRole(false);
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <header className="bg-gray-800 text-white p-4 flex items-center justify-between">
      <nav>

        <ul className="flex space-x-4">
          <li><a href="/" className="hover:text-yellow-300">Indira Gandhi University</a></li>
        </ul>
      </nav>
      <div className="flex gap-2">

        <Button style={{
          padding: '10px 20px',
          backgroundColor: '#0056b3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
          onClick={() => { navigate(isLoggedIn ? '/edit' : '/auth'); }}
        >
          Edit Profile
        </Button>
        <Button
          onClick={() => navigate('/contact')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#0056b3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Contact Us
        </Button>
        {isLoggedIn && (
          <Button
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Logout
          </Button>
        )}
      </div>
    </header >
  )
}

export default Header