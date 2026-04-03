import { useState } from "react";
import { useNavigate } from "react-router-dom"
import UserProfile from "./UserProfile";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography } from "@mui/material";
import * as constants from "../components/constants";


const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!UserProfile.getName());
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogout = () => {
    UserProfile.setName("");
    UserProfile.setRole(false);
    setIsLoggedIn(false);
    navigate("/");
  };
  const handleChangePassword = async () => {
    setError("");
    setSuccess("");
    try {
      const response = await fetch(`${constants.SERVER_URL}api/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: UserProfile.getName(),
          oldPassword,
          newPassword,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setSuccess("Password changed successfully!");
        setTimeout(() => {
          setIsChangePasswordOpen(false);
          setOldPassword("");
          setNewPassword("");
          setSuccess("");
        }, 1500);
      } else {
        setError(data.message || "Failed to change password.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };
  return (
    <header className="bg-gray-800 text-white p-4 flex sm:flex-row flex-col items-center justify-between">
      <nav>

        <ul className="flex space-x-4">
          <li><a href="/" className="hover:text-yellow-300">Indira Gandhi University</a></li>
        </ul>
      </nav>
      <div className="flex gap-2 sm:mt-0 mt-4 sm:flex-row flex-col items-center justify-between">

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
            onClick={() => setIsChangePasswordOpen(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Change Password
          </Button>
        )}
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
      <Dialog open={isChangePasswordOpen} onClose={() => setIsChangePasswordOpen(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Current Password"
            type="password"
            fullWidth
            variant="outlined"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <TextField
            margin="dense"
            label="New Password"
            type="password"
            fullWidth
            variant="outlined"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          {error && <Typography color="error" variant="body2" style={{ marginTop: '8px' }}>{error}</Typography>}
          {success && <Typography color="success" variant="body2" style={{ marginTop: '8px', color: 'green' }}>{success}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsChangePasswordOpen(false)}>Cancel</Button>
          <Button onClick={handleChangePassword} variant="contained" color="primary">Submit</Button>
        </DialogActions>
      </Dialog>
    </header >
  )
}

export default Header