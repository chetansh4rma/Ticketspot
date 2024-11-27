import React, { useState } from 'react';
import axios from 'axios'; // Import axios
import './css/search.css'; // Assuming you have a CSS file for styling
import { useNavigate } from 'react-router-dom';
import Chatbot from "./chatbot";
const SearchPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [region, setRegion] = useState('');
  const [results, setResults] = useState([]); // Store search results
  const [error, setError] = useState(''); // Store errors
  const [showBot, setShowBot] = useState(false); // State to control bot visibility
  const [placeData, setPlaceData] = useState({ name: '', id: null }); // State to hold place data
  const [toggle, setToggle] = useState(false);
  const punjabCities = [
    "Amritsar",
    "Ludhiana",
    "Chandigarh",
    "Jalandhar",
    "Patiala",
    "Mohali",
    "Bathinda",
    "Hoshiarpur",
    "Ferozepur",
    "Moga",
    "Nawanshahr",
    "Rupnagar",
    "Faridkot",
    "Fatehgarh Sahib",
    "Sangrur",
    "Kapurthala",
    "Barnala",
    "Tarn Taran",
    "Pathankot",
    "Gurdaspur",
    "Zira"
  ];

  const handleSearch = async () => {
    try {
      setError(''); // Clear previous errors
      console.log(`Searching for: ${searchTerm} in ${region} with price up to ${priceRange}`);

      // Correctly pass query parameters
      const { data } = await axios.get(`http://localhost:5000/api/auth/search-monuments/${searchTerm}`, {
        params: { region, priceRange }, // Send region and priceRange as query parameters
      });

      setResults(data.total); // Assuming the response has a 'total' array
      console.log(data); // Check the structure of the response in the console
    } catch (error) {
      console.error('Error fetching search results:', error);
      setError('Failed to fetch search results. Please try again.'); // Display an error message to the user
    }
  };
  const handlePlaceClick = (place) => {
    setPlaceData({ name: place.MonumentName, id: place._id });  // Set place data
    setToggle(true);  // Show the chatbot
  };
  const handleCloseChatbot = () => {
    setToggle(false);  // Hide the chatbot
    setPlaceData({ name: '', id: null });
    console.log("hello")
  };
  const handleResultClick = () => {
    setShowBot(!showBot); // Show the bot when a result is clicked
  };

  return (
    <div className="search-page">
      <div className="filters">
       <br></br>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">Search</button>
        
        <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className="filter-select">
          <option value="">Price Range</option>
          <option value="100">Up to $100</option>
          <option value="200">Up to $200</option>
          <option value="300">Up to $300</option>
        </select>

        <select value={region} onChange={(e) => setRegion(e.target.value)} className="filter-select">
          <option value="">Select City</option>
          {punjabCities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      {/* Iframe for Dialogflow Bot */}
      {toggle && <Chatbot placeData={placeData} handleCloseChatbot={handleCloseChatbot}/>} 

      <div className={`results-container ${showBot ? 'blur' : ''}`}>
        {error && <p className="error-message">{error}</p>} {/* Display error message if there's an error */}  
        {results.length > 0 ? (
          results.map(item => (
            <button key={item._id} className="result" onClick={()=>{handlePlaceClick(item)}}>
              <img src={item.MonumentImage} alt={item.MonumentName} className="result-image" />
              <div className="result-description">
                <h4>{item.MonumentName}</h4>
                <p>Address: {item.address.street}, {item.address.city}, {item.address.state}, {item.address.zipCode}</p>
                <p>Contact: {item.contactNumber}</p>
                <p>Email: {item.email}</p>
              </div>
            </button>
          ))
        ) : (
          <p>No results found</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
