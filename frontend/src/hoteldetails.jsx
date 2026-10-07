
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getImageUrl, fetchHotelByIdApi } from "./api";

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getNextDate = (dateValue) => {
  const date = new Date(`${dateValue}T00:00:00`);
  date.setDate(date.getDate() + 1);
  return formatDate(date);
};

const getStayNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) {
    return 0;
  }

  const [startYear, startMonth, startDay] = checkIn.split("-").map(Number);
  const [endYear, endMonth, endDay] = checkOut.split("-").map(Number);
  const start = Date.UTC(startYear, startMonth - 1, startDay);
  const end = Date.UTC(endYear, endMonth - 1, endDay);

  return Math.max(0, (end - start) / 86400000);
};

const formatPrice = (amount) => `₹${Number(amount || 0).toLocaleString("en-IN")}`;

const HotelDetails = ({ hotels }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [singleHotel, setSingleHotel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    guests: "1",
  });

  const hotel = (hotels || []).find((h) => h.id === Number(id)) || singleHotel;

  useEffect(() => {
    setActiveImageIndex(0);
    if (!hotel && id) {
      setLoading(true);
      fetchHotelByIdApi(id)
        .then((data) => setSingleHotel(data))
        .catch((err) => console.error("Error fetching hotel details:", err))
        .finally(() => setLoading(false));
    }
  }, [id, hotel]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px", color: "#6b7280" }}>
        Loading hotel details...
      </div>
    );
  }

  if (!hotel) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <h1>Hotel Not Found</h1>
        <button onClick={() => navigate("/")} style={{ padding: "8px 16px", cursor: "pointer" }}>
          Back to Hotels
        </button>
      </div>
    );
  }

  const hotelImages = hotel.images?.length
    ? hotel.images
    : hotel.image
      ? [hotel.image]
      : [];
  const activeImage = hotelImages[activeImageIndex];

  const showImage = (index) => {
    setActiveImageIndex((index + hotelImages.length) % hotelImages.length);
  };

  const today = formatDate(new Date());
  const stayNights = getStayNights(customer.checkIn, customer.checkOut);
  const estimatedTotal = stayNights * hotel.price;

  const updateCustomer = (event) => {
    const { name, value } = event.target;
    setCustomer((currentCustomer) => ({ ...currentCustomer, [name]: value }));
  };

  const submitBooking = (event) => {
    event.preventDefault();
    setBookingDetails({
      ...customer,
      hotelName: hotel.name,
      location: hotel.location,
      nightlyRate: hotel.price,
      nights: stayNights,
      total: estimatedTotal,
    });
  };

  return (
    <main className="hotel-details-page">
      <section className="hotel-details">
      <h1>Hotel Details</h1>
      <div className="hotel-image-carousel" aria-label={`${hotel.name} images`}>
        {activeImage ? (
          <img
            key={activeImage}
            src={getImageUrl(activeImage)}
            alt={`${hotel.name} - image ${activeImageIndex + 1} of ${hotelImages.length}`}
            className="details-image"
          />
        ) : (
          <div className="details-image-placeholder">No hotel image available</div>
        )}
        {hotelImages.length > 1 && (
          <>
            <button
              className="carousel-arrow carousel-arrow-left"
              type="button"
              aria-label="Show previous hotel image"
              onClick={() => showImage(activeImageIndex - 1)}
            >
              ←
            </button>
            <button
              className="carousel-arrow carousel-arrow-right"
              type="button"
              aria-label="Show next hotel image"
              onClick={() => showImage(activeImageIndex + 1)}
            >
              →
            </button>
          </>
        )}
      </div>
      {hotelImages.length > 1 && (
        <div className="carousel-indicators" aria-label="Choose hotel image">
          {hotelImages.map((image, index) => (
            <button
              key={image}
              type="button"
              className={`carousel-dot${index === activeImageIndex ? " active" : ""}`}
              aria-label={`Show image ${index + 1}`}
              aria-current={index === activeImageIndex ? "true" : undefined}
              onClick={() => setActiveImageIndex(index)}
            />
          ))}
        </div>
      )}
      <section className="hotel-summary">
        <h2>{hotel.name}</h2>
        <p><b>Location:</b> {hotel.location}</p>
        <p><b>Price:</b> {formatPrice(hotel.price)} / night</p>
        <p><b>About:</b> {hotel.description}</p>
      </section>

      <div className="hotel-actions">
        <button
          type="button"
          className="location-button"
          onClick={() => window.open(
            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hotel.name} ${hotel.location}`)}`,
            "_blank",
            "noopener,noreferrer"
          )}
        >
          View Location
        </button>
      </div>

      {bookingDetails ? (
        <section className="booking-confirmation" role="status">
          <h2>Booking Confirmed</h2>
          <p>Your booking is confirmed. Details are shown below.</p>
          <dl>
            <div><dt>Hotel</dt><dd>{bookingDetails.hotelName}</dd></div>
            <div><dt>Location</dt><dd>{bookingDetails.location}</dd></div>
            <div><dt>Guest name</dt><dd>{bookingDetails.name}</dd></div>
            <div><dt>Email</dt><dd>{bookingDetails.email}</dd></div>
            <div><dt>Phone</dt><dd>{bookingDetails.phone}</dd></div>
            <div><dt>Check-in</dt><dd>{bookingDetails.checkIn}</dd></div>
            <div><dt>Check-out</dt><dd>{bookingDetails.checkOut}</dd></div>
            <div><dt>Guests</dt><dd>{bookingDetails.guests}</dd></div>
          </dl>
          <div className="booking-bill-confirmation">
            <h3>Bill estimate</h3>
            <p>
              <span>{formatPrice(bookingDetails.nightlyRate)} × {bookingDetails.nights} nights</span>
              <strong>{formatPrice(bookingDetails.total)}</strong>
            </p>
            <small>Taxes, if applicable, are not included. No payment has been collected.</small>
          </div>
        </section>
      ) : (
        <form className="booking-form" onSubmit={submitBooking}>
          <h2>Book this hotel</h2>
          <div className="booking-fields">
            <label>
              Full name
              <input name="name" value={customer.name} onChange={updateCustomer} autoComplete="name" required />
            </label>
            <label>
              Email address
              <input name="email" type="email" value={customer.email} onChange={updateCustomer} autoComplete="email" required />
            </label>
            <label>
              Phone number
              <input name="phone" type="tel" value={customer.phone} onChange={updateCustomer} autoComplete="tel" required />
            </label>
            <label>
              Check-in
              <input
                name="checkIn"
                type="date"
                min={today}
                value={customer.checkIn}
                onChange={(event) => {
                  const checkIn = event.target.value;
                  setCustomer((currentCustomer) => ({
                    ...currentCustomer,
                    checkIn,
                    checkOut: currentCustomer.checkOut <= checkIn ? "" : currentCustomer.checkOut,
                  }));
                }}
                required
              />
            </label>
            <label>
              Check-out
              <input
                name="checkOut"
                type="date"
                min={customer.checkIn ? getNextDate(customer.checkIn) : getNextDate(today)}
                value={customer.checkOut}
                onChange={updateCustomer}
                required
              />
            </label>
            <label>
              Guests
              <input name="guests" type="number" min="1" max="20" value={customer.guests} onChange={updateCustomer} required />
            </label>
          </div>
          <aside className="booking-billing" aria-live="polite">
            <h3>Estimated bill</h3>
            <div className="booking-billing-line">
              <span>Nightly rate</span>
              <strong>{formatPrice(hotel.price)}</strong>
            </div>
            <div className="booking-billing-line">
              <span>Stay length</span>
              <strong>{stayNights ? `${stayNights} ${stayNights === 1 ? "night" : "nights"}` : "Choose dates"}</strong>
            </div>
            <div className="booking-billing-line booking-billing-total">
              <span>Estimated total</span>
              <strong>{formatPrice(estimatedTotal)}</strong>
            </div>
            <small>Before applicable taxes. No payment is processed.</small>
          </aside>
          <button type="submit">Confirm Booking</button>
        </form>
      )}

      <button className="back-to-hotels" type="button" onClick={() => navigate("/")}>
        Back to Hotels
      </button>
      </section>
    </main>
  );
};

export default HotelDetails;
