import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BotIcon, X, Send, Home, Info, Calendar, Users, User, Mic, MapPin, Clock, Ticket } from 'lucide-react';
import axios from "axios";
import './css/Chatbot.css';

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


const EventCard = ({ event }) => {
  const handleCardClick = () => {
    window.open(`${window.location.origin}/product/${event.MonumentId}`, '_blank');
  };

  return (
    <div className="event-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="event-card-header">
        <h2>{event.eventName}</h2>
        <span className="event-price">₹{event.eventTicketPrice}</span>
      </div>
      <div className="event-card-content">
        <p className="event-description">{event.description}</p>
        <div className="event-details">
          <div className="event-detail">
            <Ticket size={16} />
            <span>{event.eventTotalTicketsAvailable} available</span>
          </div>
        </div>
      </div>
      <div className="event-card-footer">
        <div className="event-date-time">
          <Calendar size={16} />
          <span>{new Date(event.eventDate).toLocaleDateString()}</span>
        </div>
        <div className="event-date-time">
          <Clock size={16} />
          <span>{event.eventTime}</span>
        </div>
      </div>
    </div>
  );
};
const EventCardTamil = ({ event }) => {
  const handleCardClick = () => {
    window.open(`${window.location.origin}/product/${event.MonumentId}`, '_blank');
  };

  return (
    <div className="event-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="event-card-header">
        <h2>{event.eventName.text}</h2>
        <span className="event-price">₹{event.eventTicketPrice}</span>
      </div>
      <div className="event-card-content">
        <p className="event-description">{event.description.text}</p>
        <div className="event-details">
          <div className="event-detail">
            <Ticket size={16} />
            <span>{event.eventTotalTicketsAvailable} available</span>
          </div>
        </div>
      </div>
  <div className="event-card-footer">
  <div className="event-date-time" style={{ display: 'flex', alignItems: 'center' }}>
    <Calendar size={16} />
    <span style={{ marginLeft: '8px' }}>{new Date(event.eventDate).toLocaleDateString()}</span>
  </div>
        <div className="event-date-time">
          <Clock size={16} />
          <span>{event.eventTime.text}</span>
        </div>
      </div>
    </div>
  );
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addBotMessage('Welcome to Ticketspot! How can I assist you today?');
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    setTimeout(() => {
      setIsOpen(true)
    }, 3000);
  }, [])

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
const Soloevents=async()=>{
  try {
    addBotMessage(<div className="bot-typing">Thinking<span>.</span><span>.</span><span>.</span></div>)
    const res = await axios.get("http://localhost:5000/fetchmuseumSoloevents");
    if (res.data && res.data.length > 0) {
      addBotMessage("Here are the upcoming events:");
      res.data.forEach((event) => {
        addBotMessage(<EventCard event={event} />);
      });
    } else {
      addBotMessage("Sorry, I couldn't find any events at the moment.");
    }
  } catch (error) {
    console.error("Error fetching solo events:", error);
    addBotMessage("Sorry, I couldn't fetch the solo events at the moment.");
  }
}
  const fetchApiResponse = async (input) => {
    addBotMessage(<div className="bot-typing">Thinking<span>.</span><span>.</span><span>.</span></div>);
    try {
      const response = await fetch('https://dialogflow.googleapis.com/v2/projects/ticketspot-omya/agent/sessions/57a7df7e-9458-c675-313b-38d6a2351168:detectIntent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ya29.a0AeDClZA0opIxkq2LKyFEHUfRmTmG1_Flt4C_GB5AAz3_ElQb2LYkSVkaPXMKaU7PrhySlLlMWUcTNthQpVUC7JnFgKLHHgduADYk8u-gosHkguj9fusmOlH76p4Hwh-wUG_WEoiX7_YhkETpkZtTIrrk5Iy8EWSySw1sjrP7Z9YDNv8IBpRWP-7jXwrRRTE93eLPsGOWMzxArkmWs94m3GD0RCFJeK8uxLzXJ_mPEEEzGTuyoHRiIW5hPUGPXNjpG_2TtlwlLmP-LqXlkBWVX5cpf3_DmbNdt14P0CPpwrWMGj_1InZzCI-Eu9ittLnfqGzYALDQxVzjRR3biSQCaBcecT-0WhgcEgb7udy592sdtMuanVo-keEtLyEnbl6M_XaSdNqHgk-UXAZ7str4jmD2GtilH3x5tWqqkb7tUW-53gaCgYKAeoSARMSFQHGX2MieAnVK8WH-Qn_mnSWAHGywQ0437`,
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

      setMessages((prev) => prev.slice(0, -1));

      if (data.queryResult) {
        const Intent = data.queryResult.intent.displayName;
        console.log(Intent);

        switch (Intent) {
          case "greeting":

          break;

        case "family_events":
          familyevents();
          break;
        case "family_events_tamil":
          try {
            addBotMessage(<div className="bot-typing">Thinking<span>.</span><span>.</span><span>.</span></div>)
            const res = await axios.get("http://localhost:5000/fetchmuseumfamilyeventstamil");
            console.log(res.data[0]);
            if (res.data && res.data.length > 0) {
              addBotMessage("Here are the upcoming events:");
              res.data.map((event) => {
                console.log(event);
                addBotMessage(<EventCardTamil event={event} />);
              });
            } else {
              addBotMessage("Sorry, I couldn't find any events at the moment.");
            }
          } catch (error) {
            console.error("Error fetching family events:", error);
            addBotMessage("Sorry, I couldn't fetch the family events at the moment.");
          }
          break;
        case "cheap_places_tamil":
          try {
            addBotMessage(<div className="bot-typing">Thinking<span>.</span><span>.</span><span>.</span></div>);
            const res = await axios.get("http://localhost:5000/fetchmuseumcheapplacetamil");
            console.log("Res", res);
            if (res.data && res.data.length > 0) {
              addBotMessage("Here are the upcoming events:");
              res.data.map((event) => {
                console.log(event);
                addBotMessage(<EventCardTamil event={event} />);
              });
            } else {
              addBotMessage("Sorry, I couldn't find any events at the moment.");
            }
          } catch (error) {
            console.error("Error fetching Student events:", error);
            addBotMessage("Sorry, I couldn't fetch the Student events at the moment.");
          }
          break;
        case "solotravel":
          Soloevents();
          break;
        case "PlaceToVisitIntent":
          const Place = data.queryResult.parameters.place;
          console.log("Place", Place)
          try {
            addBotMessage(<div className="bot-typing">Thinking<span>.</span><span>.</span><span>.</span></div>);
            const res = await axios.get(`http://localhost:5000/fetchmuseumfromplace/${Place}`);
            console.log("Res", res);
            res.data.forEach((event) => {
              const { MonumentName, _id } = event;
              addBotMessage(
                <button
                onClick={() => window.open(`http://localhost:3000/${_id}`, '_blank')}
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
            addBotMessage(<div className="bot-typing">Thinking<span>.</span><span>.</span><span>.</span></div>);
            console.log("Hello world");
            const res = await axios.get(`http://localhost:5000/fetchmuseumDefault/`);
            if (res.data && res.data.length > 0) {
              addBotMessage("Here are the upcoming events:");
              res.data.map((event) => {
                console.log(event);
                addBotMessage(<EventCard event={event} />);
              });
            } else {
              addBotMessage("Sorry, I couldn't find any events at the moment.");
            }
          } catch (error) {
            console.error("Error fetching  events:", error);
            addBotMessage("Sorry, I couldn't fetch the events at the moment.");
          }
          break;
        case "student_event_tamil":
          try {
            addBotMessage(<div className="bot-typing">Thinking<span>.</span><span>.</span><span>.</span></div>);
            const res = await axios.get("http://localhost:5000/fetchmuseumStudenteventstamil");
            console.log("Res", res);
            if (res.data && res.data.length > 0) {
              addBotMessage("Here are the upcoming events:");
              res.data.map((event) => {
                console.log(event);
                addBotMessage(<EventCardTamil event={event} />);
              });
            } else {
              addBotMessage("Sorry, I couldn't find any events at the moment.");
            }
          } catch (error) {
            console.error("Error fetching Student events:", error);
            addBotMessage("Sorry, I couldn't fetch the Student events at the moment.");
          }
          break;
        default:
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
const familyevents=async()=>{
  try {
    addBotMessage(<div className="bot-typing">Thinking<span>.</span><span>.</span><span>.</span></div>);
    const res = await axios.get("http://localhost:5000/fetchmuseumfamilyevents");
    if (res.data && res.data.length > 0) {
      addBotMessage("Here are the upcoming events:");
      res.data.forEach((event) => {
        addBotMessage(<EventCard event={event} />);
      });
    } else {
      addBotMessage("Sorry, I couldn't find any events at the moment.");
    }
  } catch (error) {
    console.error("Error fetching family events:", error);
    addBotMessage("Sorry, I couldn't fetch the family events at the moment.");
  }
}
const Infos=()=>{
  const termsAndConditions = `
  Terms and Conditions for Ticketspot Booking:

  1. Tickets are valid only for the selected date and are non-refundable.
  2. Visitors are responsible for their safety; TicketSpot is not liable for accidents.
  3. Minors must be accompanied by an adult at all times.
  4. Adhere to museum rules; misconduct may lead to expulsion.
  5. Changes in schedules due to unforeseen events are beyond our control.
`;
addBotMessage(termsAndConditions);
}
  const handleEvents = async () => {
    try {
      addBotMessage(<div className="bot-typing">Thinking<span>.</span><span>.</span><span>.</span></div>);
      const res = await axios.post("http://localhost:5000/events");
      console.log("Events:", res.data);
      if (res.data && res.data.length > 0) {
        addBotMessage("Here are the upcoming events:");
        res.data.forEach((event) => {
          addBotMessage(<EventCard event={event} />);
        });
      } else {
        addBotMessage("Sorry, I couldn't find any events at the moment.");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      addBotMessage("Sorry, I couldn't fetch the events at the moment.");
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
      <motion.div
        className="chatbot-icon"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <BotIcon size={24} />
      </motion.div>

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
                <h3>Ticketspot Assistant</h3>
              </div>
              <button onClick={() => setIsOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="chatbot-icons">
              <IconButton icon={Home} label="Home" onClick={() => handleIconClick("greeting")} />
              <IconButton icon={Info} label="Info" onClick={() => Infos()} />
              <IconButton icon={Calendar} label="Events" onClick={() => handleEvents()} />
              <IconButton icon={Users} label="Family" onClick={() => familyevents()} />
              <IconButton icon={User} label="Solo" onClick={() => Soloevents() }/>
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

