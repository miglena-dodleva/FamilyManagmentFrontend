import React from 'react';
import { Button, IconButton } from '@mui/material';
import { Popup } from '@mobiscroll/react';
import CloseIcon from '@mui/icons-material/Close';

function EventPopup({ event, isOpen, anchor, onClose, onEdit, onDelete }) {
  
    const mapThemeColor = (themeColor) => {
    const colorMap = {
        0: '#ffcccc', // soft red
        1: '#cce5ff', // soft blue
        2: '#ccffcc', // soft green
        3: '#fff3cc', // soft yellow
        4: '#ffdacc', // soft orange
        5: '#ebccff', // soft purple
        6: '#ffccf2', // soft pink
        7: '#f2f2f2', // soft gray
        8: '#cccccc'  // soft black
      
    };
    return colorMap[themeColor] || 'defaultColor';
  };

  const getRepeatRule = (repeatType) => {
    const repeatMap = {
      0: 'not repeated', 1: 'daily', 2: 'weekly', 3: 'monthly', 4: 'yearly'
    };
    return repeatMap[repeatType];
  };

  const handleEdit = () => {
    onEdit();
    onClose(); // Close the popup after clicking Edit
  };

  const handleDelete = () => {
    onDelete();
    onClose(); // Close the popup after clicking Delete
  };

  return (
    <Popup
      display="anchored"
      isOpen={isOpen}
      anchor={anchor}
      touchUi={false}
      showOverlay={false}
      contentPadding={false}
      closeOnOverlayClick={false}
      width={350}
      cssClass="md-tooltip"
      onClose={onClose}
    >
      <div>
        <div className="md-tooltip-header" style={{ backgroundColor: mapThemeColor(event.themeColor) }}>
          <span className="md-tooltip-name-age">{event.title}</span>
          {/* <IconButton  className="md-tooltip-close-button" onClick={onClose}>
            <CloseIcon />
          </IconButton>
         <span className="md-tooltip-time">{event.start.toLocaleString()} - {event.end.toLocaleString()}</span>*/}
        </div>
        <div className="md-tooltip-info">
          <div className="md-tooltip-title">
            Start Date: <span className="md-tooltip-status md-tooltip-text">{event.start.toLocaleString()}</span>
          </div>
          <div className="md-tooltip-title">
            End Date: <span className="md-tooltip-status md-tooltip-text">{event.end.toLocaleString()}</span>
          </div>
          <div className="md-tooltip-title">
            Description: <span className="md-tooltip-status md-tooltip-text">{event.description}</span>
          </div>
          <div className="md-tooltip-title">
             Is the event all day: <span className="md-tooltip-reason md-tooltip-text">{event.isAFullDayEvent ? 'Yes' : 'No'}</span>
          </div>
          <div className="md-tooltip-title">
            Repeat Type: <span className="md-tooltip-location md-tooltip-text">{getRepeatRule(event.isRepeatEvent)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>   
          <Button color="primary" variant="contained" className="md-tooltip-view-button" onClick={onEdit}>
            Edit
          </Button>
          <Button color="secondary" variant="contained" className="md-tooltip-delete-button" onClick={onDelete}>
            Delete
          </Button>
          </div>
        </div>
      </div>
    </Popup>
  );
}

export default EventPopup;
