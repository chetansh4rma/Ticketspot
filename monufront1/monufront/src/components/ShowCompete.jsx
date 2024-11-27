import React, { useState, useEffect } from "react";
import Navbar from './Navbar'; // Assuming you have a Navbar component
import axios from 'axios';
import './css/ShowCompete.css'; // Optional: Add custom styles

export default function ShowCompete() {
  const [competitors, setCompetitors] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchCompetitors = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/agency/competitors-show?page=${page}&limit=6`, { withCredentials: true });
      const newCompetitors = response.data.competitors;

      setCompetitors((prev) => [...prev, ...newCompetitors]);
      console.log(response.data.competitors);
      setHasMore(newCompetitors.length > 0); // Check if there are more competitors
    } catch (error) {
      console.error("Error fetching competitors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompetitors();
  }, [page]); // Fetch competitors when the page number changes

  const handleLoadMore = () => {
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="competitor-list">
        {competitors.map((competitor, index) => (
          <div className="card" style={{ width: "18rem", margin: "1rem" }} key={index}>
            <img src={`${process.env.REACT_APP_BACK_URL}/images/${competitor.url}`} className="card-img-top" alt={competitor.agencyName} />
            <div className="card-body">
              <h5 className="card-title">{competitor.agencyName}</h5>
              <p className="card-text">
                <strong>Monument:</strong> {competitor.monumentName} <br />
                <strong>Timing:</strong> {competitor.eventTime} <br />
                <strong>Ticket Price:</strong> ₹{competitor.ticketPrice}
              </p>
            </div>
          </div>
        ))}
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        hasMore && (
          <div className="load-more-container">
            <button onClick={handleLoadMore} className="btn btn-primary">Load More</button>
          </div>
        )
      )}
    </div>
  );
}
