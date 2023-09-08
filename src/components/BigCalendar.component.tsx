import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { Form, Input, DatePicker, Button, Modal, TimePicker } from 'antd';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import "../components/BigCalendar.css"
import dayjs from 'dayjs';
const { TextArea } = Input;



const localizer = momentLocalizer(moment);

const MyCalendar: React.FC = () => {
const [events, setEvents] = useState<any>([
  {
    id: 1,
    title: 'KLASA C',
    start: new Date(),
    end: new Date(),
    description: 'This is a sample event',
  },

    {
    id: 1,
    title: 'KLASA A',
    start: new Date(),
    end: new Date(),
    description: 'This is a sample event',
  },

    {
    id: 1,
    title: 'KLASA D',
    start: new Date(),
    end: new Date(),
    description: 'Pedagogu: NS',
  },
]);

console.log(events, "events")

const dropdownOptions = ['KLASA A', 'KLASA B', 'KLASA C', 'KLASA D', 'KLASA E'];
const [filteredEvents, setFilteredEvents] = useState([]);
const [selectedItem, setSelectedItem] = useState(dropdownOptions[0]);
 const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
 const [editingEvent, setEditingEvent] = useState(null);

const [newEvent, setNewEvent] = useState<any>({
  title: selectedItem,
  description: '',
  start: new Date(),
  end: new Date(),
});


  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

useEffect(() => {
  setNewEvent({ ...newEvent, title: selectedItem });
}, [selectedItem]);





const handleEventClick = (event) => {
  setEditingEvent({ ...event }); 
};



const handleInputChange = (name: string, value: string) => {
  if (name === 'date') {
    // Assuming 'value' is in 'YYYY-MM-DD' format
    const newStartDate = dayjs(value)
      .hour(dayjs(newEvent.start).hour())
      .minute(dayjs(newEvent.start).minute());

    const newEndDate = dayjs(value)
      .hour(dayjs(newEvent.end).hour())
      .minute(dayjs(newEvent.end).minute());

    setNewEvent({
      ...newEvent,
      start: newStartDate.toDate(),
      end: newEndDate.toDate(),
    });
  } else if (name === 'start' || name === 'end') {
    // Assuming 'value' is in 'HH:mm' format
    setNewEvent({ ...newEvent, [name]: value });
  } else {
    setNewEvent({ ...newEvent, [name]: value });
  }
};

  const [currentDate, setCurrentDate] = useState(new Date());


  const customToolbar = () => {
const goToNextWeek = () => {
  const nextWeek = dayjs(currentDate).add(7, 'day').toDate();
  setCurrentDate(nextWeek);
};

const goToPreviousWeek = () => {
  const previousWeek = dayjs(currentDate).subtract(7, 'day').toDate();
  setCurrentDate(previousWeek);
};


    return (
      <div className="custom-toolbar">
        <div className="filters">
      <button onClick={goToPreviousWeek} className="week-button">Previous Week</button>
        <button onClick={goToNextWeek} className="week-button">Next Week</button>
        <Dropdown selectedItem={selectedItem} onItemSelect={handleItemSelect} options={dropdownOptions} />

        </div>
                <Button type="primary" style={{backgroundColor: "#FF731D"}} onClick={showModal}>
        Shto lende
      </Button>
      </div>
    );
  };


// const handleEventCreation = () => {
//   // Create a new event
//   const newEventToAdd = {
//     title: newEvent.title,
//     description: newEvent.description,
//     start: newEvent.start,
//     end: newEvent.end,
//   };

//   // Update the events state with the new event
//   setEvents([...events, newEventToAdd]);

//   // Clear the form or set newEvent to initial values
//   setNewEvent({
//     title: '',
//     description: '',
//     start: new Date(),
//     end: new Date(),
//   });

//   if(selectedItem === newEventToAdd.title) {

// setFilteredEvents([...filteredEvents, newEventToAdd])
// console.log(filteredEvents, "filteredEvents")
//   }
// setIsModalOpen(false);



// };

const handleEventCreation = () => {
  // Create a new event
  const newEventToAdd = {
    title: newEvent.title,
    description: newEvent.description,
    start: newEvent.start,
    end: newEvent.end,
  };

  // Update the events state with the new event
  setEvents((prevEvents) => [...prevEvents, newEventToAdd]);

  // Clear the form or set newEvent to initial values
  setNewEvent({
    title: selectedItem,
    description: '',
    start: new Date(),
    end: new Date(),
  });

  // Update the filteredEvents state based on the selectedItem
  const updatedFilteredEvents = [...filteredEvents];
  if (selectedItem === newEventToAdd.title) {
    updatedFilteredEvents.push(newEventToAdd);
  }
  setFilteredEvents(updatedFilteredEvents);

  setIsModalOpen(false);
};




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
   const filtered = events.filter((event) => event.title === item);
  setFilteredEvents(filtered);

};


const handleStartTimeChange = (time, timeString) => {
  handleInputChange('start', timeString);
};

const handleEndTimeChange = (time, timeString) => {
  handleInputChange('end', timeString);
};

const handleRegularInputChange = (name, value) => {
  setNewEvent({ ...newEvent, [name]: value });
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
        events={filteredEvents}
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
      <Modal title="Shto lende ne orar" open={isModalOpen} onOk={handleEventCreation} onCancel={handleCancel}>
          
      {/* <form>
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

      </form> */}
<Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please enter the title' }]}>
<Input
  type="text"
  name="title"
  value={newEvent.title}
  onChange={(e) => handleInputChange(e.target.name, e.target.value)}
  defaultValue={newEvent.title}
/>
</Form.Item>
<Form.Item label="Description" name="description">
<TextArea
  name="description"
  value={newEvent.description}
  onChange={(e) => handleInputChange(e.target.name, e.target.value)}
/>
</Form.Item>
<Form.Item label="Start Time" name="start" rules={[{ required: true, message: 'Please select the start time' }]}>
  <TimePicker
    format="HH:mm"
    name="start"
    value={dayjs(newEvent.start, 'HH:mm')}
    onChange={handleStartTimeChange}
  />
</Form.Item>
<Form.Item label="End Time" name="end" rules={[{ required: true, message: 'Please select the end time' }]}>
  <TimePicker
    format="HH:mm"
    name="end"
    value={dayjs(newEvent.end, 'HH:mm')}
    onChange={handleEndTimeChange}
  />
</Form.Item>
      <Form.Item label="Date" name="date" rules={[{ required: true, message: 'Please select a date' }]}>
  <DatePicker
    format="YYYY-MM-DD"
    name="date"
    value={dayjs(newEvent.start, 'YYYY-MM-DD')}
    onChange={(date, dateString) => handleInputChange('date', dateString)}
  />
      </Form.Item>

    
      </Modal>
    </div>

  );
};

export default MyCalendar;
