import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';


const TopListings = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [topListings, setTopListings] = useState([]);

    //Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const resp = await fetch("http://localhost:3300/categories");
                const data = await resp.json();
                console.log("Categories:", data);
                setCategories(data);
            } catch (error) {
                console.log("Categories error: ", error);
            }
        };
        fetchCategories();
    }, []);

    const handleCategoryChange = (e) => {
        console.log("selected: ", e.target.value);
        setSelectedCategory(e.target.value);
    }

    //Fetch listings
    const fetchTopListings = async () => {
        if (!selectedCategory) {
            alert("Please select a category");
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:3300/top-listings/${selectedCategory}`);
            const data = await response.json();
            setTopListings(data);
            } catch (error) {
                console.log("Error with top listings: ", error);
            }

        }
    
    


        return (
            <div className="App">
                <div className="Top">
                    <h1>Our Top Picks</h1>
                    <div>
                        <label htmlFor="category-select">Choose a Category:</label>
                        <select
                            id="category-select"
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                        >
                        <option value="">Select a Category</option>
                            {categories.map((category) => (
                        <option key={category.categoryID} value={category.categoryID}>
                            {category.name}
                        </option>
                        ))}
                        </select>
                        <button onClick={fetchTopListings}>Select</button>
                    </div>
    
                    <div className="gallery">
                        {topListings.length > 0 ? (
                            topListings.map((listing) => (
                                <div key={listing.listingID} className="listing-card">
                                    <h3>Listing ID: {listing.listingID}</h3>
                                    <p>Seller: {listing.userID}</p>
                                    <p>Price: ${listing.price}</p>
                                    <p>Average Rating: {listing.avgRating}</p>
                                    <break></break>
                                </div>
                            ))
                        ) : (
                            <p>No listings available for this category</p>
                        )}
                    </div>
                </div>
            </div>
        );
    };

  export default TopListings;