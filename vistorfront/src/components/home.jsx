import React, { useState, useEffect } from 'react';
import './css/home.css'; // Assuming you have a CSS file for styling
import Carousel from 'react-bootstrap/Carousel'; // Make sure to install react-bootstrap and bootstrap
import HomeHero from './hero';
import Navbar from "./Navbar";
import Footer from "./footer";
import MonumentChatbot from './chatbot';
import axios from 'axios'; // Make sure to install axios

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [toggle, setToggle] = useState(false);  // State to show/hide the chatbot
  const [placeData, setPlaceData] = useState({ name: '', id: null }); // State to hold place data
  const [recommendedPlaces, setRecommendedPlaces] = useState([]); // State to hold recommended places
  const [loading, setLoading] = useState(true); // State to handle loading

  // Fetch recommendations on component mount
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/auth/Recommend/`, {
          withCredentials: true
        }); 
        setRecommendedPlaces(response.data); // Assuming response is an array of recommendations
        console.log("Response", response);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchRecommendations();
  }, []); // This runs once when the component mounts

  const handleSearch = () => {
    console.log("Searching for:", searchTerm);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  // Function to handle click on the carousel or small box
  const handlePlaceClick = (place) => {
    setPlaceData({ name: place.MonumentName, id: place._id });  // Set place data
    setToggle(true);  // Show the chatbot
  };
  const handleCloseChatbot = () => {
    setToggle(false);  // Hide the chatbot
    setPlaceData({ name: '', id: null });
    console.log("hello")
  };
  return (
    <>
      <Navbar />
      <HomeHero />
      
      {/* Must Visit Places Carousel */}
      <div className="carousel-container">
        <Carousel>
          {!loading && recommendedPlaces.slice(0, 3).map(place => ( // Get first 3 recommendations for carousel
            <Carousel.Item key={place.id} onClick={() => handlePlaceClick(place)}>
              <img
                className="d-block w-100 carousel-image"
                src={place.MonumentImage} // Use MonumentImage from response
                alt={place.MonumentName} // Use MonumentName from response
              />
              <Carousel.Caption>
                <h3>{place.MonumentName}</h3>
                <p>{place.address}</p> {/* Use address or similar field */}
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>

      {/* Small Boxes Section */}
      <div className="small-boxes-container">
        {!loading && recommendedPlaces.slice(3, 6).map(place => ( // Get next 3 recommendations for small boxes
          <div className="small-box" key={place.id} onClick={() => handlePlaceClick(place)}>
            <img src={place.MonumentImage} alt={place.MonumentName} className="small-box-image" />
            <h4>{place.MonumentName}</h4>
            <p>{place.address}</p> {/* Use address or similar field */}
          </div>
        ))}
      </div>

      {/* Chatbot Component */}
      {toggle && <MonumentChatbot placeData={placeData} handleCloseChatbot={handleCloseChatbot}/>} 

      <Footer />
    </>
  );
};

export default Home;
