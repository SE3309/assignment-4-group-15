import React, { useState } from 'react';
import axios from 'axios';

const CreateOrder = () => {
    const [listings, setListings] = useState([]); // Set the selected listings
    const [paymentMethod, setPaymentMethod] = useState('');
    const [originAddress, setOriginAddress] = useState('');
    const [originAddressID, setOriginAddressID] = useState(null);
    const [destinationAddress, setDestinationAddress] = useState('');
    const [destinationAddressID, setDestinationAddressID] = useState(null);

    const handleGetOriginAddressID = async () => {
        try {
            const response = await axios.post('http://localhost:3300/get-address-id', { address: originAddress });
            setOriginAddressID(response.data.addressID);
            alert(response.data.message);
        } catch (error) {
            console.error("Error getting origin address ID:", error);
            alert("Failed to get origin address ID.");
        }
    };

    const handleGetDestinationAddressID = async () => {
        try {
            const response = await axios.post('http://localhost:3300/get-address-id', { address: destinationAddress });
            setDestinationAddressID(response.data.addressID);
            alert(response.data.message);
        } catch (error) {
            console.error("Error getting destination address ID:", error);
            alert("Failed to get destination address ID.");
        }
    };

    const handleCreateOrder = async () => {
        try {
            const response = await axios.post('http://localhost:3300/create-order', {
                buyer: localStorage.getItem('currentUsername'),
                listings,
                paymentMethod,
                shippingDetails: {
                    origin: originAddressID,
                    destination: destinationAddressID
                }
            });
            alert(response.data.message);
        } catch (error) {
            console.error("Error creating order:", error);
            alert("Failed to create order.");
        }
    };

    return (
        <div>
            <h1>Create Order</h1>
            <h2>Origin Address</h2>
            <input
                type="text"
                placeholder="Enter origin address"
                value={originAddress}
                onChange={(e) => setOriginAddress(e.target.value)}
            />
            <button onClick={handleGetOriginAddressID}>Get Origin Address ID</button>
            <h2>Destination Address</h2>
            <input
                type="text"
                placeholder="Enter destination address"
                value={destinationAddress}
                onChange={(e) => setDestinationAddress(e.target.value)}
            />
            <button onClick={handleGetDestinationAddressID}>Get Destination Address ID</button>
            <button onClick={handleCreateOrder}>Create Order</button>
        </div>
    );
};

export default CreateOrder;