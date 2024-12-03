// import { useState, useEffect, useRef } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { Bot, ChevronLeft, ChevronRight, X } from 'lucide-react'
// import './css/chatbot.css'
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// // import { faComment } from "@fortawesome/free-solid-svg-icons";
// import { faComment } from "@fortawesome/free-regular-svg-icons";

// const mockGuides = [
//   { id: '1', name: 'Alice Johnson', rating: 4.8, photo: '/placeholder.svg?height=80&width=80', speciality: 'Renaissance Art' },
//   { id: '2', name: 'Bob Smith', rating: 4.6, photo: '/placeholder.svg?height=80&width=80', speciality: 'Modern Art' },
//   { id: '3', name: 'Carol Williams', rating: 4.9, photo: '/placeholder.svg?height=80&width=80', speciality: 'Ancient History' },
//   { id: '4', name: 'David Brown', rating: 4.7, photo: '/placeholder.svg?height=80&width=80', speciality: 'Impressionism' },
//   { id: '5', name: 'Eva Martinez', rating: 4.5, photo: '/placeholder.svg?height=80&width=80', speciality: 'Contemporary Art' },
// ]

// export default function Chatbot() {
//   const [isOpen, setIsOpen] = useState(false)
//   const [messages, setMessages] = useState([])
//   const [currentStep, setCurrentStep] = useState(0)
//   const [bookingDetails, setBookingDetails] = useState({
//     date: '',
//     tickets: 0,
//     name: '',
//   })
//   const [showGuides, setShowGuides] = useState(false)
//   const [selectedGuide, setSelectedGuide] = useState(null)
//   const [currentGuideIndex, setCurrentGuideIndex] = useState(0)
//   const [isTyping, setIsTyping] = useState(false)
//   const messagesEndRef = useRef(null)

//   const chatSteps = [
//     { question: "Welcome to MuseumTix! I'm your AI assistant. Let's book your ticket. What date would you like to visit?", type: 'date' },
//     { question: "Excellent choice! How many tickets would you like to book?", type: 'number' },
//     { question: "Perfect. Can I get your name for the booking?", type: 'text' },
//     { question: "Great! Your ticket has been booked. Would you like to download it now?", type: 'confirm' },
//     { question: "One last thing - would you like to book an expert guide for your visit?", type: 'confirm' },
//   ]

//   useEffect(() => {
//     if (isOpen && messages.length === 0) {
//       addBotMessage(chatSteps[0].question)
//     }
//   }, [isOpen])

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
//   }, [messages])

//   const addBotMessage = (text) => {
//     setIsTyping(true)
//     setTimeout(() => {
//       setMessages(prev => [...prev, { text, sender: 'bot' }])
//       setIsTyping(false)
//     }, 1000 + Math.random() * 500)
//   }

//   const addUserMessage = (text) => {
//     setMessages(prev => [...prev, { text, sender: 'user' }])
//   }

//   const handleUserInput = (input) => {
//     addUserMessage(input)
    
//     if (currentStep < chatSteps.length - 1) {
//       setBookingDetails(prev => ({
//         ...prev,
//         [Object.keys(bookingDetails)[currentStep]]: input
//       }))
//       setCurrentStep(currentStep + 1)
//       addBotMessage(chatSteps[currentStep + 1].question)
//     } else if (currentStep === chatSteps.length - 1) {
//       if (input.toLowerCase() === 'yes') {
//         setShowGuides(true)
//         addBotMessage("Fantastic! Here are our top-rated guides. Use the arrows to browse and click 'Select' to choose your perfect guide.")
//       } else {
//         downloadTicket()
//       }
//     }
//   }

//   const handleGuideSelection = (guide) => {
//     setSelectedGuide(guide)
//     addBotMessage(`Excellent choice! You've selected ${guide.name} as your guide. Shall we confirm this booking?`)
//     setShowGuides(false)
//   }

//   const confirmGuideBooking = () => {
//     if (selectedGuide) {
//       addBotMessage(`Wonderful! Your guide ${selectedGuide.name} is confirmed. Get ready for an enriching experience!`)
//       setSelectedGuide(null)
//     }
//   }

//   const downloadTicket = () => {
//     alert("Your ticket has been generated and is ready for download!")
//     addBotMessage("Thank you for booking with MuseumTix. Your cultural journey awaits!")
//   }

//   const renderUserOptions = () => {
//     if (currentStep < chatSteps.length) {
//       switch (chatSteps[currentStep].type) {
//         case 'date':
//           return (
//             <motion.div className="chatbot-input" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
//               <input type="date" onChange={(e) => handleUserInput(e.target.value)} className="chatbot-input-field" />
//             </motion.div>
//           )
//         case 'number':
//           return (
//             <motion.div className="chatbot-input" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
//               <input type="number" min="1" max="10" onChange={(e) => handleUserInput(e.target.value)} className="chatbot-input-field" />
//             </motion.div>
//           )
//         case 'text':
//           return (
//             <motion.div className="chatbot-input" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
//               <input type="text" onChange={(e) => handleUserInput(e.target.value)} className="chatbot-input-field" />
//             </motion.div>
//           )
//         case 'confirm':
//           return (
//             <motion.div className="chatbot-confirm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
//               <button className="chatbot-button conf-btn confirm" onClick={() => handleUserInput('yes')}>Yes</button>
//               <button className="chatbot-button dec-btn decline" onClick={() => handleUserInput('no')}>No</button>
//             </motion.div>
//           )
//         default:
//           return null
//       }
//     } else if (showGuides) {
//       return (
//         <motion.div className="chatbot-guides" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//           <motion.div className="guide-card">
//             {/* Code to show guides */}
//           </motion.div>
//         </motion.div>
//       )
//     }
//   }

//   return (
//     <>
//       {!isOpen &&<div className='chatBot-thumbnail' onClick={() => setIsOpen((prev) => !prev)}>
//       <FontAwesomeIcon icon={faComment} className='chat-bot-msg-icon'/>
//       </div>}
    
//       {isOpen&&<div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
     
      
      
//       <div className="chatbot-header">
//         <Bot />
//         <button onClick={() => setIsOpen((prev) => !prev)}>{isOpen ? <X /> : <Bot />}</button>
//       </div>
//       {isOpen && (
//         <>
//           <div className="chatbot-messages">
//             <AnimatePresence>
//               {messages.map((message, index) => (
//                 <motion.div key={index} className={`message ${message.sender}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
//                   {message.text}
//                 </motion.div>
//               ))}
//             </AnimatePresence>
//             {isTyping && <div className="loader "></div>}
//             <div ref={messagesEndRef} />
//           </div>
//           <div className="chatbot-footer">{renderUserOptions()}</div>
//         </>
//       )}
//     </div>}
//     </>
//   )
// }

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X } from 'lucide-react';
import './css/chatbot.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-regular-svg-icons';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
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
            {renderUserOptions()}
            {error && <p className="error">{error}</p>}
          </div>
        </div>
      )}
    </>
  );
}
