import React, { useState, useEffect, useCallback } from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axiosApiInstance from '../../interceptors/axios';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function EditAccountDialog({ open, handleClose, userId }) {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    phoneNumber: ''
  });
  const [error, setError] = useState(null);

  const fetchUserData = useCallback(async () => {
    if (!userId) return;

    try {
      const { data } = await axiosApiInstance.get(`/api/User/userById/${userId}`);
      setUserData(data.data);
    } catch (err) {
      console.error('Failed to fetch user data:', err);
      setError('Failed to fetch user data. Please try again.');
    }
  }, [userId]);

  useEffect(() => {
    if (open) {
      fetchUserData();
    }
  }, [open, fetchUserData]);

  const handleSubmit = async () => {
    setError(null);

    try {
      await axiosApiInstance.patch(`/api/User/edit/${userId}`, userData);

      handleClose(); // Optionally refresh user data or handle success state
    } catch (err) {
      setError('Failed to update user. Please try again.');
      console.error(err);
    }
  };

  const handleChange = (prop) => (event) => {
    setUserData({ ...userData, [prop]: event.target.value });
  };

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Edit Account
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <TextField
          label="First Name"
          fullWidth
          value={userData.firstName}
          onChange={handleChange('firstName')}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Last Name"
          fullWidth
          value={userData.lastName}
          onChange={handleChange('lastName')}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Email"
          fullWidth
          value={userData.email}
          onChange={handleChange('email')}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Username"
          fullWidth
          value={userData.username}
          onChange={handleChange('username')}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Phone Number"
          fullWidth
          value={userData.phoneNumber}
          onChange={handleChange('phoneNumber')}
          required
          sx={{ mb: 2 }}
        />
        {error && <Typography color="error">{error}</Typography>}
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleSubmit}>
          Save Changes
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}
