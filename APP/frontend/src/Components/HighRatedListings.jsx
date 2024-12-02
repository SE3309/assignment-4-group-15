import React, { useState, useEffect } from "react";

const HighRatedListings = () => {
    const [listings, setListings] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchListings(page);
    }, [page]);

    const fetchListings = async (page) => {
        setLoading(true);
        try {
            const response = await fetch(
                `http://localhost:3300/listings/high-rated?page=${page}`
            );
            const data = await response.json();
            setListings(data);
        } catch (error) {
            console.error("Error fetching listings:", error);
        }
        setLoading(false);
    };

    const handleNext = () => {
        setPage((prevPage) => prevPage + 1);
        scrollToTop();
    };

    const handlePrevious = () => {
        if (page > 1) {
            setPage((prevPage) => prevPage - 1);
            scrollToTop(); // Ensure this is called
        }
    };
    

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const renderButtons = () => (
        <div>
            <button
                onClick={handlePrevious}
                disabled={page === 1}
                style={{
                    margin: "10px",
                    padding: "10px 20px",
                    border: "none",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "1rem",
                }}
            >
                Previous
            </button>
            <button
                onClick={handleNext}
                disabled={listings.length < 10}
                style={{
                    margin: "10px",
                    padding: "10px 20px",
                    border: "none",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "1rem",
                }}
            >
                Next
            </button>
        </div>
    );

    return (
        <div
            style={{
                textAlign: "center",
                padding: "20px",
                fontFamily: "Arial, sans-serif",
                backgroundColor: "#121212",
                color: "#ffffff",
                minHeight: "100vh",
            }}
        >
            <h1 style={{ fontSize: "2rem", marginBottom: "20px" }}>High Rated Listings</h1>

            {/* Buttons at the top */}
            {renderButtons()}

            {loading && <p>Loading...</p>}
            <ul style={{ listStyleType: "none", padding: 0 }}>
                {listings.map((listing) => (
                    <li
                        key={listing.listingID}
                        style={{
                            border: "1px solid #333",
                            margin: "10px auto",
                            padding: "15px",
                            width: "60%",
                            borderRadius: "8px",
                            backgroundColor: "#1e1e1e",
                            textAlign: "left",
                            fontSize: "1.1rem",
                            lineHeight: "1.5",
                        }}
                    >
                        <h3
                            style={{
                                fontSize: "1.5rem",
                                marginBottom: "10px",
                                color: "#f0f0f0",
                            }}
                        >
                            {listing.description}
                        </h3>
                        <p>
                            <strong>Seller:</strong> {listing.seller}
                        </p>
                        <p>
                            <strong>Price:</strong> $
                            {listing.price && !isNaN(listing.price)
                                ? parseFloat(listing.price).toFixed(2)
                                : "N/A"}
                        </p>
                        <p>
                            <strong>Average Rating:</strong>{" "}
                            {listing.avgRating && !isNaN(listing.avgRating)
                                ? parseFloat(listing.avgRating).toFixed(2)
                                : "N/A"}{" "}
                            ⭐
                        </p>
                    </li>
                ))}
            </ul>

            {/* Buttons at the bottom */}
            {renderButtons()}
        </div>
    );
};

export default HighRatedListings;
