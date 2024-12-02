import React, { useState, useEffect } from 'react';

const Orders = ({ currentUsername }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`http://localhost:3300/orders?buyer=${currentUsername}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }
                const data = await response.json();
                setOrders(data); 
            } catch (err) {
                
            } finally {
                setLoading(false); 
            }
        };
        fetchOrders();
    }, [currentUsername]);

    if (loading) {
        return <div>Loading your orders...</div>;
    }

    return (
        <div className="order-view">
        <h2>Your Orders</h2>
            {orders.length === 0 ? (
                <p>You have no orders yet.</p>
            ) : (
                <ul>
                    {orders.map((order) => (
                        <li key={order.id}>
                            <h3>Order ID: {order.id}</h3>
                            <p>Order Date: {new Date(order.date).toLocaleDateString()}</p>
                            <p>Payment Method: {order.paymentMethod}</p>
                            <ul>
                                {order.listings.map((listing) => (
                                    <li key={listing.listingID}>
                                        Listing ID: {listing.listingID}, Quantity: {listing.quantity}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Orders;