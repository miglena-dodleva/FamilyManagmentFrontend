// src/components/user/AccountModal.js
import React, { useState, useEffect } from "react";
import { Box, Button, Modal, Typography, IconButton } from "@mui/material";
import axiosApiInstance from "../../interceptors/axios";
import CloseIcon from "@mui/icons-material/Close";

import EditUserDialog from "./EditUserDialog";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const familyRoleMapping = {
  0: "Admin",
  1: "Member",
};

function AccountModal({ open, handleClose }) {
  const [userData, setUserData] = useState({});
  const [error, setError] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const fetchUserData = async () => {
    setError(null);
    const userId = localStorage.getItem("userId");
  
    if (!userId) {
      setError("No user ID found. Please log in again.");
      console.error("No user ID found in localStorage.");
      return;
    }

    try {
      const { data } = await axiosApiInstance.get(`/api/User/userById/${userId}`);
      if (data.data) {
        setUserData(data.data);
        setSelectedUserId(userId); // Only set the user ID if the fetch is successful
      } else {
        setError("No user data available.");
        console.error("No data received from API for user:", userId);
      }
    } catch (err) {
      setError("Failed to fetch user data. Please try again.");
      console.error("Error fetching user data for ID:", userId, err);
    }
  };
  
  useEffect(() => {
    
    if (open) {
      fetchUserData();
    }
  }, [open, fetchUserData]);

  const handleEdit = (id) => {
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setSelectedUserId(null);
    fetchUserData();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-title" variant="h6" component="h2">
          User Account
        </Typography>
        <EditUserDialog
          open={editModalOpen}
          handleClose={handleEditModalClose}
          userId={selectedUserId}
        />

        <IconButton
          onClick={handleClose}
          style={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
        {error && <Typography color="error">{error}</Typography>}
        {userData ? (
          <Box>
            <Typography variant="body1">
              <strong>First Name:</strong> {userData.firstName}
            </Typography>
            <Typography variant="body1">
              <strong>Last Name:</strong> {userData.lastName}
            </Typography>
            <Typography variant="body1">
              <strong>Email:</strong> {userData.email}
            </Typography>
            <Typography variant="body1">
              <strong>Username:</strong> {userData.username}
            </Typography>
            <Typography variant="body1">
              <strong>Phone Number:</strong> {userData.phoneNumber}
            </Typography>
            <Typography variant="body1">
              <strong>Family Role:</strong>{" "}
              {familyRoleMapping[userData.familyRole]}
            </Typography>
          </Box>
        ) : (
          !error && <Typography>Loading...</Typography>
        )}

        <Button
          type="button"
          fullWidth
          variant="contained"
          onClick={handleEdit}
          sx={{ mt: 2 }}
        >
          Edit
        </Button>
        <Button
          type="button"
          fullWidth
          variant="contained"
          onClick={handleClose}
          sx={{ mt: 2 }}
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
}

export default AccountModal;
