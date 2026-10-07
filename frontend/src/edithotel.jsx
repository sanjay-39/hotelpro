import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateHotelApi, fetchHotelByIdApi, getImageUrl } from "./api";
import "./edithotel.css";

const EditHotel = ({ hotels, setHotels, onHotelUpdated }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const foundHotel = (hotels || []).find((h) => h.id === Number(id));

  const [name, setName] = useState(foundHotel?.name || "");
  const [location, setLocation] = useState(foundHotel?.location || "");
  const [description, setDescription] = useState(foundHotel?.description || "");
  const [price, setPrice] = useState(foundHotel?.price || "");
  const [latitude, setLatitude] = useState(foundHotel?.latitude || "");
  const [longitude, setLongitude] = useState(foundHotel?.longitude || "");
  const [image, setImage] = useState(foundHotel?.image || "");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (foundHotel) {
      setName(foundHotel.name || "");
      setLocation(foundHotel.location || "");
      setDescription(foundHotel.description || "");
      setPrice(foundHotel.price || "");
      setLatitude(foundHotel.latitude || "");
      setLongitude(foundHotel.longitude || "");
      setImage(foundHotel.image || "");
    } else if (id) {
      setLoading(true);
      fetchHotelByIdApi(id)
        .then((data) => {
          setName(data.name || "");
          setLocation(data.location || "");
          setDescription(data.description || "");
          setPrice(data.price || "");
          setLatitude(data.latitude || "");
          setLongitude(data.longitude || "");
          setImage(data.image || "");
        })
        .catch((err) => {
          console.error("Failed to fetch hotel details:", err);
          setErrorMsg("Hotel not found in database.");
        })
        .finally(() => setLoading(false));
    }
  }, [id, foundHotel]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!name || !price) {
      alert("Hotel name and price are required.");
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
      } else if (image) {
        formData.append("image", image);
      }

      const updated = await updateHotelApi(id, formData);

      if (onHotelUpdated) {
        await onHotelUpdated();
      } else if (setHotels) {
        setHotels((prev) =>
          prev.map((item) => (item.id === Number(id) ? updated : item))
        );
      }

      alert("Hotel updated successfully in database!");
      navigate("/");
    } catch (err) {
      console.error("Failed to update hotel:", err);
      setErrorMsg(err.message || "Failed to update hotel");
      alert("Failed to update hotel: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px", color: "#6b7280" }}>
        Loading hotel details...
      </div>
    );
  }

  if (errorMsg && !name) {
    return (
      <div className="edit-error">
        <h2>{errorMsg}</h2>
        <button onClick={() => navigate("/")}>Back to Hotels</button>
      </div>
    );
  }

  return (
    <div className="edit-hotel-page">
      <div className="edit-hotel-container">
        <h1>Edit Hotel</h1>
        <p className="edit-subtitle">Update the hotel information in PostgreSQL</p>

        {errorMsg && (
          <div style={{ color: "#ef4444", marginBottom: "16px", fontWeight: "500" }}>
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleUpdate}>
          {/* Hotel Name */}
          <div className="form-group">
            <label>Hotel Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter hotel name"
            />
          </div>

          {/* Location */}
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Chennai, Tamil Nadu"
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter hotel description"
              rows="4"
            />
          </div>

          {/* Price */}
          <div className="form-group">
            <label>Price (₹) *</label>
            <input
              type="number"
              required
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
            />
          </div>

          {/* Latitude */}
          <div className="form-group">
            <label>Latitude</label>
            <input
              type="number"
              step="any"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="Enter latitude"
            />
          </div>

          {/* Longitude */}
          <div className="form-group">
            <label>Longitude</label>
            <input
              type="number"
              step="any"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="Enter longitude"
            />
          </div>

          {/* Image */}
          <div className="form-group">
            <label>Hotel Image (Select new image to replace)</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />

            {(previewUrl || image) && (
              <div className="image-preview" style={{ marginTop: "10px" }}>
                <img
                  src={previewUrl || getImageUrl(image)}
                  alt="Hotel Preview"
                  style={{ maxWidth: "240px", maxHeight: "160px", borderRadius: "8px", objectFit: "cover" }}
                />
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="edit-buttons">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>

            <button type="submit" className="update-btn" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Hotel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditHotel;
