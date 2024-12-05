import React, { useEffect, useState } from "react"; 
import axios from "axios";

const FlightDetails = () => {
  const [flightData, setFlightData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL =
    "https://api.flightapi.io/onewaytrip/674daae5e8f3d4c048392b72/DEL/CJB/2024-12-10/1/0/0/Economy/INR";

  useEffect(() => {
    const fetchFlightData = async () => {
      try {
        const response = await axios.get(API_URL);
        setFlightData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFlightData();
  }, []);

  if (loading) return <p>Loading flight details...</p>;
  if (error) return <p>Error: {error}</p>;

  const { itineraries, legs, segments, places, carriers, agents } = flightData;

  return (
    <div>
      <h1>Flight Details</h1>

      {itineraries?.map((itinerary, index) => (
        <div key={itinerary.id} className="itinerary">
          <h2>Itinerary {index + 1}</h2>
          <p>
            <strong>ID:</strong> {itinerary.id}
          </p>
          <p>
            <strong>Price:</strong> {itinerary.pricing_options[0]?.price.amount}{" "}
            {itinerary.pricing_options[0]?.price.currency || "Currency"}
          </p>
          <p>
            <strong>Booking Agent:</strong>{" "}
            {agents?.find(
              (agent) => agent.id === itinerary.pricing_options[0]?.agent_ids[0]
            )?.name || "Unknown"}
          </p>

          {itinerary.leg_ids?.map((legId) => {
            const leg = legs?.find((l) => l.id === legId);

            return (
              <div key={leg.id} className="leg">
                <h3>Leg Details</h3>
                <p>
                  <strong>Origin:</strong>{" "}
                  {places?.find((place) => place.id === leg.origin_place_id)
                    ?.name || "Unknown"}
                </p>
                <p>
                  <strong>Destination:</strong>{" "}
                  {places?.find(
                    (place) => place.id === leg.destination_place_id
                  )?.name || "Unknown"}
                </p>
                <p>
                  <strong>Departure:</strong> {leg.departure}
                </p>
                <p>
                  <strong>Arrival:</strong> {leg.arrival}
                </p>
                <p>
                  <strong>Duration:</strong> {leg.duration} mins
                </p>
                <p>
                  <strong>Carrier:</strong>{" "}
                  {carriers?.find((carrier) =>
                    leg.marketing_carrier_ids.includes(carrier.id)
                  )?.name || "Unknown"}
                </p>

                {leg.segment_ids?.map((segmentId) => {
                  const segment = segments?.find((s) => s.id === segmentId);
                  return (
                    <div key={segment.id} className="segment">
                      <h4>Segment Details</h4>
                      <p>
                        <strong>Flight Number:</strong>{" "}
                        {segment.marketing_flight_number}
                      </p>
                      <p>
                        <strong>Segment Duration:</strong> {segment.duration}{" "}
                        mins
                      </p>
                      <p>
                        <strong>Mode:</strong> {segment.mode}
                      </p>
                    </div>
                  );
                })}
              </div>
            );
          })}

          {/* Add Redirect Button */}
          {console.log(itinerary.pricing_options[0]?.redirectUrl)}
          <button
            onClick={() =>
              window.open(
                itinerary.pricing_options[0]?.redirectUrl || "#",
                "_blank"
              )
            }
          >
            Book Now
          </button>
        </div>
      ))}
    </div>
  );
};

export default FlightDetails;
