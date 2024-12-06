import React, { useState, useEffect } from 'react';
import './css/home.css';
import Carousel from 'react-bootstrap/Carousel';
import Navbar from "./Navbar";
import Footer from "./footer";
import MonumentChatbot from './chatbot';
import axios from 'axios';
import worldImg from './assets/world.png';
import heroImg from './assets/museum1.jpg';
import heroImg02 from './assets/hero-img02.jpg';
import Chatbot from "./chatbot.js"
import heroVideo from './assets/hero-video.mp4';
import experienceImg from './assets/experience.png';
import Subtitle from '../shared/subtitle.jsx';
import { Container, Row, Col } from 'reactstrap';
import Testimonials from './Testimonial/Testimonials';

import placeholderImg1 from './assets/museum1.jpg';
import placeholderImg2 from './assets/museum2.jpg';
import placeholderImg3 from './assets/museum3.jpg';
import placeholderImg4 from './assets/museum4.jpg';
import placeholderImg5 from './assets/museum5.jpg';
import placeholderImg6 from './assets/museum6.jpeg';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [placeData, setPlaceData] = useState({ name: '', id: null });
  const [recommendedPlaces, setRecommendedPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dummy placeholders in case the API does not return data
  const placeholderData = [
    { id: 1, MonumentName: "Indian Museum", MonumentImage: placeholderImg1, address: "India" },
    { id: 2, MonumentName: "Indian Museum", MonumentImage: placeholderImg5, address: "India" },
    { id: 3, MonumentName: "Indian Museum", MonumentImage: placeholderImg4, address: "India" },
    { id: 4, MonumentName: "Indian Museum", MonumentImage: placeholderImg3, address: "India" },
    { id: 5, MonumentName: "Indian Museum", MonumentImage: placeholderImg2, address: "India" },
    { id: 6, MonumentName: "Indian Museum", MonumentImage: placeholderImg6, address: "India" }
  ];

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/auth/Recommend/`, {
          withCredentials: true
        });
        setRecommendedPlaces(response.data.length > 0 ? response.data : placeholderData);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        setRecommendedPlaces(placeholderData); // Use placeholders if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      console.log("Searching for:", searchTerm);
    }
  };

  // Function to handle click on the carousel or small box
  const handlePlaceClick = (place) => {
    setPlaceData({ name: place.MonumentName, id: place.id });
    setToggle(true);   //Show the chatbot
  };

  const handleCloseChatbot = () => {
    setToggle(false);    //Hide the chatbot
    setPlaceData({ name: '', id: null });
    console.log("hello")
  };

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section>
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="hero__content">
                <div className="hero__subtitle d-flex align-items-center">
                <Subtitle subtitle={'Know Before You Go'} />
                  <img src={worldImg} alt="" />
                </div>
                <h1>
                  Traveling opens the door to creating 
                  <span className='highlight'> memories</span>
                </h1>
                <p>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Ullam ipsum nobis asperiores soluta voluptas quas voluptates.
                </p>
              </div>
            </div>
            <div className="col-lg-2">
              <div className="hero__img-box">
                <img src={heroImg} alt="" />
              </div>
            </div>
            <div className="col-lg-2">
              <div className="hero__img-box hero__video-box mt-4">
                <video src={heroVideo} alt="" controls />
              </div>
            </div>
            <div className="col-lg-2">
              <div className="hero__img-box mt-5">
                <img src={heroImg02} alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Must Visit Places Carousel */}
<div className="carousel-wrapper">
  <div className="carousel-container">
    <Carousel fade>
      {!loading &&
        recommendedPlaces.slice(0, 3).map((place, index) => (
          <Carousel.Item
            key={place.id}
            interval={index === 0 ? 1000 : 500}
            onClick={() => handlePlaceClick(place)}
          >
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
</div>


     {/* Small Boxes Section */}
<div className="small-boxes-section">
  <div className="small-boxes-container">
    {!loading &&
      recommendedPlaces.slice(3, 6).map((place) => (
        <div
          className="small-box"
          key={place.id}
          onClick={() => handlePlaceClick(place)}
        >
          <img
            src={place.MonumentImage}
            alt={place.MonumentName}
            className="small-box-image"
          />
          <h4>{place.MonumentName}</h4>
          <p>{place.address}</p> {/* Use address or similar field */}
        </div>
      ))}
  </div>
</div>


      {/* Experience Section */}
      <section>
        <Container>
          <Row>
          <Col lg='6'>
              <div className="experience__content">
                <Subtitle subtitle={'Immersive Experience'} />
                <h2>Discover Centuries of Art and Culture</h2>
                <p>
                  Step into a world of wonder and history at our museums. From ancient artifacts to contemporary masterpieces, 
                  our curated collections offer a journey through time and human creativity.
                </p>
              </div>
              <div className="counter__wrapper d-flex align-items-center gap-5">
                <div className="counter__box">
                  <span>500k+</span>
                  <h6>Visitors Annually</h6>
                </div>
                <div className="counter__box">
                  <span>100+</span>
                  <h6>Exhibitions</h6>
                </div>
                <div className="counter__box">
                  <span>50+</span>
                  <h6>Years of Excellence</h6>
                </div>
              </div>
            </Col>
            <Col lg='6'>
              <div className="experience__img">
                <img src={experienceImg} alt="" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section>
        <Container>
          <Row>
            <Col lg='12'>
              <Subtitle subtitle={'Fans Love'} />
              <h2 className="testimonial__title">What our fans say about us</h2>
            </Col>
            <Testimonials />
          </Row>
        </Container>
      </section>

      {/* Chatbot Icon */}
<div className="chatbot-icon" onClick={() => setToggle(!toggle)}>
  <i className="fas fa-comment-dots"></i> {/* Font Awesome Icon */}
</div>

{/* Chatbot */}
<Chatbot/>
{/* <iframe height="430" width="350" src="https://bot.dialogflow.com/58e6c49e-6838-4a54-a952-d2b348115aff"></iframe> */}
      <Footer />
    </>
  );
};

export default Home;
