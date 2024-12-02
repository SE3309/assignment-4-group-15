import React, { useState } from "react";
import axios from "axios";

function SearchPriceRange() {
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!minPrice || !maxPrice) {
            alert("Please enter both minimum and maximum price.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get("http://localhost:3300/listings", {
                params: { minPrice, maxPrice },
            });
            setSearchResults(response.data);
        } catch (error) {
            console.error(error);
            alert("An error occurred while fetching listings.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div
                style={{
                    marginTop: "2rem",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "1rem",
                    backgroundColor: "#2563eb",
                    padding: "1rem",
                    borderRadius: "10px",
                }}
            >
                <input
                    type="number"
                    placeholder="Min Price"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Max Price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                />
                <button onClick={handleSearch} disabled={loading}>
                    {loading ? "Searching..." : "Search"}
                </button>
            </div>

            <div>
                {searchResults.length > 0 ? (
                    searchResults.map((result) => (
                        <div 
                            style={
                                {backgroundColor: "#2563eb",
                                padding: "2vh",
                                margin: "2vh",
                                color: "white",
                                }
                                
                            }
                        
                            key={result.listingID}>
                            <h3>{result.seller}</h3>
                            <p>{result.description}</p>
                            <p>${result.price}</p>
                        </div>
                    ))
                ) : (
                    <p>No results found for the specified price range.</p>
                )}
            </div>
        </div>
    );
}

export default SearchPriceRange;
