import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
const [events, setEvents] = useState<any>([
  {
    id: 1,
    title: 'Sample Event',
    start: new Date(),
    end: new Date(),
    description: 'This is a sample event',
  },
]);

const dropdownOptions = ['KLASA A', 'KLASA B', 'KLASA C', 'KLASA D', 'KLASA E'];
const [selectedItem, setSelectedItem] = useState(dropdownOptions[0]);
const [newEvent, setNewEvent] = useState<any>({
  title: selectedItem,
  description: '',
  start: new Date(),
  end: new Date(),
});

useEffect(() => {
  setNewEvent({ ...newEvent, title: selectedItem });
}, [selectedItem]);


const [editingEvent, setEditingEvent] = useState(null);

console.log(editingEvent, "editingEvent")

const handleEventClick = (event) => {
  setEditingEvent({ ...event }); 
};

const handleInputChange = (e: any) => {
  const { name, value } = e.target;

  if (name === 'date') {

    const newStartDate = moment(value).set({
      hour: moment(newEvent.start).hour(),
      minute: moment(newEvent.start).minute(),
    });

    const newEndDate = moment(value).set({
      hour: moment(newEvent.end).hour(),
      minute: moment(newEvent.end).minute(),
    });

    setNewEvent({
      ...newEvent,
      start: newStartDate.toDate(),
      end: newEndDate.toDate(),
    });
  } else {
  
    setNewEvent({ ...newEvent, [name]: value });
  }
};

  const [currentDate, setCurrentDate] = useState(new Date());


  const customToolbar = () => {
    const goToNextWeek = () => {
      const nextWeek = moment(currentDate).add(7, 'days').toDate();
      setCurrentDate(nextWeek);
    };

    const goToPreviousWeek = () => {
      const previousWeek = moment(currentDate).subtract(7, 'days').toDate();
      setCurrentDate(previousWeek);
    };


    return (
      <div className="custom-toolbar">
        <button onClick={goToPreviousWeek}>Previous Week</button>
        <button onClick={goToNextWeek}>Next Week</button>
        <Dropdown selectedItem={selectedItem} onItemSelect={handleItemSelect} options={dropdownOptions} />
      </div>
    );
  };

const handleEventCreation = () => {
  setEvents([
    ...events,
    {
      ...newEvent,
      start: moment(newEvent.start).toDate(),
      end: moment(newEvent.end).toDate(),
    },
  ]);

  setNewEvent({
    title: '',
    description: '',
    start: new Date(),
    end: new Date(),
  });
};


// const handleEditInputChange = (e) => {
//   const { name, value } = e.target;
//   setEditingEvent({ ...editingEvent, [name]: new Date(value) });
// };

const handleEditInputChange = (e) => {
  const { name, value } = e.target;

  if (name === 'start' || name === 'end') {
    // Parse the date and time input and set it as a Date object
    setEditingEvent({ ...editingEvent, [name]: new Date(value) });
  } else {
    // Handle other input changes as before
    setEditingEvent({ ...editingEvent, [name]: value });
  }
};

// const handleEventUpdate = () => {

//   const eventIndex = events.findIndex((event) => event.id === editingEvent.id);

//   if (eventIndex !== -1) {
    
//     const updatedEvents = [...events];
//     updatedEvents[eventIndex] = {
//       ...updatedEvents[eventIndex],
//       title: editingEvent.title,
//       description: editingEvent.description,
//       start: editingEvent.start,
//       end: editingEvent.end,
//     };

//     setEvents(updatedEvents);
//     setEditingEvent(null); 
//   } else {
  
//     console.error('Event not found for editing.');
//   }
// };

const handleEventUpdate = () => {
  // Find the index of the edited event
  const eventIndex = events.findIndex((event) => event.id === editingEvent.id);

  if (eventIndex !== -1) {
    // Update the event in the events array
    const updatedEvents = [...events];
    updatedEvents[eventIndex] = editingEvent;

    setEvents(updatedEvents);
    setEditingEvent(null); // Clear the editing state
  } else {
    // Handle the case where the event with the given ID is not found
    console.error('Event not found for editing.');
  }
};

const deleteEvent = (eventId) => {
  const updatedEvents = events.filter((event) => event.id !== eventId);
  setEvents(updatedEvents);
};

const handleEventDelete = (event) => {
  const confirmDelete = window.confirm(
    `Are you sure you want to delete the event "${event.title}"?`
  );

  if (confirmDelete) {
    deleteEvent(event.id);
  }
};


function CustomEvent({ event }) {
  return (
    <div>
      <strong>{event.title}</strong>
      <p>{event.description}</p>
    </div>
  );
}





const handleItemSelect = (item) => {
  setSelectedItem(item);
};

function Dropdown({ selectedItem, onItemSelect, options }) {
  return (
    <select value={selectedItem} onChange={(e) => onItemSelect(e.target.value)}>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}






  return (
    <div>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        date={currentDate}
        components={{
          toolbar: customToolbar,
           event: CustomEvent,
        }}
        defaultView="week"
        onSelectSlot={(slotInfo: any) =>
        setNewEvent({
          start: slotInfo.start,
          end: slotInfo.end,
        })
        
      }onSelectEvent={handleEventClick}
      />

          <div>
      <h2>Shto event</h2>
      <form>
        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={newEvent.title}
          onChange={handleInputChange}
        />
        <br />
        <label>Description:</label>
        <textarea
          name="description"
          value={newEvent.description}
          onChange={handleInputChange}
        />
        <br />
        <label>Start Time:</label>
        <input
          type="datetime-local"
          name="start"
          value={moment(newEvent.start).format('YYYY-MM-DDTHH:mm')}
          onChange={handleInputChange}
        />
        <br />
        <label>End Time:</label>
        <input
          type="datetime-local"
          name="end"
          value={moment(newEvent.end).format('YYYY-MM-DDTHH:mm')}
          onChange={handleInputChange}
        />
        <br />
        <label>Date:</label>
            <input
             type="date"
              name="date"
              value={moment(newEvent.start).format('YYYY-MM-DD')}
              onChange={handleInputChange}
          />
        <button type="button" onClick={handleEventCreation}>
          Create Event
        </button>
      </form>
    </div>
    {editingEvent && <div>
    <h2>Edit Event</h2>
    <form>
      <label>Title:</label>
      <input
        type="text"
        name="title"
        value={editingEvent.title || ''}
        onChange={handleEditInputChange}
      />
      <br />
      <label>Description:</label>
      <textarea
        name="description"
        value={editingEvent.description}
        onChange={handleEditInputChange}
      />
      <br />
      <label>Start Time:</label>
      <input
        type="datetime-local"
        name="start"
        value={moment(editingEvent.start).format('YYYY-MM-DDTHH:mm')}
        onChange={handleEditInputChange}
      />
      <br />
      <label>End Time:</label>
      <input
        type="datetime-local"
        name="end"
        value={moment(editingEvent.end).format('YYYY-MM-DDTHH:mm')}
        onChange={handleEditInputChange}
      />
      <br />
      <button type="button" onClick={handleEventUpdate}>
        Update Event
      </button>
      <button type="button" onClick={handleEventDelete}>
        Delete event
      </button>
    </form>
  </div>}
    </div>
  );
};

export default MyCalendar;
