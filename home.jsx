import React, { useState } from 'react';
import './css/home.css'; // Assuming you have a CSS file for styling
import Carousel from 'react-bootstrap/Carousel'; // Make sure to install react-bootstrap and bootstrap
import HomeHero from './hero';
import Navbar from "./Navbar";
import Footer from "./footer";
// import MonumentChatbot from './chatbot';
import Chatbot from './chatbot';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [toggle, setToggle] = useState(false);  // State to show/hide the chatbot
  const [placeData, setPlaceData] = useState({ name: '', id: null ,price:30}); // State to hold place data

  // Dummy data for the carousel (Must Visit Places)
  const mustVisitPlaces = [
    { id: "6707ff330a24ea85e85556fa", name: 'jaliavala bagh', image: 'https://th.bing.com/th/id/OIP.PBVpd65UNCkcEKEFRcScJwHaF6?rs=1&pid=ImgDetMain', location: 'Agra, India' },
    { id: 2, name: 'Great Wall of China', image: 'https://cdn.getyourguide.com/img/tour/ecab6118a7607be335ffe5d3767459ef96da00ab6ff59063c6f25a345c92443a.jpg/98.jpg', location: 'China' },
    { id: 3, name: 'Colosseum', image: 'https://cdn.getyourguide.com/img/tour/33cca66c19886c9f.jpeg/145.jpg', location: 'Rome, Italy' },
  ];

  const handleSearch = () => {
    console.log("Searching for:", searchTerm);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  // Function to handle click on the carousel or small box
  const handlePlaceClick = (place) => {
    setPlaceData({ name: place.name, id: place.id });
    setToggle(true);  // Show the chatbot
  };

  const handleCloseChatbot = () => {
    setToggle(false);  // Hide the chatbot
    setPlaceData({ name: '', id: null });
    console.log("hello")
  };
  

  return (
    <>
       <div><Navbar />
      <HomeHero />
      
      {/* Must Visit Places Carousel */}
      <div className="carousel-container">
        <Carousel>
          {mustVisitPlaces.map(place => (
            <Carousel.Item key={place.id} onClick={() => handlePlaceClick(place)}>
              <img
                className="d-block w-100 carousel-image"
                src={place.image}
                alt={place.name}
              />
              <Carousel.Caption>
                <h3>{place.name}</h3>
                <p>{place.location}</p>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>

      {/* Small Boxes Section */}
      <div className="small-boxes-container">
        {mustVisitPlaces.map(place => (
          <div className="small-box" key={place.id} onClick={() => handlePlaceClick(place)}>
            <img src={place.image} alt={place.name} className="small-box-image" />
            <h4>{place.name}</h4>
            <p>{place.location}</p>
          </div>
        ))}
      </div>

      {/* Chatbot Component */}
      {toggle && <Chatbot placeData={placeData} handleCloseChatbot={handleCloseChatbot}/>} 
      
      <Footer />
      
      </div>
       {/* Pass placeData as props to MonumentChatbot */}

    </>
  );
};

export default Home;
