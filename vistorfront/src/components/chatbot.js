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

const LoadMoreButton = ({ onClick }) => (
  <motion.button
    className="load-more-button"
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    Load More
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
    setTimeout(() => {
      setIsOpen(true);
    }, 3000);
    if (isOpen && messages.length === 0) {
      addBotMessage('Welcome to TicketSpot! How can I assist you today?');
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addBotMessage = (text) => {
    setMessages((prev) => {
      const newMessage = { text, sender: 'bot' };
      if (typeof text === 'object' && text.type === 'button') {
        newMessage.buttons = text.buttons;
      }
      return [...prev, newMessage];
    });
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
          Authorization: `Bearer ya29.a0AeDClZBYPNaktUWbE-Pk0nYjCqhRlK4vLqL9ggtNhTvdwnwtxHSmn9rLf1D-ZTGIjljXzulIorFxWJZZ8KphrW2csI6Ucu5JEGL-JYM006UO-KVyW8x6ZsjDsr3w3IgW2unhBhhiiHFIx3LSUcm3sKRL12j_knsMhIDl3bxGxCfmFSA9WflzbwNK0OzigM_d9VJHtZrMj-ULgU2Zf2tLRu6Am-pvS_Gk1IhXKy_XbADmHvL1_bLpj3yfuE88uGbQ_YLTf1e3_HR4GqSoQpJl-fNs9yzNYmf1RzHo17on5ykKHvEC8zqCPOcefJGMNBLXvKrfxRk5DVzCrkgSyfLdySkp4YijB9Pl3axu7i8z4vf7tLNNhjPQBWJ-vcJ0FJUXyN6hv1JPxa4X0vPtkdBOdd4k3GOfL1ttI-8J3C3750IBaCgYKAQUSARMSFQHGX2MiUNTnpYsP-NuydYCTGG_y4Q0435`,
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
              console.error("Error fetching family events:", error);
              addBotMessage("Sorry, I couldn't fetch the family events at the moment.");
            }
            break;
          case "student_event":
            try {
              const res = await axios.get("http://localhost:5000/fetchmuseumStudentevents");
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
  case "DefaultFallbackIntent":
      try {
        
        console.log("Hello world");
        const res = await axios.get(`http://localhost:5000/fetchmuseumDefault/`);
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
        console.error("Error fetching  events:", error);
        addBotMessage("Sorry, I couldn't fetch the events at the moment.");
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
  }catch (error) {
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
                <h3>TicketSpot Assistant</h3>
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
                    {message.buttons && (
                      <div className="button-container">
                        {message.buttons.map((button, buttonIndex) => (
                          <motion.button
                            key={buttonIndex}
                            className="redirect-button"
                            onClick={button.onClick}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{ backgroundColor: buttonColors[buttonIndex % buttonColors.length] }}
                          >
                            {button.label}
                          </motion.button>
                        ))}
                      </div>
                    )}
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

