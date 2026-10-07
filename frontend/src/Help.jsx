import React from "react";
import "./help.css";

const Help = () => (
  <main className="help-page">
    <div className="help-content">
      <header className="help-heading">
        <span className="help-eyebrow">SAFELY GUIDE</span>
        <h1>Help &amp; Support</h1>
        <p>
          Find guidance for searching hotels, managing listings, and booking
          your stay.
        </p>
      </header>

      <section className="help-intro" aria-labelledby="getting-started">
        <h2 id="getting-started">Getting Started</h2>
        <p>
          Browse available hotels or search by name. Use the minimum and maximum
          amount filters to find stays within your budget. Select <strong>View
          Details</strong> on a hotel to see more information and continue to
          booking.
        </p>
      </section>

      <div className="help-grid">
        <section className="help-card">
          <span className="help-card-number">01</span>
          <h2>Add Hotel</h2>
          <p>
            Enter the hotel name, description, price, latitude, longitude, and
            hotel image. Select <strong>Add Hotel</strong> to save the new
            listing.
          </p>
        </section>

        <section className="help-card">
          <span className="help-card-number">02</span>
          <h2>Edit Hotel</h2>
          <p>
            Choose a hotel from the <strong>Edit Hotel</strong> section, update
            its details or image, then select <strong>Update Hotel</strong> to
            save your changes.
          </p>
        </section>

        <section className="help-card">
          <span className="help-card-number">03</span>
          <h2>Delete Hotel</h2>
          <p>
            Select <strong>Delete</strong> for the hotel you want to remove.
            Confirm the prompt to remove it from the hotel list.
          </p>
        </section>

        <section className="help-card">
          <span className="help-card-number">04</span>
          <h2>Search and Filter</h2>
          <p>
            Search by hotel name, enter a minimum and maximum price, and select
            <strong> Apply Filter</strong> to see matching hotels.
          </p>
        </section>

        <section className="help-card">
          <span className="help-card-number">05</span>
          <h2>Hotel Details</h2>
          <p>
            View the selected hotel's image, name, description, price, and
            location. Select <strong>Confirm Booking</strong> to continue with
            the booking process.
          </p>
        </section>

        <section className="help-card">
          <span className="help-card-number">06</span>
          <h2>Booking Help</h2>
          <p>
            After selecting <strong>Confirm Booking</strong>, provide the
            requested personal details, review your booking information, and
            confirm when everything is correct.
          </p>
        </section>
      </div>

      <section className="help-bottom">
        <div className="help-faq">
          <h2>Frequently Asked Questions</h2>
          <details>
            <summary>How do I find hotels within my budget?</summary>
            <p>
              Enter the minimum and maximum amounts in Search and Filter, then
              select Apply Filter.
            </p>
          </details>
          <details>
            <summary>Can I update or remove a hotel later?</summary>
            <p>
              Yes. Use Edit Hotel to update a listing, or Delete hotels to
              remove it after confirming the prompt.
            </p>
          </details>
          <details>
            <summary>Where can I see the full information for a hotel?</summary>
            <p>
              Select View Details on a hotel to see its details and booking
              option.
            </p>
          </details>
        </div>

        <aside className="help-contact">
          <span className="help-eyebrow">NEED MORE HELP?</span>
          <h2>Contact Support</h2>
          <p>
            If you need help beyond this guide, email our support team at{" "}
            <a href="mailto:support@hotelmanagement.com">
              support@hotelmanagement.com
            </a>
            .
          </p>
        </aside>
      </section>
    </div>
  </main>
);

export default Help;
