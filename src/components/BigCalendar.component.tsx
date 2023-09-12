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

  const klasaDropdownOptions = [
    "KLASA A",
    "KLASA B",
    "KLASA C",
    "KLASA D",
    "KLASA E",
  ];

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

  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedItem, setSelectedItem] = useState<any>(
    klasaDropdownOptions[0]
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [selectedSubject, setSelectedSubject] = useState<any>("");

  const [newEvent, setNewEvent] = useState<any>({
    title: "",
    description: "",
    start: new Date(),
    end: new Date(),
    lenda: selectedSubject.lenda as string,
    professor: "",
    color: selectedSubject.color,
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



  const [showEditModal, setShowEditModal] = useState(false);

  const handleEventClick = (eventInfos) => {
    console.log(editingEvent, "editingEvent")
    setEditingEvent({ ...eventInfos });
    setShowEditModal(true);

  };

  const initialEditValues = () => {
    const initialValues = []

    for (const key in editingEvent) {
      initialValues.push({
        name: key,
        value: editingEvent[key]
      })
  }

  return initialValues
  }

  console.log(initialEditValues(),'initial')

 
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
      lenda: selectedSubject.lenda,
      professor: newEvent.name,
      color: selectedSubject.color,
    };

    // Update the events state with the new event
    setEvents((prevEvents) => [...prevEvents, newEventToAdd]);

    // Clear the form or set newEvent to initial values
    setNewEvent({
      title: selectedItem,
      description: "",
      start: new Date(),
      end: new Date(),
      lenda: selectedSubject.lenda,
      professor: "",
      color: "",
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
      const updatedEvents = [...events];
      updatedEvents[eventIndex] = editingEvent;

      setEvents(updatedEvents);
      setEditingEvent(null);
    } else {
      console.error("Event not found for editing.");
    }
  };

  const handleEventDelete = () => {
    if (editingEvent) {
      const eventsArray = filteredEvents.filter(
        (event) => event.lenda !== editingEvent.lenda
      );
      setFilteredEvents(eventsArray);
      setShowEditModal(false)

      console.log(eventsArray, "updatedEvents")

    }
  };

  console.log(filteredEvents, "filteredEvents")




  const getParentElement = (e) => {
    const element = e.currentTarget;
    const elementParent = element.parentElement;
    const parent = elementParent.parentElement;
    return parent;
  };

  function CustomEvent({ event }) {
    return (
      <div
        onMouseEnter={(e) => {
          if (getParentElement(e)) {
            getParentElement(e).classList.add("event-full-height");
          }
        }}
        onMouseLeave={(e) => {
          if (getParentElement(e)) {
            getParentElement(e).classList.remove("event-full-height");
          }
        }}>
        <strong>{event.title}</strong>
        <p>{`Pedagogu i lendes: ${event.professor}`}</p>
        <p>{`Lenda: ${event.lenda}`}</p>
      </div>
    );
  }

  const handleSelectChange = (value) => {
    const selectedOption = lendaDropdownOptions.find(
      (option) => option.lenda === value
    );
    setSelectedSubject(selectedOption || null);
  };

  function LendaDropDown() {
    return (
      <Form.Item
        name="selectedOption"
        label="Select an option"
        rules={[{ required: true, message: "Please select an option" }]}>
        <Select
          placeholder="Select an option"
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

  const handleItemSelect = (item) => {
    form.resetFields();
    setSelectedItem(item);
    const filtered = events.filter((event) => event.title === item);
    setFilteredEvents(filtered);
  };

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

  const eventStyleGetter = (event) => {
    const backgroundColor = event.color;

    const style = {
      backgroundColor,
      borderRadius: "0",
      opacity: 0.8,
      color: "white",
      border: "1px solid #ccc",
      display: "block",
    };

    return {
      style,
    };
  };

  const calendarStyle = {
    height: "1200px", // Adjust the height as needed
  };


  console.log("form.getFieldsValue():", form.getFieldsValue())

  const editFormFooter = () => {
    return (
                  <Form.Item>
              <Button type="default" onClick={handleEventUpdate}>
                Update Event
              </Button>
              <Button type="primary" onClick={handleEventDelete}>
                Delete Event
              </Button>
            </Form.Item>
    )
  }


  const CustomModalHeader = () => {
    return (
      <div >
        <h2 style={{ margin: 0, color: '#003666' }}>Shto lende ne orar</h2>
      </div>
    );
  };
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
          onSelectSlot={(slotInfo: any) =>
            setNewEvent({
              start: slotInfo.start,
              end: slotInfo.end,
            })
          }
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleEventClick}
          min={workingHoursStart}
          max={workingHoursEnd}
        />
      </div>

      <Modal
        title="Modifiko lenden"
        visible={showEditModal}
        onCancel={() => setShowEditModal(false)}
        footer={editFormFooter}
        >
      
        
          <Form form={form} initialValues={editingEvent} >
            <Form.Item label="Title" name="title">
              <Input
                
                // value={editingEvent.title}
                onChange={handleEditInputChange}
              />
            </Form.Item>
            <Form.Item
            label="Name"
            name="professor"
            rules={[{ required: true, message: "Please enter the name" }]}>
            <Input
              type="text"
              
              onChange={(e) => handleEditInputChange( e.target.value)}
            />
          </Form.Item>
{/*             
            <Form.Item label="Start Time">
              <TimePicker
                format="HH:mm"
                name="start"

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
            
                onChange={(time, timeString) =>
                  handleEditInputChange({
                    target: {
                      name: "end",
                      value: timeString,
                    },
                  })
                }
              />
            </Form.Item> */}

          </Form>
        
      </Modal>

      <Modal
        title={<CustomModalHeader />}
        centered
        visible={isModalOpen} 
        onOk={handleEventCreation}
        onCancel={handleCancel}>
        <Form form={form}>
        <LendaDropDown />
          <Form.Item
            label="Name"
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
          <div style={{display: "flex", justifyContent: "space-between"}}>
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
          </div>
          
          
          
                   <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter the title" }]}>
            <TextArea
              
              name="title"
              value={selectedItem.title}
              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
              defaultValue={selectedItem.title as string}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MyCalendar;
