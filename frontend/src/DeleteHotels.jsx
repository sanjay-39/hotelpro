import React, { useState } from "react";
import { deleteHotelApi, getImageUrl } from "./api";
import "./delete-hotels.css";

const DeleteHotels = ({ hotels, setHotels, onHotelDeleted }) => {
  const [deletingId, setDeletingId] = useState(null);

  const deleteHotel = async (hotel) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${hotel.name}" from the database?`)) {
      return;
    }

    try {
      setDeletingId(hotel.id);
      await deleteHotelApi(hotel.id);

      if (onHotelDeleted) {
        await onHotelDeleted();
      } else if (setHotels) {
        setHotels((currentHotels) =>
          currentHotels.filter((currentHotel) => currentHotel.id !== hotel.id)
        );
      }

      alert(`"${hotel.name}" was successfully deleted from PostgreSQL!`);
    } catch (err) {
      console.error("Failed to delete hotel:", err);
      alert("Failed to delete hotel from database: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="delete-hotels-page">
      <header className="delete-hotels-heading">
        <h1>Delete hotels</h1>
        <p>Select a hotel to permanently remove it from PostgreSQL database.</p>
      </header>

      <div className="delete-hotel-list">
        {hotels.map((hotel) => (
          <article className="delete-hotel-row" key={hotel.id}>
            <img src={getImageUrl(hotel.image)} alt={hotel.name} loading="lazy" />
            <div className="delete-hotel-info">
              <h2>{hotel.name}</h2>
              <p>{hotel.location}</p>
              <p>₹{Number(hotel.price).toLocaleString("en-IN")} / night</p>
            </div>
            <button
              type="button"
              aria-label={`Delete ${hotel.name}`}
              disabled={deletingId === hotel.id}
              onClick={() => deleteHotel(hotel)}
            >
              {deletingId === hotel.id ? "Deleting..." : "Delete"}
            </button>
          </article>
        ))}
        {(!hotels || hotels.length === 0) && (
          <p className="delete-hotels-empty">There are no hotels in the database to delete.</p>
        )}
      </div>
    </main>
  );
};

export default DeleteHotels;