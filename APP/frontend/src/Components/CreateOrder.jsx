import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateOrder = () => {
    const [listings, setListings] = useState([]);
    const [selectedListings, setSelectedListings] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [destinationAddress, setDestinationAddress] = useState('');
    const [destinationCity, setDestinationCity] = useState('');
    const [destinationState, setDestinationState] = useState('');
    const [destinationPostalCode, setDestinationPostalCode] = useState('');
    const [destinationCountry, setDestinationCountry] = useState('');
    const [destinationAddressID, setDestinationAddressID] = useState(null);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const response = await axios.get('http://localhost:3300/listings/high-rated');
                setListings(response.data);
            } catch (error) {
                console.error('Error fetching listings:', error);
                alert('Failed to fetch listings.');
            }
        };
        fetchListings();
    }, []); 

    const handleGetDestinationAddressID = async () => {
        try {
            const response = await axios.post('http://localhost:3300/get-address-id', {
                streetAddress: destinationAddress,
                city: destinationCity,
                state: destinationState,
                postalCode: destinationPostalCode,
                country: destinationCountry
            });
            setDestinationAddressID(response.data.addressID);
            alert(response.data.message);
        } catch (error) {
            console.error("Error getting destination address ID:", error);
            alert("Failed to get destination address ID.");
        }
    };

    const myListings = selectedListings.map(listingID => ({
        listingID: listingID,
        quantity: 1
    }));

    const handleCreateOrder = async () => {
        try {
            await handleGetDestinationAddressID();
            const response = await axios.post('http://localhost:3300/create-order', {
                buyer: localStorage.getItem('currentUsername'),
                listings: myListings,
                paymentMethod: {
                    paymentMethod: paymentMethod
                },
                shippingDetails: {
                    origin: selectedListings[0].addressID || 1,
                    destination: destinationAddressID || 1,
                }
            });
            alert(response.data.message);
        } catch (error) {
            console.error("Error creating order:", error);
            alert("Failed to create order.");
        }
    };

    const handleSelectListing = (listingID) => {
        setSelectedListings(prevSelected => {
            if (prevSelected.includes(listingID)) {
                return prevSelected.filter(id => id !== listingID);
            } else {
                return [...prevSelected, listingID];
            }
        });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ width: '40%', padding: '10px', borderRight: '2px solid #ddd' }}>
                <h2>High-Rated Listings</h2>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {listings.map(listing => (
                        <li key={listing.listingID} style={{ marginBottom: '10px' }}>
                            <input
                                type="checkbox"
                                checked={selectedListings.includes(listing.listingID)}
                                onChange={() => handleSelectListing(listing.listingID)}
                            />
                            <span>{listing.description} - ${listing.price} - Rating: {listing.avgRating}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div style={{ width: '60%', padding: '10px' }}>
                <h1>Create Order</h1>
                <h2>Destination Address</h2>
                <input
                    type="text"
                    placeholder="Enter destination street address"
                    value={destinationAddress}
                    onChange={(e) => setDestinationAddress(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Enter destination city"
                    value={destinationCity}
                    onChange={(e) => setDestinationCity(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Enter destination state"
                    value={destinationState}
                    onChange={(e) => setDestinationState(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Enter destination postal code"
                    value={destinationPostalCode}
                    onChange={(e) => setDestinationPostalCode(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Enter destination country"
                    value={destinationCountry}
                    onChange={(e) => setDestinationCountry(e.target.value)}
                />
                <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                >
                    <option value="">Select payment method</option>
                    <option value="paypal">PayPal</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="credit_card">Credit Card</option>
                </select>
                <button onClick={handleCreateOrder}>Create Order</button>
            </div>
        </div>
    );
};

export default CreateOrder;