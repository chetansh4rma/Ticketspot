import  React,{ useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X } from 'lucide-react';
import './css/chatbot.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-regular-svg-icons';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [apiInput, setApiInput] = useState('');
  const [bookingDetails, setBookingDetails] = useState({
    date: '',
    tickets: '',
    name: '',
    guideBooking: false,
  });
  const [userInput, setUserInput] = useState('');
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const chatSteps = [
    { question: "Welcome to MuseumTix! Let's book your ticket. What date would you like to visit?", type: 'date' },
    { question: "How many tickets would you like to book?", type: 'number' },
    { question: "Can I get your name for the booking?", type: 'text' },
    { question: "Would you like to book an expert guide for your visit?", type: 'confirm' },
  ];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addBotMessage(chatSteps[0].question);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addBotMessage = (text) => {
    setMessages((prev) => [...prev, { text, sender: 'bot' }]);
  };

  const addUserMessage = (text) => {
    setMessages((prev) => [...prev, { text, sender: 'user' }]);
  };
  const fetchApiResponse = async (input) => {
    addBotMessage('Processing your input...');
    try {
      console.log(input)
      const response = await fetch('https://dialogflow.googleapis.com/v2/projects/ticketspot-qhnm/agent/sessions/43c97e81-7006-2e83-79a5-c81203e64330:detectIntent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ya29.a0AeDClZBBc9pk5eImOch_j4L-5DQrqEF71rPpMli24sxy8iulhCIin_irwE5RWHIX3K5ViCKJuedgjtLQo8VXq0N7hkDNZxyi7pfANSSiAhscUtRD-3JJzUgGc-zXtc-gSYAICLDVZIdiiYgEDnfPzsR70r8TQFFQMQMMG5zbvZQcs40AyD3U4IrtZJpZKlJ5VSzVM8GnV0FRoIduXkrd8anUf3sZ_yBEtY8or6ysa4X9bO8dDdOCPyhD_p4kCHvg4-PTrD3-pVP9IXWWdXM9vD4FYe62qoxdRSceZPBew6ca5hllHAUZWAUcoIiFlMkQphoGYel48cah1is-wY-3rMyQKNJtz9eZJ0l9nvDJcTPLzUkaLYjFiT8CYWJ60BbiBVeM4HY9IZJ6FKqSkxoID3PTz9ObPtUoPWs4iC_piyivaQaCgYKAVkSARESFQHGX2Mi8ULxZtxOy82grpRHmEKRSw0437`, // Replace with your Dialogflow token
        },
        body: JSON.stringify({
          queryInput: {
            text: {
              text: input,
              languageCode: 'en',
            },
          },
          queryParams: {
            source: 'DIALOGFLOW_CONSOLE',
            timeZone: 'Asia/Calcutta',
          },
        }),
      });
      const data = await response.json();
  console.log("response",data)
      if (data.queryResult && data.queryResult.fulfillmentText) {
        addBotMessage(data.queryResult.fulfillmentText);
      } else {
        addBotMessage('Sorry, I could not understand that.');
      }
    } catch (error) {
      console.error('Error fetching API response:', error);
      addBotMessage('There was an error processing your request. Please try again later.');
    }
  };
  
  const validateInput = () => {
    setError('');
    const input = userInput.trim();

    switch (chatSteps[currentStep].type) {
      case 'date': {
        const currentDate = new Date();
        const selectedDate = new Date(input);
        const maxDate = new Date();
        maxDate.setDate(currentDate.getDate() + 7);

        if (!input) return 'Please select a date.';
        if (selectedDate < currentDate) return 'The date cannot be in the past.';
        if (selectedDate > maxDate) return 'The date cannot exceed 7 days from today.';
        break;
      }
      case 'number': {
        if (!input) return 'Please enter the number of tickets.';
        if (isNaN(input) || parseInt(input, 10) <= 0) return 'Please enter a valid number of tickets.';
        break;
      }
      case 'text': {
        if (!input) return 'Name cannot be empty.';
        break;
      }
      case 'confirm': {
        if (!input) return 'Please select Yes or No.';
        break;
      }
      default:
        break;
    }

    return '';
  };

  const handleInputSubmit = () => {
    if (!apiInput.trim()) {
      setError('Input cannot be empty.');
      return;
    }
  
    setError('');
    const userMessage = apiInput.trim();
    addUserMessage(userMessage); // Display user input in the chat
    setApiInput(''); // Clear input field
    
    fetchApiResponse(userMessage); // Fetch and display API response
    const errorMessage = validateInput();
    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    addUserMessage(userInput);

    const updatedBookingDetails = { ...bookingDetails };

    switch (chatSteps[currentStep].type) {
      case 'date':
        updatedBookingDetails.date = userInput;
        break;
      case 'number':
        updatedBookingDetails.tickets = parseInt(userInput, 10);
        break;
      case 'text':
        updatedBookingDetails.name = userInput;
        break;
      case 'confirm':
        updatedBookingDetails.guideBooking = userInput === 'Yes';
        break;
      default:
        break;
    }

    setBookingDetails(updatedBookingDetails);
    setUserInput('');

    if (currentStep < chatSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      addBotMessage(chatSteps[currentStep + 1].question);
    } else {
      sendBookingDetails(updatedBookingDetails);
    }
  };

  const sendBookingDetails = async (details) => {
    addBotMessage('Processing your booking...');
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details),
      });
      const data = await response.json();
      addBotMessage('Your booking is confirmed! Thank you for choosing MuseumTix.');
    } catch (error) {
      console.error('Error sending booking details:', error);
      addBotMessage('Something went wrong. Please try again later.');
    }
  };

  const renderUserOptions = () => {
    switch (chatSteps[currentStep].type) {
      case 'date':
        return (
          <input
            type="date"
            min={new Date().toISOString().split('T')[0]}
            max={new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0]}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleInputSubmit()}
            className="chatbot-input-field"
          />
        );
      case 'number':
        return (
          <input
            type="number"
            placeholder="Enter number of tickets"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleInputSubmit()}
            className="chatbot-input-field"
          />
        );
      case 'text':
        return (
          <input
            type="text"
            placeholder="Enter your name"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleInputSubmit()}
            className="chatbot-input-field"
          />
        );
      case 'confirm':
        return (
          <>
            <button onClick={() => setUserInput('Yes')} className="chatbot-button confirm">
              Yes
            </button>
            <button onClick={() => setUserInput('No')} className="chatbot-button decline">
              No
            </button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {!isOpen && (
        <div className="chatBot-thumbnail" onClick={() => setIsOpen(true)}>
          <FontAwesomeIcon icon={faComment} className="chat-bot-msg-icon" />
        </div>
      )}
      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <Bot />
            <button onClick={() => setIsOpen(false)}>
              <X />
            </button>
          </div>
          <div className="chatbot-messages">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  className={`message ${message.sender}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {message.text}
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
          <div className="chatbot-footer">
          <input
              type="text"
              placeholder="Type your message here..."
              value={apiInput}
              onChange={(e) => setApiInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleInputSubmit()}
              className="chatbot-input-field"
            />
            <button className="chatbot-button" onClick={handleInputSubmit}>
              Send
            </button>
            {renderUserOptions()}
            {error && <p className="error">{error}</p>}
          </div>
        </div>
      )}
    </>
  );
}
