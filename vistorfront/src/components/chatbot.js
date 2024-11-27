import React, { useEffect, useState,useRef } from "react";
import axios from 'axios';
import "./css/Chatbot.css"; // Import the CSS file for styling
import { PDFDocument, rgb } from 'pdf-lib';

const Chatbot = ({ placeData ,handleCloseChatbot}) => {
    const messagesEndRef = useRef(null); 
  const [messages, setMessages] = useState([]);
  const [step, setStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState(""); // Track selected date
  const [selectedPersons, setSelectedPersons] = useState(0); // Track number of persons
  const [events, setEvents] = useState([]); // Store events from the backend
  const [selectedEvent, setSelectedEvent] = useState(null); // Store selected event for showing price
  const [eventId,setEventId]=useState(null)
  const [tickets,setTickets]=useState(null)
  useEffect(() => {
    getEventDetails(placeData.id);
    handleResponse();
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);



  const createTicketPDF = async (ticket) => {
    console.log(ticket,"hello")
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    
    // Add a blank page
    const page = pdfDoc.addPage([600, 400]);
    
    // Draw a rectangle for the ticket background
    page.drawRectangle({
      x: 50,
      y: 50,
      width: 500,
      height: 300,
      color: rgb(0.9, 0.9, 0.9), // Light grey background
    });
    
    // Set the font size and color
    const fontSize = 20;
    
    // Add ticket details to the PDF
    page.drawText(`Monument Name: ${placeData.name}`, { x: 60, y: 370, size: fontSize, color: rgb(0, 0, 0) });
    page.drawText(`Ticket No: ${ticket.ticketNo}`, { x: 60, y: 320, size: fontSize, color: rgb(0, 0, 0) });
    page.drawText(`Event ID: ${ticket.eventId}`, { x: 60, y: 290, size: fontSize, color: rgb(0, 0, 0) });
    page.drawText(`User ID: ${ticket.userId}`, { x: 60, y: 260, size: fontSize, color: rgb(0, 0, 0) });
    page.drawText(`Price: Rs.${ticket.price}`, { x: 60, y: 230, size: fontSize, color: rgb(0, 0, 0) });
    page.drawText(`Purchased At: ${ticket.purchasedAt.toLocaleString()}`, { x: 60, y: 200, size: fontSize, color: rgb(0, 0, 0) });
    page.drawText(`Expiration Date: ${ticket.ExpirationDate.toLocaleString()}`, { x: 60, y: 170, size: fontSize, color: rgb(0, 0, 0) });
    page.drawText(`Selected Date: ${ticket.selectedDate.toLocaleString()}`, { x: 60, y: 140, size: fontSize, color: rgb(0, 0, 0) });
    
    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();
    
    // Create a Blob from the PDF bytes
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    
    // Create a link element to download the PDF
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `ticket_${ticket.ticketNo}.pdf`;
    
    // Append link to the body and click it to trigger the download
    document.body.appendChild(link);
    link.click();
    
    // Clean up the link element
    document.body.removeChild(link);
  };
  

  // Fetch event details from the backend
  const getEventDetails = async (eventId) => {
    console.log(eventId)
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACK_URL}/api/auth/events-detail`,
        {
          MonumentId: "67080ee591a7b888d4c864d0", // Event ID
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true, // If cookies are needed
        }
      );
      const eventDetails = response.data.events;
      console.log('Event Details:', eventDetails);
      setEvents(eventDetails); // Set events in state
    } catch (error) {
      console.error('Error fetching event details:', error.message);
    }
  };

  // Handle user response logic
  const handleResponse = (response) => {
    if(response=='no')
    {
      handleCloseChatbot()
    }
    const newMessages = [...messages, { sender: "user", text: response }];
    setMessages(newMessages);

    let botResponse = "";

    if (step === 0) {
      botResponse = `Welcome! You're interested in visiting ${placeData.name}. Would you like to book a ticket?`;
      setStep(1);
    } else if (step === 1) {
      if (response.toLowerCase() === "yes") {
        botResponse = "Great! Please select a date for your visit:";
        setStep(2);
      } else {
        botResponse = "Alright, if you change your mind, feel free to ask again!";
        setStep(5); // End step
      }
    } else if (step === 2) {
      setSelectedDate(response); // Set selected date
      const matchingEvent = events.find(event => {
        const eventDate = new Date(event.eventDate).toLocaleDateString("en-US");
        return eventDate === response;
      });

      if (matchingEvent) {
        setSelectedEvent(matchingEvent);
        setEventId(matchingEvent._id)
        botResponse = `You selected ${response}. The ticket price is Rs.${matchingEvent.ticketPrice}. How many persons are visiting? (1-4)`;
      } else {
        console.log(events,"he",events[0])
        botResponse = `You selected ${response}. The ticket price is Rs.${events[0].ticketPrice}. How many persons are visiting? (1-4)`;
        setSelectedEvent(events[0]); // Default to first event if none matches
        setEventId(events[0]._id)
      }

      setStep(3);
    } else if (step === 3) {
      const numberOfPersons = parseInt(response, 10);
      if (!isNaN(numberOfPersons) && numberOfPersons > 0 && numberOfPersons <= 4) {
        setSelectedPersons(numberOfPersons); // Set number of persons
        botResponse = "Thank you for booking! Your tickets are confirmed.";
        sendDataToServer(placeData.name, selectedDate, numberOfPersons); // Send booking data
        setStep(5); // End step
      } else {
        botResponse = "Please select a valid number of persons (1-4).";
      }
    }

    // Display bot response
    if (botResponse) {
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: botResponse },
        ]);
      }, 500);
    }
  };

  // Send booking data to the server
  const sendDataToServer = async (place, date, persons) => {
    try {
      console.log(date,
        place,
        eventId ,
         persons,
        )
      const response = await axios.post(
        `${process.env.REACT_APP_BACK_URL}/api/auth/buy-ticket`,
        {
          date,
          place,
          eventid:eventId ,
          selectedPersons: persons,
          selectedDate: new Date(date).getTime(),
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      console.log('Booking confirmed:', response.data.tickets);
      setTickets(response.data.tickets)
      
      

      response.data.tickets.forEach((ticket) => {
        createTicketPDF(ticket); // Generate PDF for each ticket
      });

      handleCloseChatbot()
    } catch (error) {
      console.error('Error booking ticket:', error.message);
    }
  };

  // Render buttons for booking, date selection, and persons
  const renderBookingButtons = () => (
    <div className="button-container">
      <button style={{borderRadius:'10px'}} onClick={() => handleResponse("yes")}>Yes</button>
      <button  style={{borderRadius:'10px'}} onClick={() => handleResponse("no")}>No</button>
    </div>
  );

  const renderDateButtons = () => {
    const today = new Date();
    const dateButtons = [];

    for (let i = 0; i < 5; i++) {
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + i);
      const formattedDate = futureDate.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      });
      dateButtons.push(
        <button key={i} style={{borderRadius:'10px'}} onClick={() => handleResponse(formattedDate)}>
          {formattedDate}
        </button>
      );
    }

    return <div className="button-container">{dateButtons}</div>;
  };

  const renderPersonsButtons = () => (
    <div className="button-container">
      {[1, 2, 3, 4].map((number) => (
        <button key={number} style={{borderRadius:'10px'}} onClick={() => handleResponse(number.toString())}>
          {number}
        </button>
      ))}
    </div>
  );

  const fx=()=>{
    console.log("hello")
  }

  return (
    <div className="overlay1" onClick={fx}>
    <div className="chatbot">
      <div className="btn-close">
           <button className="btn-close-ch" onClick={()=>{handleCloseChatbot()}}>Close</button>
       </div>
      <div className="chatbox">

       

        <div className="messages">
        {messages.map((msg, index) => (
            <div key={index} className={msg.sender}>
              {msg.text}
            </div>
          ))}
          {/* This empty div will act as a scroll target */}
          <div ref={messagesEndRef} />
        </div>
        <div className="button-container" >
          {step === 0 }
          {step === 1 && renderBookingButtons()}
          {step === 2 && renderDateButtons()}
          {step === 3 && renderPersonsButtons()}
        </div>
      </div>
    </div>
    </div>
  );
};

export default Chatbot;
