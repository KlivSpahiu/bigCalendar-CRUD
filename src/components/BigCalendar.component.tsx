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
import { useForm } from "antd/lib/form/Form";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../components/BigCalendar.css";

const { TextArea } = Input;
const { Option } = Select;

const localizer = momentLocalizer(Moment);

const MyCalendar: React.FC = () => {
  const [events, setEvents] = useState<any>([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [selectedSubject, setSelectedSubject] = useState<any>("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [newEvent, setNewEvent] = useState<any>({
    title: "",
    description: "",
    start: new Date(),
    end: new Date(),
    lenda: selectedSubject.lenda as string,
    professor: "",
    color: selectedSubject.color,
    professor2: "",
    ore: ""
  });
  const klasaDropdownOptions = [
    "KLASA A",
    "KLASA B",
    "KLASA C",
    "KLASA D",
    "KLASA E",
  ];
  const [selectedItem, setSelectedItem] = useState(klasaDropdownOptions[0]);
  const [form] = useForm();

  const workingHoursStart = new Date();
  workingHoursStart.setHours(8, 0, 0, 0); // 9:00 AM

  const workingHoursEnd = new Date();
  workingHoursEnd.setHours(21, 0, 0, 0);

  const lendaDropdownOptions = [
    {
      lenda: "E drejta kushtetuese dhe të drejtat e njeriut",
      color: "#C63D2F",
      viti: 1,
    },
    {
      lenda: "E drejta administrative dhe e drejta e punës ",
      color: "#176B87",
      viti: 2,
    },
    {
      lenda: "E drejta penale dhe procedurë penale ",
      color: "#4D2DB7",
      viti: 1,
    },
    {
      lenda: " E drejta civile dhe procedurë civile",
      color: "#183D3D",
      viti: 1,
    },
    {
      lenda: "E drejta familjare  dhe e drejta tregtare",
      color: "#FFC436",
      viti: 2,
    },
    {
      lenda: "E drejta e BE-së  dhe e drejta ndërkombëtare publike",
      color: "#FF6969",
      viti: 2,
    },
    {
      lenda: "Gjuha shqipe",
      color: "#5C5470",
      viti: 1,
    },
    {
      lenda: "Etika dhe sjellja qytetare",
      color: "#974EC3",
      viti: 2,
    },
  ];


  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    setNewEvent({ ...newEvent, title: selectedItem });
  }, [selectedItem]);


  const handleEventClick = (event) => {
    setEditingEvent({ ...event });
    setShowEditModal(true);
  };

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

  

  const handleEventCreation = () => {
    // Create a new event
    const newEventToAdd = {
      title: newEvent.title,
      description: newEvent.description,
      start: newEvent.start,
      end: newEvent.end,
      lenda: selectedSubject.lenda,
      professor: newEvent.name,
      color: selectedSubject.color,
      professor2: newEvent.professor2,
      ore: newEvent.ore
    };

    console.log(newEventToAdd, "newEventTo Add")

    setEvents((prevEvents) => [...prevEvents, newEventToAdd]);

    setNewEvent({
      title: selectedItem,
      description: "",
      start: new Date(),
      end: new Date(),
      lenda: selectedSubject.lenda,
      professor: "",
      color: "",
      professor2: "",
      ore: ""
    });
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
    setEditingEvent({
      ...editingEvent,
      [name]: value,
    });
  };

  const handleEventUpdate = () => {
    const eventIndex = events.findIndex(
      (event) => event.id === editingEvent.id
    );

    if (eventIndex !== -1) {
      const updatedEvents = [...events];
      updatedEvents[eventIndex] = editingEvent;

      setEvents(updatedEvents);
      setEditingEvent(null); 
    } else {
      console.error("Event not found for editing.");
    }
  };

  const deleteEvent = (eventId) => {
    const updatedEvents = events.filter((event) => event.id !== eventId);
    setEvents(updatedEvents);
  };

  const handleEventDelete = (event) => {
    
      deleteEvent(event.id);
  
  };

  const getParentElement = (e) => {
    const element = e.currentTarget;
    const elementParent = element.parentElement;
    const parent = elementParent.parentElement;
    return parent;
  };

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
          onClick={() => setIsModalOpen(true)}>
          Shto lende
        </Button>
      </div>
    );
  };



  function CustomEvent({ event }) {
    return (
      
      <div
        onMouseEnter={(e) => {
          if (getParentElement(e) && getParentElement(e).style.height.replace(/\d% ?/g, "") < 20 ) {
            getParentElement(e).classList.add("event-full-height");
          }
        }}
        onMouseLeave={(e) => {
          if (getParentElement(e)) {
            getParentElement(e).classList.remove("event-full-height");
          }
        }}>
        <strong>{event.title}</strong>
        <p><strong>Pedagogu pergjegjes:</strong>{event.professor}</p>
        <p><strong>Pedagogu i lendes:</strong>{event.professor2}</p>
         <p><strong>Nr. i oreve:</strong>{event.ore}</p>
        <p><strong>Lenda:</strong>{event.lenda}</p>
      
      </div>
    );
  }

  const handleSelectChange = (value) => {
    const selectedOption = lendaDropdownOptions.find(
      (option) => option.lenda === value
    );
    setSelectedSubject(selectedOption || null);
  };



  const handleItemSelect = (item) => {
    form.resetFields();
    setSelectedItem(item);
    const filtered = events.filter((event) => event.title === item);
    setFilteredEvents(filtered);
  };

  const handleStartTimeChange = (time) => {
    handleInputChange("start", time);
  };

  const handleEndTimeChange = (time) => {
    handleInputChange("end", time);
  };

  const parseTime = (timeString) => {
    
      if (timeString) {
        const parsedTime = dayjs(timeString, "HH:mm");
        return parsedTime;
        
      }
      return null;
    
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

    function LendaDropDown() {
    return (
      <Form.Item
        name="selectedOption"
        label="Zgjidhni lenden"
        rules={[{ required: true, message: "Please select an option" }]}>
        <Select
          placeholder="Zgjidhni nje lende ..."
          value={selectedSubject ? selectedSubject.lenda : undefined}
          onChange={(value) => handleSelectChange(value)}>
          {lendaDropdownOptions.map((option: any, index) => (
            <Option key={index} value={option.lenda}>
              {option.lenda}
            </Option>
          ))}
        </Select>
      </Form.Item>
    );
  }

  const eventCardStyle = (event) => {
    const backgroundColor = event.color;

    const style = {
      backgroundColor,
      borderRadius: "0",
      opacity: 0.8,
      color: "white",
      display: "block",
      border: `1px solid white`
    };

    return {
      style,
    };
  };

  const calendarStyle = {
    height: "1200px", 
  };

 

 const editedEventDefault = () => {
  const eventData = []

  for(const key in editingEvent) {
    eventData.push({
      name: key,
      value: editingEvent[key]
    })
  }

  return eventData
 }



  return (
    <div>
      <div style={calendarStyle}>
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
          eventPropGetter={eventCardStyle}
          onSelectEvent={handleEventClick}
          min={workingHoursStart}
          max={workingHoursEnd}
        />
      </div>

      <Modal
        title="Modifiko lenden"
        open={showEditModal}
        onCancel={() => setShowEditModal(false)}>
        {editingEvent && (
          <Form form={form} initialValues={editedEventDefault()}>
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter the title" }]}>
            <Input
              type="text"
              name="title"
              onChange={handleEditInputChange}
              defaultValue={editingEvent.title}
            />
          </Form.Item>
          <Form.Item
            label="Name"
            name="professor"
            rules={[{ required: true, message: "Please enter the name" }]}>
            <Input
              type="text"
              name="name"
              value={newEvent.professor}
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
                value={dayjs(editingEvent.start)}
                onChange={(time, timeString) =>
                  handleEditInputChange({
                    target: {
                      name: "start",
                      value: time,
                    },
                  })
                }
              />
            </Form.Item>
            <Form.Item label="End Time">
              <TimePicker
                format="HH:mm"
                name="end"
                value={dayjs(editingEvent.end)}
                onChange={(time, timeString) =>
                  handleEditInputChange({
                    target: {
                      name: "end",
                      value: time,
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
          </Form>
        )}
      </Modal>

      <Modal
        title="Shto lende ne orar"
        open={isModalOpen} 
        onOk={handleEventCreation}
        onCancel={handleCancel}>
        <Form form={form}>
          <Form.Item
            label="Klasa"
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
          <LendaDropDown />
          <Form.Item
            label="Pedagogu pergjegjes"
            name="name"
            rules={[{ required: true, message: "Please enter the name" }]}>
            <Input
              type="text"
              name="name"
              value={newEvent.professor}
              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
            />
          </Form.Item>
        <Form.Item
            label="Pedagogu i lendes"
            name="professor2"
            rules={[{ required: true, message: "Please enter the name" }]}>
            <Input
              type="text"
              name="professor2"
              value={newEvent.professor2}
              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
            />
          </Form.Item>
                  <Form.Item
            label="Nr. i orëve"
            name="ore"
            rules={[{ required: true, message: "Please enter the name" }]}>
            <Input
              type="number"
              name="ore"
              value={newEvent.professor2}
              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
            />
          </Form.Item>
          
            <Form.Item
            label="Start Time"
            name="start"
            rules={[
              { required: true, message: "Please select the start time" },
            ]}>
            <TimePicker
              format="HH:mm"
              name="start"
              value={dayjs(newEvent.start)}
              onChange={handleStartTimeChange}
            />
          </Form.Item>

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
            label="Data"
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
