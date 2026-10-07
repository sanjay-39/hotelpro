import React from "react";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "./api";
import "./EditSelect.css";

const EditSelect = ({ hotels }) => {
  const navigate = useNavigate();

  return (
    <main className="edit-select-page">
      <div className="edit-select-content">
        <h1>Select Hotel to Edit</h1>

        {(!hotels || hotels.length === 0) ? (
          <p style={{ textAlign: "center", color: "#6b7280", marginTop: "40px" }}>
            No hotels available to edit.
          </p>
        ) : (
          <div className="edit-hotel-list">
            {hotels.map((hotel) => (
              <article className="edit-hotel-card" key={hotel.id}>
                <img
                  src={getImageUrl(hotel.image)}
                  alt={hotel.name}
                  loading="lazy"
                />

                <div className="edit-hotel-card-content">
                  <h2>{hotel.name}</h2>
                  <p className="edit-hotel-description">{hotel.description}</p>
                  <p className="edit-hotel-price">₹{Number(hotel.price).toLocaleString("en-IN")}</p>

                  <button
                    type="button"
                    onClick={() => navigate(`/hotels/${hotel.id}/edit`)}
                  >
                    Edit hotel
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default EditSelect;