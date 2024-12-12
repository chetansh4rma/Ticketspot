import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BotIcon, X, Send, Home, Info, Calendar, Users, User, Mic, MapPin, Clock, Ticket } from 'lucide-react';
import axios from "axios";
import './css/Chatbot.css';
import { franc } from 'franc';
import langs from 'langs';
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
  const [place, setplace] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [cities, setcities] = useState(null);
  const [dates, setdate] = useState(null);

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
  const Soloevents = async (place) => {
    try {
      addBotMessage(<div className="bot-typing">Thinking<span>.</span><span>.</span><span>.</span></div>)
      const res = await axios.get(`http://localhost:5000/fetchmuseumSoloevents/${place}`);
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
      const fetchcity = await axios.post("http://localhost:5000/fetchplace", {}, {
        withCredentials: true, // Ensure cookies are sent with the request
      });
      const city = fetchcity.data.city;
      const state = fetchcity.data.state;
      console.log(input);
      const language = await detectLanguage(input);
      console.log("Detected Language:", language);
      const response = await fetch('https://dialogflow.googleapis.com/v2/projects/ticketspot-omya/agent/sessions/2316bc98-ed4b-623a-68ce-23d9180d0da8:detectIntent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ya29.a0AeDClZA6FFwAPRltjsTGkh4Iep1ONTtveK6zTB_3d3si9-FlyZt1hgycAhhiIzWcIvjTntQ5yOnaSn4xDERrQmbCdD2ZQ-uLR-o6Yka12k-FcOoXBfOTzT8S5TdPnLFNfjeelr0KapJq423z2TXazQN0oQRF8NuV9LtiE1jNfWvup7GYA57MWVwEmtz3oK-0sNchM8wuhfUjB76HSjo-ozN2oOvSoj7Z89A_afa-3i63e902CudEaAC1gawxE2jnFjlHJeZyN6cNK-MiNi4G6SCwzL1v2zTg9aYGwgtGFMYzwMgum40MwRwsNMkLPIXOCrEI4DvOBxD5QM3PclqxqGq0wX1R8LvZq_9Wbqd3c8D01FTYZHH1cyO5lHDWHuqCEbfx8dLpLE513tJywEyzoxeKccKagFudd3_OQftlztAPFAaCgYKAYwSARMSFQHGX2MiVhjAxHAWT75ULXA7kiQ_rg0437`,
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
        credentials: 'include', // Correct placement of the credentials property
      });

      const data = await response.json();
console.log("response : ",data);
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
            Soloevents(city);
            break;
          case "Technological":
            try{const date=data.queryResult.parameters.date_time;
            const cityintent=data.queryResult.parameters.city;
           if(date&&cityintent){
            const res = await axios.post(`http://localhost:5000/fetchmuseumtechnological`,{city:cityintent,date:date,Category:"Technological"});
           console.log(res.data);
            if(!res.data.length===0){
                res.data.randomMonuments.forEach((event) => {
                  const { MonumentName, _id } = event;
              addBotMessage(
                <button
                  onClick={() => window.open(`http://localhost:3000/product/${_id}`, '_blank')}
                  className="redirect-button"
                >
                  Visit {MonumentName}
                </button>
              );
            });
              }
              else{
                addBotMessage("Sorry, I couldn't find any museums at the moment.");
              }
           }}
           catch{
            console.error("Error fetching solo events:", error);
           }
            break;
          case "cheap_places":
            try{const date=data.queryResult.parameters.date_time;
            const cityintent=data.queryResult.parameters.city;
            const budget=data.queryResult.parameters.budget;
           if(date&&cityintent&&budget){
            const res = await axios.post(`http://localhost:5000/cheapplaces`,{city:cityintent,date:date,budget:budget});
            res.data.forEach((event) => {
              const { MonumentName, _id } = event;
              addBotMessage(
                <button
                  onClick={() => window.open(`http://localhost:3000/product/${_id}`, '_blank')}
                  className="redirect-button"
                >
                  Visit {MonumentName}
                </button>
              );
            });
           }}
           catch{
            console.error("Error fetching solo events:", error);
           }
            break;
          case "Cultural":
            try {
              const date = data.queryResult.parameters.date_time;
              const cityintent = data.queryResult.parameters.city;
          console.log("cityintent",cityintent)
              if (date && cityintent) {
                const res = await axios.post(`http://localhost:5000/fetchmuseumtechnological`, {
                  city: cityintent,
                  date: date,
                  Category: "Cultural"
                });
          
                console.log(res);
          
                if (res.data && res.data.length > 0) {
                  // If monuments are found, display them
                  res.data.forEach((event) => {
                    const { MonumentName, _id } = event;
                    addBotMessage(
                      <button
                        onClick={() => window.open(`http://localhost:3000/product/${_id}`, '_blank')}
                        className="redirect-button"
                      >
                        Visit {MonumentName}
                      </button>
                    );
                  });
                } else {
                  // Assuming random monuments are returned as part of `res.data.monuments`
                  const randomMonuments = res.data.monuments;  // Access random monuments from the response
          
                  if (randomMonuments && randomMonuments.length > 0) {
                    randomMonuments.forEach((event) => {
                      const { MonumentName, _id } = event;
                      addBotMessage(
                        <button
                          onClick={() => window.open(`http://localhost:3000/product/${_id}`, '_blank')}
                          className="redirect-button"
                        >
                          Visit {MonumentName}
                        </button>
                      );
                    });
                  } else {
                  }
                }
              }
            } catch (error) {
              console.error("Error fetching events:", error);
              addBotMessage("Sorry, I couldn't fetch the events at the moment.");
            }
            break;
          
          
      
          case "Artistic":
            try{const date=data.queryResult.parameters.date_time;
            const cityintent=data.queryResult.parameters.city;
           if(date&&cityintent){
            const res = await axios.post(`http://localhost:5000/fetchmuseumtechnological`,{city:cityintent,date:date,Category:"Artistic"});
            if(!res.data.length===0){
              res.data.forEach((event) => {
                const { MonumentName, _id } = event;
            addBotMessage(
              <button
                onClick={() => window.open(`http://localhost:3000/product/${_id}`, '_blank')}
                className="redirect-button"
              >
                Visit {MonumentName}
              </button>
            );
          });
            }
            else{
              addBotMessage("Sorry, I couldn't find any museums at the moment.");
            }
           }}
           catch{
            console.error("Error fetching  events:", error);
           }
            break;
          case "Historical":
            try{const date=data.queryResult.parameters.date_time;
            const cityintent=data.queryResult.parameters.city;
           if(date&&cityintent){
            const res = await axios.post(`http://localhost:5000/fetchmuseumtechnological`,{city:cityintent,date:date,Category:"Historical"});
            if(!res.data.length===0){
              res.data.forEach((event) => {
                const { MonumentName, _id } = event;
            addBotMessage(
              <button
                onClick={() => window.open(`http://localhost:3000/product/${_id}`, '_blank')}
                className="redirect-button"
              >
                Visit {MonumentName}
              </button>
            );
          });
            }
            else{
              addBotMessage("Sorry, I couldn't find any museums at the moment.");
            }
           }}
           catch{
            console.error("Error fetching  events:", error);
           }
            break;
          case "Scientific":
            try{const date=data.queryResult.parameters.date_time;
            const cityintent=data.queryResult.parameters.city;
           if(date&&cityintent){
            const res = await axios.post(`http://localhost:5000/fetchmuseumtechnological`,{city:cityintent,date:date,Category:"Scientific"});
            if(!res.data.length===0){
              res.data.forEach((event) => {
                const { MonumentName, _id } = event;
            addBotMessage(
              <button
                onClick={() => window.open(`http://localhost:3000/product/${_id}`, '_blank')}
                className="redirect-button"
              >
                Visit {MonumentName}
              </button>
            );
          });
            }
            else{
              addBotMessage("Sorry, I couldn't find any museums at the moment.");
            }
           }}
           catch{
            console.error("Error fetching  events:", error);
           }
            break;
      
          case "PlaceToVisitIntent":
            const Place = data.queryResult.parameters.place||"Calico Museum of Texttiles";
            console.log("Place", Place)
            try {
              addBotMessage(<div className="bot-typing">Thinking<span>.</span><span>.</span><span>.</span></div>);
              const res = await axios.get(`http://localhost:5000/fetchmuseumfromplace/${Place}`);
              console.log("Res", res);
              res.data.forEach((event) => {
                const { MonumentName, _id } = event;
                addBotMessage(
                  <div>
                    <button
                      onClick={() => window.open(`http://localhost:3000/product/${_id}`, '_blank')}
                      className="redirect-button"
                    >
                      Visit {MonumentName}
                    </button>
                  </div>
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
              
                // Capture city, date, and category from Dialogflow parameters
                const city ="new delhi"; 

            
                // Check if city, date, and category are captured
                if (cities) {
                  // Make API request with captured parameters
                  const res = await axios.post(`http://localhost:5000/fetchmuseumDefault/`, {
                    city: city,
                  });
            
                  if (res.data && res.data.length > 0) {
                    addBotMessage("Here are the upcoming events:");
                    res.data.map((event) => {
                      console.log(event);
                      addBotMessage(<EventCard event={event} />);
                    });
                  } else {
                    addBotMessage("Sorry, I couldn't find any events at the moment.");
                  }
                } else {
                  // If parameters are not captured, ask for missing information
                  if (!cities) {
                    setcities(input);
                    addBotMessage("I didn't catch the city. Can you please tell me the city?");
                  } else if (!dates) {
                    setdate(input);
                    addBotMessage("Can you please provide the date you're looking for?");
                  } 
                  console.log("cities: ",cities,"date:",dates);
                }
              } catch (error) {
                console.error("Error fetching events:", error);
                addBotMessage("Sorry, I couldn't fetch the events at the moment.");
              }
              break;
            
         
          case "Historical":
            try{const date=data.queryResult.parameters.date_time;
              const cityintent=data.queryResult.parameters.city;
             if(date&&cityintent){
              const res = await axios.post(`http://localhost:5000/fetchmuseumtechnological`,{city:cityintent,date:date,Category:"Technological"});
             console.log(res.data);
              if(!res.data.length===0){
                  res.data.forEach((event) => {
                    const { MonumentName, _id } = event;
                addBotMessage(
                  <button
                    onClick={() => window.open(`http://localhost:3000/product/${_id}`, '_blank')}
                    className="redirect-button"
                  >
                    Visit {MonumentName}
                  </button>
                );
              });
                }
                else{
                  addBotMessage("Sorry, I couldn't find any museums at the moment.");
                }
             }}
             catch{
              console.error("Error fetching solo events:", error);
             }
            break;
          case "Artistic":
            try {
              const res = await axios.post(`${process.env.REACT_APP_BACK_URL}/category`, {
                category: "Artistic",
                city: city,
                state: state
              });

              if (res.data && res.data.length > 0) {
                addBotMessage("Here are the upcoming events:");
                res.data.map((event) => {
                  console.log(event);
                  addBotMessage(<EventCard event={event} />);
                });
              } else {
                addBotMessage("Sorry, I couldn't find any events at the moment.");
              }
            }
            catch {
              console.error("Error fetching  events:", error);
              addBotMessage("Sorry, I couldn't fetch the events at the moment.");
            }
            break;
        case "student_event":
  try {
    const Budget = data.queryResult.parameters.budget;

    // Check if budget is provided
    if (!Budget) {
      addBotMessage("Please provide your budget to fetch events.");
      break; // Exit the case early if there's no budget
    }

    // Indicate that the bot is processing the request
    addBotMessage(
      <div className="bot-typing">
        Thinking<span>.</span><span>.</span><span>.</span>
      </div>
    );

    // Fetch events based on budget and city
    const res = await axios.post(`${process.env.REACT_APP_BACK_URL}/fetchmuseumStudentevents`, {
      budget: Budget,
      city: city,
    });

    console.log("Res", res);

    // Display fetched events as buttons
    res.data.forEach((event) => {
      const { MonumentName, _id } = event;
      addBotMessage(
        <button
          onClick={() => window.open(`http://localhost:3000/product/${_id}`, '_blank')}
          className="redirect-button"
        >
          Visit {MonumentName}
        </button>
      );
    });
  } catch (error) {
    console.error("Error fetching events:", error);
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

            if (language.name === "tamil") {
              try {
                addBotMessage(<div className="bot-typing">Thinking<span>.</span><span>.</span><span>.</span></div>);
                console.log("Hello world");
                const res = await axios.get(`http://localhost:5000/fetchmuseumDefaultamil`);
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
                console.error("Error fetching  events:", error);
                addBotMessage("Sorry, I couldn't fetch the events at the moment.");
              }
            }
            else {
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

            }
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
  const familyevents = async () => {
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
  const Infos = () => {
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
  function detectLanguage(text) {
    console.log(text);
    const langCode = franc(text); // Detect the language code
    if (langCode === 'und') {
      return 'Language could not be detected';
    }
    const language = langs.where('3', langCode); // Get the language name
    console.log("Detected Language:", language);
    return language;
  }
  const handleIconClick = (intent) => {
    fetchApiResponse(intent);
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';

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
              <IconButton icon={User} label="Solo" onClick={() => Soloevents()} />
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

