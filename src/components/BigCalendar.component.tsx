import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import {
  Form,
  Input,
  DatePicker,
  Button,
  Modal,
  TimePicker,
  Select,
} from "antd";
import dayjs from "dayjs";
import Moment from "moment";
import { useForm } from "antd/lib/form/Form"
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../components/BigCalendar.css";

const { TextArea } = Input;
const { Option } = Select;


const localizer = momentLocalizer(Moment);

const MyCalendar: React.FC = () => {
  const [events, setEvents] = useState<any>([
    {
      id: 2,
      title: "KLASA A",
      start: new Date(),
      end: new Date(),
      description: "This is a sample event",
      lenda: "Lenda 1 "
    },
  ]);

  const klasaDropdownOptions = [
    "KLASA A",
    "KLASA B",
    "KLASA C",
    "KLASA D",
    "KLASA E",
  ];

  const [form] = useForm();

  const lendaDropdownOptions = [
    {
      lenda: "E drejta kushtetuese dhe të drejtat e njeriut",
      color: "#FFFADD",
      viti: 1
    },
     {
      lenda: "E drejta administrative dhe e drejta e punës ",
      color: "#8ECDDD",
      viti: 2
    },
     {
      lenda: "E drejta penale dhe procedurë penale ",
      color: "#E4F1FF",
      viti: 1
    },
     {
      lenda: " E drejta civile dhe procedurë civile",
      color: "#EBEF95",
      viti: 1
    },
     {
      lenda: "E drejta familjare  dhe e drejta tregtare",
      color: "#FFBB5C",
      viti: 2
    },
     {
      lenda: "E drejta e BE-së  dhe e drejta ndërkombëtare publike",
      color: "#E4E4D0",
      viti: 2
    },
     {
      lenda: "Gjuha shqipe",
      color: "#D8B4F8",
      viti: 1
    },
         {
      lenda: "Etika dhe sjellja qytetare",
      color: "#F4EEEE",
      viti: 2
    },

  ]

  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedItem, setSelectedItem] = useState(klasaDropdownOptions[0]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [selectedSubject, setSelectedSubject] = useState(lendaDropdownOptions[0])

  const [newEvent, setNewEvent] = useState<any>({
    title: selectedItem,
    description: "",
    start: new Date(),
    end: new Date(),
    lenda: selectedSubject.lenda
  });



  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    setNewEvent({ ...newEvent, title: selectedItem });
  }, [selectedItem]);

  const [showEditModal ,setShowEditModal] = useState(false)

  const handleEventClick = (event) => {
    setEditingEvent({ ...event });
    setShowEditModal(true)
  };

  console.log(selectedSubject, "selected subject")

  const handleInputChange = (name: string, value: string) => {
    if (name === "date") {
   
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
    } else if (name === "start" || name === "end") {
   
      setNewEvent({ ...newEvent, [name]: value });
    } else {
      setNewEvent({ ...newEvent, [name]: value });
    }
  };

  const [currentDate, setCurrentDate] = useState(new Date());

  const customToolbar = () => {
    const goToNextWeek = () => {
      const nextWeek = dayjs(currentDate).add(7, "day").toDate();
      setCurrentDate(nextWeek);
    };

    const goToPreviousWeek = () => {
      const previousWeek = dayjs(currentDate).subtract(7, "day").toDate();
      setCurrentDate(previousWeek);
    };

    return (
      <div className="custom-toolbar">
        <div className="filters">
          <button onClick={goToPreviousWeek} className="week-button">
            Previous Week
          </button>
          <button onClick={goToNextWeek} className="week-button">
            Next Week
          </button>
          <CustomDropdown
            selectedItem={selectedItem}
            onItemSelect={handleItemSelect}
            options={klasaDropdownOptions}
          />
        </div>
        <Button
          type="primary"
          style={{ backgroundColor: "#FF731D" }}
          onClick={showModal}>
          Shto lende
        </Button>
      </div>
    );
  };

  const handleEventCreation = () => {
    // Create a new event
    const newEventToAdd = {
      title: newEvent.title,
      description: newEvent.description,
      start: newEvent.start,
      end: newEvent.end,
      lenda: newEvent.lenda
    };

    // Update the events state with the new event
    setEvents((prevEvents) => [...prevEvents, newEventToAdd]);

    // Clear the form or set newEvent to initial values
    setNewEvent({
      title: selectedItem,
      description: "",
      start: new Date(),
      end: new Date(),
    });

    // Update the filteredEvents state based on the selectedItem
    const updatedFilteredEvents = [...filteredEvents];
    if (selectedItem === newEventToAdd.title) {
      updatedFilteredEvents.push(newEventToAdd);
    }
    setFilteredEvents(updatedFilteredEvents);
form.resetFields();
    setIsModalOpen(false);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    // Assuming `editingEvent` is stored as state
    setEditingEvent({
      ...editingEvent,
      [name]: value,
    });
  };

  const handleEventUpdate = () => {
    // Find the index of the edited event
    const eventIndex = events.findIndex(
      (event) => event.id === editingEvent.id
    );

    if (eventIndex !== -1) {
      // Update the event in the events array
      const updatedEvents = [...events];
      updatedEvents[eventIndex] = editingEvent;

      setEvents(updatedEvents);
      setEditingEvent(null); // Clear the editing state
    } else {
      // Handle the case where the event with the given ID is not found
      console.error("Event not found for editing.");
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
      <div style={{eventStyle} as any}>
        <strong>{event.title}</strong>
        <p>{event.description}</p>
        <p>{`Lenda: ${event.lenda}`}</p>
      </div>
    );
  }

  function LendaDropDown() {
    return (
      <Form.Item
        name="selectedOption"
        label="Select an option"
        rules={[{ required: true, message: 'Please select an option' }]}
      >
        <Select placeholder="Select an option" onChange={handleSubjectSelect}>
          {lendaDropdownOptions.map((option: any, index) => (
            <Option key={index} value={option.lenda}>
              {option.lenda}
            </Option>
          ))}
        </Select>
      </Form.Item>
    )
  }

  console.log(events, "events");

  const handleItemSelect = (item) => {
    setSelectedItem(item);
    const filtered = events.filter((event) => event.title === item);
    setFilteredEvents(filtered);
  };

  const handleSubjectSelect = (item) => {
    setSelectedSubject(item)
    console.log(selectedSubject, "selected subject")
  }

  const handleStartTimeChange = (time, timeString) => {
    handleInputChange("start", time);
  };

  const handleEndTimeChange = (time, timeString) => {
    handleInputChange("end", time);
  };


  function CustomDropdown({ selectedItem, onItemSelect, options }) {
    return (
      <Select value={selectedItem} onChange={onItemSelect}>
        {options.map((option) => (
          <Option key={option} value={option}>
            {option}
          </Option>
        ))}
      </Select>
    );
  }

  const parseTime = (timeString) => {
    try {
      if (timeString) {
        const parsedTime = dayjs(timeString, "HH:mm");
        return parsedTime;
      }
      return null;
    } catch (error) {
      console.error("Error parsing time:", error);
      return null;
    }
  };


    const eventStyle = () => {
    const style = {
      backgroundColor: selectedSubject.color || 'green', // Use the state variable or a default color
    };

    return {
      style,
    };
  };

  // Function to change the event color in the state

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
        }
        onSelectEvent={handleEventClick}
        
        
      />

      <Modal title="Modifiko lenden" visible={showEditModal} onCancel={() => setShowEditModal(false)}>
          {editingEvent && <Form>
            <Form.Item label="Title">
              <Input
                name="title"
                value={editingEvent.title || ""}
                onChange={handleEditInputChange}
              />
            </Form.Item>
            <Form.Item label="Description">
              <TextArea
                name="description"
                value={editingEvent.description}
                onChange={handleEditInputChange}
              />
            </Form.Item>
            <Form.Item label="Start Time">
              <TimePicker
                format="HH:mm"
                name="start"
                value={parseTime(editingEvent.start)}
                onChange={(time, timeString) =>
                  handleEditInputChange({
                    target: {
                      name: "start",
                      value: timeString,
                    },
                  })
                }
              />
            </Form.Item>
            <Form.Item label="End Time">
              <TimePicker
                format="HH:mm"
                name="end"
                value={parseTime(editingEvent.end)}
                onChange={(time, timeString) =>
                  handleEditInputChange({
                    target: {
                      name: "end",
                      value: timeString,
                    },
                  })
                }
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={handleEventUpdate}>
                Update Event
              </Button>
              <Button type="primary" onClick={handleEventDelete}>
                Delete Event
              </Button>
            </Form.Item>
          </Form> }</Modal>
          
      
      <Modal
        title="Shto lende ne orar"
        visible={isModalOpen} // Use "visible" instead of "open"
        onOk={handleEventCreation}
        onCancel={handleCancel}>
          <Form form={form}>
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please enter the title" }]}>
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
        <Form.Item
          label="Start Time"
          name="start"
          rules={[{ required: true, message: "Please select the start time" }]}>
          <TimePicker
            format="HH:mm"
            name="start"
            value={dayjs(newEvent.start)}
            onChange={handleStartTimeChange}
          />
        </Form.Item>
        <LendaDropDown/>
        <Form.Item
          label="End Time"
          name="end"
          rules={[{ required: true, message: "Please select the end time" }]}>
          <TimePicker
            format="HH:mm"
            name="end"
            value={dayjs(newEvent.end)}
            onChange={handleEndTimeChange}
          />
        </Form.Item>
        <Form.Item
          label="Date"
          name="date"
          rules={[{ required: true, message: "Please select a date" }]}>
          <DatePicker
            format="YYYY-MM-DD"
            name="date"
            value={dayjs(newEvent.start)}
            onChange={(date, dateString) =>
              handleInputChange("date", dateString)
            }
          />
        </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MyCalendar;
