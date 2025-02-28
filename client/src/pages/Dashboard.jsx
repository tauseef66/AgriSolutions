import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="container">
      <h1>Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={() => navigate('/update-profile')}>Update Profile</button>
      <button onClick={() => navigate('/delete-profile')}>Delete Profile</button>
    </div>
  );
};

export default Dashboard;