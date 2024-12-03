import React, { useState } from "react";
import "./css/ToggleComponent.css";
import EventCreation from "./EventCreation"
import Home from "./Home"
import ShowCompete from "./ShowCompete"
import NavBar from "./Navbar";
import  Chatbot  from "./chatbot";
import Setting from "./Setting";


const ToggleComponent = () => {
  const [activeTab, setActiveTab] = useState("Monuments");

  const renderContent = () => {
    switch (activeTab) {
      case "Monuments":
        return <EventCreation/>;
      case "Analytics":
        return <Home/>;
      case "Competitors":
        return <ShowCompete />;
      case "Setting":
        return <Setting/>;  
      default:
        return null;
    }
  };

  return (
    <div>
    <NavBar/>
    <div className="toggle-container">
    <Chatbot/>
      <div className="toggle-buttons">
        <button
          className={`toggle-button ${activeTab === "Monuments" ? "active" : ""}`}
          onClick={() => setActiveTab("Monuments")}
        >
          Monuments
        </button>
        <button
          className={`toggle-button ${activeTab === "Analytics" ? "active" : ""}`}
          onClick={() => setActiveTab("Analytics")}
        >
          Analytics
        </button>
        <button
          className={`toggle-button ${activeTab === "Competitors" ? "active" : ""}`}
          onClick={() => setActiveTab("Competitors")}
        >
          Competitors
        </button>
        <button
          className={`toggle-button ${activeTab === "Setting" ? "active" : ""}`}
          onClick={() => setActiveTab("Setting")}
        >
          Setting 
        </button>
        
      </div>
      <div className="toggle-content">{renderContent()}</div>
    </div>
    </div>
  );
};


export default ToggleComponent;
