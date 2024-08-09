import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosApiInstance from "../../interceptors/axios";
import { Button, Snackbar } from "@mui/material";
import CreateEventModal from "./CreateEventModal";
import { Eventcalendar, setOptions } from "@mobiscroll/react";
import EventPopup from "./EventPopup"; // Импортиране на новия компонент

import "@mobiscroll/react/dist/css/mobiscroll.min.css";
// Импортиране на глобалния CSS файл

setOptions({
    theme: 'ios',
    themeVariant: 'light'
});

function ViewCalendarEvents() {
  const { id: calendarId } = useParams();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [isToastOpen, setToastOpen] = useState(false);
  const [toastText, setToastText] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [anchor, setAnchor] = useState(null);

  const fetchEvents = useCallback(async () => {
    try {
      const { data } = await axiosApiInstance.get(`/api/Event/all`);
      console.log('Fetched data:', data);
      const filteredEvents = data.map((event) => {
        return {
          ...event,
          start: new Date(event.startDate),
          end: new Date(event.endDate),
          color: mapThemeColor(event.themeColor),
          recurring: event.isRepeatEvent !== 0 ? { repeat: getRepeatRule(event.isRepeatEvent) } : undefined
        };
      }).filter((event) => event.calendarId === Number(calendarId));
      console.log('Filtered events:', filteredEvents);
      setEvents(filteredEvents);
    } catch (error) {
      console.error("Failed to fetch events", error);
      setToastText('Failed to load events. Please try again later.');
      setToastOpen(true);
    }
  }, [calendarId]);

  const mapThemeColor = (themeColor) => {
    const colorMap = {
      
      0: 'red', 1: 'blue', 2: 'green', 3: 'yellow', 4: 'orange', 5: 'purple', 6: 'pink', 7: 'gray', 8: 'black'
    };
    return colorMap[themeColor] || '#ffffff'; // default to white if no match
  };

  const getRepeatRule = (repeatType) => {
    const repeatMap = {
      1: 'daily', 2: 'weekly', 3: 'monthly', 4: 'yearly'
    };
    return repeatMap[repeatType];
  };

  const handleToastClose = useCallback(() => {
    setToastOpen(false);
  }, []);

  const handleEventClick = useCallback((args) => {
    setSelectedEvent(args.event);
    setAnchor(args.domEvent.target);
    setPopupOpen(true);
  }, []);

  const handleEventDoubleClick = useCallback((args) => {
    setSelectedEvent(args.event);
    setAnchor(args.domEvent.target);
    setPopupOpen(false);
  }, []);

  const handleEditEvent = useCallback(() => {
    setCreateModalOpen(true);
    setPopupOpen(false);
  }, []);

  const handleDeleteEvent = useCallback(async () => {
    try {
      await axiosApiInstance.delete(`/api/Event/delete/${selectedEvent.id}`);
      fetchEvents();
      setPopupOpen(false);
    } catch (error) {
      console.error("Failed to delete event", error);
      setToastText('Failed to delete event. Please try again later.');
      setToastOpen(true);
    }
  }, [selectedEvent, fetchEvents]);

  const myView = useMemo(() => ({ calendar: { labels: true } }), []);

  const handleCreateModalOpen = () => {
    setCreateModalOpen(true);
  };

  const handleCreateModalClose = () => {
    setCreateModalOpen(false);
    fetchEvents();
  };

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <div>
      <div style={{ paddingTop: '5px', paddingBottom: '5px' }}></div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateModalOpen}
        aria-label="Create new event"
      >
        Create Event
      </Button>
      <CreateEventModal open={createModalOpen} handleClose={handleCreateModalClose} calendarId={calendarId} />
      <Eventcalendar
        clickToCreate={false}
        dragToCreate={false}
        dragToMove={false}
        dragToResize={false}
        eventDelete={false}
        data={events}
        view={myView}
        onEventDoubleClick={handleEventDoubleClick}
        onEventClick={handleEventClick}
      />
      {selectedEvent && (
        <EventPopup
          event={selectedEvent}
          isOpen={isPopupOpen}
          anchor={anchor}
          onClose={() => setPopupOpen(false)}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
        />
      )}
      <Snackbar message={toastText} open={isToastOpen} onClose={handleToastClose} autoHideDuration={3000} />
    </div>
  );
}

export default ViewCalendarEvents;
