import React, { useState } from 'react';
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
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import axiosApiInstance from '../../interceptors/axios';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(5),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(3),
  },
}));

function CreateEventModal({ open, handleClose, calendarId }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isAFullDayEvent, setIsAFullDayEvent] = useState(false);
  const [themeColor, setThemeColor] = useState('');
  const [isRepeatEvent, setIsRepeatEvent] = useState('');
  const [error, setError] = useState(null);

  const handleFullDayChange = (e) => {
    const isFullDay = e.target.value;
    setIsAFullDayEvent(isFullDay);

    if (isFullDay) {
      // Ако е цял ден, настройваме времето на 24 часа
      const start = new Date(startDate);
      const end = new Date(startDate);
      end.setHours(23, 59, 59, 999); // 24 часа

      setStartDate(start.toISOString().substring(0, 16));
      setEndDate(end.toISOString().substring(0, 16));
    }
  };

  const handleSubmit = async () => {
    setError(null);

    try {
      await axiosApiInstance.post('/api/Event/create', {
        title,
        description,
        startDate,
        endDate,
        isAFullDayEvent,
        themeColor,
        isRepeatEvent,
        calendarId,
      });

      setTitle('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setIsAFullDayEvent(false);
      setThemeColor('');
      setIsRepeatEvent('');
      handleClose();
    } catch (err) {
      setError('Failed to create event. Please try again.');
      console.error(err);
    }
  };

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Create Event
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
          label="Event Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          margin="dense"
        />
        <TextField
          label="Event Description"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          multiline
          rows={4}
          margin="dense"
        />
        <TextField
          label="Start Date"
          type="datetime-local"
          fullWidth
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
          InputLabelProps={{
            shrink: true,
          }}
          margin="dense"
        />
        <TextField
          label="End Date"
          type="datetime-local"
          fullWidth
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
          InputLabelProps={{
            shrink: true,
          }}
          margin="dense"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Is a Full Day Event?</InputLabel>
          <Select
            label="Is a Full Day Event?"
            value={isAFullDayEvent}
            onChange={handleFullDayChange}
            required
          >
            <MenuItem value={false}>No</MenuItem>
            <MenuItem value={true}>Yes</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Theme Color</InputLabel>
          <Select
            label="Theme Color"
            value={themeColor}
            onChange={(e) => setThemeColor(e.target.value)}
            required
          >
            <MenuItem value={0}>Red</MenuItem>
            <MenuItem value={1}>Blue</MenuItem>
            <MenuItem value={2}>Green</MenuItem>
            <MenuItem value={3}>Yellow</MenuItem>
            <MenuItem value={4}>Orange</MenuItem>
            <MenuItem value={5}>Purple</MenuItem>
            <MenuItem value={6}>Pink</MenuItem>
            <MenuItem value={7}>Gray</MenuItem>
            <MenuItem value={8}>Black</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Repeat Type</InputLabel>
          <Select
            label="Repeat Type"
            value={isRepeatEvent}
            onChange={(e) => setIsRepeatEvent(e.target.value)}
            required
          >
            <MenuItem value={0}>None</MenuItem>
            <MenuItem value={1}>Daily</MenuItem>
            <MenuItem value={2}>Weekly</MenuItem>
            <MenuItem value={3}>Monthly</MenuItem>
            <MenuItem value={4}>Yearly</MenuItem>
          </Select>
        </FormControl>
        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleSubmit}>
          Create Event
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}

export default CreateEventModal;
