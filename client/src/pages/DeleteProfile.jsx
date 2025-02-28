import React from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteProfile } from '../services/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DeleteProfile = () => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage
      await deleteProfile(userId);
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      toast.success('Profile deleted successfully!');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Deletion failed');
    }
  };

  return (
    <div className="container">
      <h1>Delete Profile</h1>
      <p>Are you sure you want to delete your profile?</p>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default DeleteProfile;