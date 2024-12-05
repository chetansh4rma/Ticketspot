import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BotIcon, X, Send, Home, Info, Calendar, Users, User, Mic } from 'lucide-react';
import axios from "axios";
import './css/chatbot.css';

const buttonColors = ['#4CAF50', '#2196F3', '#FFC107', '#E91E63', '#9C27B0'];

const IconButton = ({ icon: Icon, label, onClick }) => (
  <motion.button
    className="icon-button"
    onClick={onClick}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
  >
    <Icon size={20} />
    <span>{label}</span>
  </motion.button>
);

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addBotMessage('Welcome to MuseumTix! How can I assist you today?');
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
    addBotMessage(<div className="bot-typing">Thinking<span>.</span><span>.</span><span>.</span></div>);
    try {
      const response = await fetch('https://dialogflow.googleapis.com/v2/projects/ticketspot-omya/agent/sessions/57a7df7e-9458-c675-313b-38d6a2351168:detectIntent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ya29.a0AeDClZCzCkwUhFDN4prNqmkB_44hzhmJ772-GqQTesGi9qKlOuNC7yyP0873g6STv-xgygTn0BYBXgDqZOfF0cEhCWX-EbSTfv664YjouReD7ej1mu3IbjryOPhwYQ1nqSZErUp4vonUjbJACsWQuXolDsPYm-AVzQN-7mW9vl-3-ePmgvK4ZF6e3jqPi7WG-ESSvbwVhX_-4OEQ8U1gyy3EYu8orccfeWEATnotI2-uUCwJeMXXaQPBRCKCwz8sVm2J10cCPZI6zIh_rzVRRCZH46bjRH_nV-V-eDN17WgCU7uaQ-jQBTvK7ZupowMmoXCsXTvLWS5O7tu5KlyiZssxSOPi3PkrnX_hfuv1b0ajQZuGYzepEbG_PRU2rJAa5WiWs8d4Y0Uv3iKlgA8ib-_YwjFSLL0z46glv4WmtC8JaCgYKAYISARMSFQHGX2MidyNq-SmzthuDYH0uUhuTfw0435`,
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

      setMessages((prev) => prev.slice(0, -1)); // Remove typing indicator

      if (data.queryResult) {
        const Intent = data.queryResult.intent.displayName;
        console.log(Intent);

        switch (Intent) {
          case "greeting":
          
          break;

          case "family_events":
            try {
              const res = await axios.get("http://localhost:5000/fetchmuseumfamilyevents");
              console.log("Res", res);
          
            
              res.data.forEach((event) => {
                const { MonumentName, _id } = event; 
                addBotMessage(
                  <button
                    onClick={() => window.location.href = `http://localhost:3000/${_id}`}
                    className="redirect-button"
                  >
                    Visit {MonumentName}
                  </button>
                );
              });
            } catch (error) {
              console.error("Error fetching family events:", error);
              addBotMessage("Sorry, I couldn't fetch the family events at the moment.");
            }
            break;
          case "student_event":
            try {
              const res = await axios.get("http://localhost:5000/fetchmuseumStudentevents");
              console.log("Res", res);
          
              
              res.data.forEach((event) => {
                const { MonumentName, _id } = event; // Destructure the MonumentName and _id
          
                // Create a button for each monument with the MonumentName and _id in the URL
                addBotMessage(
                  <button
                    onClick={() => window.location.href = `http://localhost:3000/${_id}`}
                    className="redirect-button"
                  >
                    Visit {MonumentName}
                  </button>
                );
              });
            } catch (error) {
              console.error("Error fetching Student events:", error);
              addBotMessage("Sorry, I couldn't fetch the Student events at the moment.");
            }
  break;
          case "solotravel":
            try {
              const res = await axios.get("http://localhost:5000/fetchmuseumSoloevents");
              console.log("Res", res);
          
              // Iterate through the fetched data and add a button for each monument
              res.data.forEach((event) => {
                const { MonumentName, _id } = event; // Destructure the MonumentName and _id
          
                // Create a button for each monument with the MonumentName and _id in the URL
                addBotMessage(
                  <button
                    onClick={() => window.location.href = `http://localhost:3000/${_id}`}
                    className="redirect-button"
                  >
                    Visit {MonumentName}
                  </button>
                );
              });
            } catch (error) {
              console.error("Error fetching solo events:", error);
              addBotMessage("Sorry, I couldn't fetch the solo events at the moment.");
            }
  break;
  case "PlaceToVisitIntent":
    const Place = data.queryResult.parameters.place;
    console.log("Place",Place)
      try {
        const res = await axios.get(`http://localhost:5000/fetchmuseumfromplace/${Place}`);
        console.log("Res", res);
    
        // Iterate through the fetched data and add a button for each monument
        res.data.forEach((event) => {
          const { MonumentName, _id } = event; // Destructure the MonumentName and _id
    
          // Create a button for each monument with the MonumentName and _id in the URL
          addBotMessage(
            <button
              onClick={() => window.location.href = `http://localhost:3000/${_id}`}
              className="redirect-button"
            >
              Visit {MonumentName}
            </button>
          );
        });
      } catch (error) {
        console.error("Error fetching solo events:", error);
        addBotMessage("Sorry, I couldn't fetch the solo events at the moment.");
      }
break;
        default:
          addBotMessage('Sorry, I could not understand that.');
      }

      if (data.queryResult.fulfillmentText) {
        addBotMessage(data.queryResult.fulfillmentText);
      }
    } else {
      addBotMessage('Sorry, I could not understand that.');
    }
  } catch (error) {
      console.error('Error fetching API response:', error);
      addBotMessage('I apologize, but there seems to be a technical issue. Please try again later.');
    }
  };

  const handleInputSubmit = () => {
    if (!input.trim()) {
      setError('Please enter a message.');
      return;
    }
    setError('');
    addUserMessage(input);
    fetchApiResponse(input);
    setInput('');
  };

  const handleIconClick = (intent) => {
    fetchApiResponse(intent);
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      console.error('Speech recognition not supported');
      addBotMessage('Speech recognition is not supported in your browser.');
    }
  };

  
  return (
    <>
      {!isOpen && (
        <motion.div
          className="chatbot-icon"
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <BotIcon size={24} />
        </motion.div>
      )}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chatbot-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="chatbot-header">
              <div className="chatbot-header-title">
                <BotIcon size={24} className="bot-icon" />
                <h3>MuseumTix Assistant</h3>
              </div>
              <button onClick={() => setIsOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="chatbot-icons">
              <IconButton icon={Home} label="Home" onClick={() => handleIconClick("greeting")} />
              <IconButton icon={Info} label="Info" onClick={() => handleIconClick("info")} />
              <IconButton icon={Calendar} label="Events" onClick={() => handleIconClick("events")} />
              <IconButton icon={Users} label="Family" onClick={() => handleIconClick("family_events")} />
              <IconButton icon={User} label="Solo" onClick={() => handleIconClick("solotravel")} />
            </div>
            <div className="chatbot-messages">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    className={`message ${message.sender}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {message.text}
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
            <div className="chatbot-input">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleInputSubmit()}
                placeholder="Type your message here..."
              />
               <motion.button
                onClick={handleVoiceInput}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`voice-input-button ${isListening ? 'listening' : ''}`}
              >
                <Mic size={20} />
              </motion.button>
              <motion.button
                onClick={handleInputSubmit}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send size={20} />
              </motion.button>
            </div>
            {error && <p className="error">{error}</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}  