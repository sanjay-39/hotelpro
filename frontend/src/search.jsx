import { useState } from "react";
import "./search.css";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "./api";

const HOTELS_PER_PAGE = 3;

const Search = ({ hotels }) => {
  const navigate = useNavigate();
  const [searchName, setSearchName] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [currentPage, setCurrentPage] = useState(1);

  const filteredHotels = (hotels || []).filter((hotel) =>
    hotel.name.toLowerCase().includes(searchName.toLowerCase())
    && (priceRange.min === "" || hotel.price >= Number(priceRange.min))
    && (priceRange.max === "" || hotel.price <= Number(priceRange.max))
  );
  const pageCount = Math.ceil(filteredHotels.length / HOTELS_PER_PAGE);
  const visibleHotels = filteredHotels.slice(
    (currentPage - 1) * HOTELS_PER_PAGE,
    currentPage * HOTELS_PER_PAGE
  );

  const applyFilters = (event) => {
    event.preventDefault();
    setPriceRange({ min: minAmount, max: maxAmount });
    setCurrentPage(1);
  };

  return (
    <main className="search-page">
      <div className="search-section">
        <div className="search-title">
          <p className="search-eyebrow">DISCOVER <span aria-hidden="true">•</span> STAY <span aria-hidden="true">•</span> EXPERIENCE</p>
          <h1>Your Stay, Your Way</h1>
          <p className="search-description">
            Explore handpicked hotels, compare prices, and find a comfortable stay that fits your needs.
          </p>
        </div>

        <form className="search-bar" onSubmit={applyFilters}>
          <label className="search-field search-name-field">
            <span className="search-field-label">Destination</span>
            <span className="search-input-wrap">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="10.8" cy="10.8" r="6.8" />
                <path d="m16 16 4.3 4.3" />
              </svg>
              <input
                type="search"
                placeholder="Where do you want to stay?"
                value={searchName}
                onChange={(event) => {
                  setSearchName(event.target.value);
                  setCurrentPage(1);
                }}
              />
            </span>
            <span className="search-helper">Search by hotel name or location</span>
          </label>

          <label className="search-field">
            <span className="search-field-label">Min Price</span>
            <input
              type="number"
              min="0"
              step="100"
              placeholder="₹ 0"
              value={minAmount}
              onChange={(event) => setMinAmount(event.target.value)}
            />
          </label>

          <label className="search-field">
            <span className="search-field-label">Max Price</span>
            <input
              type="number"
              min={minAmount || "0"}
              step="100"
              placeholder="No limit"
              value={maxAmount}
              onChange={(event) => setMaxAmount(event.target.value)}
            />
          </label>

          <button className="search-button" type="submit">Explore Hotels</button>
        </form>
      </div>

      <div className="card-list">
        {visibleHotels.map((hotel) => (
          <div className="card" key={hotel.id}>
            <img src={getImageUrl(hotel.image)} alt={hotel.name} />

            <h2>{hotel.name}</h2>
            <p>{hotel.location}</p>
            <p className="card-description">{hotel.description}</p>
            <p className="card-price">
              ₹{Number(hotel.price).toLocaleString("en-IN")} / night
            </p>

            <div className="card-actions">
              <button
                type="button"
                onClick={() => navigate(`/hotel/${hotel.id}`)}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
        {filteredHotels.length === 0 && (
          <p className="empty-results">No hotels match your search.</p>
        )}
      </div>

      {pageCount > 1 && (
        <nav className="pagination" aria-label="Hotel results pages">
          <button
            type="button"
            aria-label="Previous page"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((page) => page - 1)}
          >
            ‹
          </button>
          {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
            <button
              type="button"
              key={page}
              className={page === currentPage ? "active" : ""}
              aria-current={page === currentPage ? "page" : undefined}
              aria-label={`Page ${page}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
          <button
            type="button"
            aria-label="Next page"
            disabled={currentPage === pageCount}
            onClick={() => setCurrentPage((page) => page + 1)}
          >
            ›
          </button>
        </nav>
      )}
    </main>
  );
};

export default Search;