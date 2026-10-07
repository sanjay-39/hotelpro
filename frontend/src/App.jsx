import React, { useState, useEffect, useCallback } from "react";
import Nav from "./nav";
import Search from "./search";
import HotelDetails from "./hoteldetails";
import Addhotel from "./Addhotel";
import EditHotel from "./edithotel";
import EditSelect from "./EditSelect";
import DeleteHotels from "./DeleteHotels";
import Help from "./Help";
import { fetchHotelsApi } from "./api";

import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadHotels = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchHotelsApi();
      setHotels(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load hotels:", err);
      setError(err.message || "Failed to load hotels from database");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHotels();
  }, [loadHotels]);

  return (
    <BrowserRouter>
      <Nav />

      {error && (
        <div
          style={{
            background: "#fee2e2",
            border: "1px solid #ef4444",
            color: "#b91c1c",
            padding: "12px 20px",
            margin: "16px auto",
            maxWidth: "960px",
            borderRadius: "8px",
            textAlign: "center",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>⚠️ {error}. Ensure your backend server is running on port 5000.</span>
          <button
            onClick={loadHotels}
            style={{
              background: "#b91c1c",
              color: "#fff",
              border: "none",
              padding: "6px 12px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        </div>
      )}

      {loading && hotels.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "80px 20px",
            fontSize: "18px",
            color: "#6b7280",
          }}
        >
          Loading hotels from database...
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<Search hotels={hotels} />} />
          <Route path="/hotel/:id" element={<HotelDetails hotels={hotels} />} />
          <Route
            path="/addhotel"
            element={<Addhotel hotels={hotels} setHotels={setHotels} onHotelAdded={loadHotels} />}
          />
          <Route path="/edithotel" element={<EditSelect hotels={hotels} />} />
          <Route
            path="/deletehotel"
            element={<DeleteHotels hotels={hotels} setHotels={setHotels} onHotelDeleted={loadHotels} />}
          />
          <Route path="/help" element={<Help />} />
          <Route
            path="/hotels/:id/edit"
            element={<EditHotel hotels={hotels} setHotels={setHotels} onHotelUpdated={loadHotels} />}
          />
        </Routes>
      )}
    </BrowserRouter>
  );
};

export default App;