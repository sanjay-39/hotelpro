import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createHotelApi } from "./api";
import "./addhotel.css";

function AddHotel({ hotels, setHotels, onHotelAdded }) {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function addHotel() {
    if (!name || !price) {
      alert("Please provide at least the hotel name and price.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg("");

     
      const formData = new FormData();
      formData.append("name", name);
      formData.append("location", location || "New Location");
      formData.append("description", description);
      formData.append("price", price);
      if (latitude) formData.append("latitude", latitude);
      if (longitude) formData.append("longitude", longitude);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const createdHotel = await createHotelApi(formData);

      if (onHotelAdded) {
        await onHotelAdded();
      } else if (setHotels) {
        setHotels((prev) => [...prev, createdHotel]);
      }

      alert("Hotel added successfully to PostgreSQL database!");
      navigate("/");
    } catch (err) {
      console.error("Error creating hotel:", err);
      setErrorMsg(err.message || "Failed to add hotel");
      alert("Failed to add hotel: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function selectImage(event) {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  }

  return (
    <main className="add-hotel-page">
      <div className={`add-hotel-layout${showPreview ? " has-preview" : ""}`}>
        <form
          className="add-hotel"
          onSubmit={(event) => {
            event.preventDefault();
            addHotel();
          }}
        >
          <h1>Add Hotel</h1>
          <p>Add a new hotel to the database</p>

          {errorMsg && (
            <div style={{ color: "#ef4444", marginBottom: "12px", fontWeight: "500" }}>
              ⚠️ {errorMsg}
            </div>
          )}

          <label htmlFor="hotel-name">Hotel Name *</label>
          <input
            id="hotel-name"
            type="text"
            required
            placeholder="Enter hotel name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label htmlFor="hotel-location">Location</label>
          <input
            id="hotel-location"
            type="text"
            placeholder="e.g. Chennai, Tamil Nadu"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <label htmlFor="hotel-description">Description</label>
          <textarea
            id="hotel-description"
            placeholder="Enter hotel description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>

          <label htmlFor="hotel-price">Price Per Night (₹) *</label>
          <input
            id="hotel-price"
            type="number"
            required
            min="0"
            placeholder="Enter price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <label htmlFor="hotel-latitude">Latitude</label>
          <input
            id="hotel-latitude"
            type="number"
            step="any"
            placeholder="Example: 13.0827"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
          />

          <label htmlFor="hotel-longitude">Longitude</label>
          <input
            id="hotel-longitude"
            type="number"
            step="any"
            placeholder="Example: 80.2707"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
          />

          <label htmlFor="hotel-image">Hotel Image (Uploads to backend/uploads folder)</label>
          <input id="hotel-image" type="file" accept="image/*" onChange={selectImage} />

          <div className="add-hotel-actions">
            <button className="preview-button" type="button" onClick={() => setShowPreview(true)}>
              Preview
            </button>
            <button className="submit-hotel-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving to Database..." : "Add Hotel"}
            </button>
            <button className="cancel-hotel-button" type="button" onClick={() => navigate("/")}>
              Cancel
            </button>
          </div>
        </form>

        {showPreview && (
          <section className="hotel-preview" aria-live="polite">
            <h2>Hotel Card Preview</h2>
            <div className="card preview-hotel-card">
              {imagePreview ? (
                <img src={imagePreview} alt={name ? `${name} preview` : "Hotel preview"} />
              ) : (
                <div className="preview-image-placeholder">Your hotel image will appear here</div>
              )}
              <h2>{name || "Hotel name"}</h2>
              <p>{location || "Location"}</p>
              <p className="card-description">{description || "Hotel description"}</p>
              <p className="card-price">
                {price ? `₹${Number(price).toLocaleString("en-IN")} / night` : "Price per night"}
              </p>
              <div className="card-actions">
                <button type="button" disabled>View Details</button>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default AddHotel;
