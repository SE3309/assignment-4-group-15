import React, { useState, useEffect } from 'react';

function CreateListing() {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryID, setSelectedCategoryID] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageLink, setImageLink] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3300/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          console.error('Failed to fetch categories.');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const fetchOrCreateAddressID = async () => {
    try {
      const address = { streetAddress, city, state, postalCode, country };

      const response = await fetch('http://localhost:3300/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(address),
      });

      if (response.ok) {
        const { addressID } = await response.json();
        return addressID;
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Error fetching/creating address:', error);
      throw error;
    }
  };

  const addListing = async () => {
    const userID = localStorage.getItem('loginUserID'); // Retrieve logged-in user's ID
    if (!userID) {
      alert('User not logged in.');
      return;
    }

    try {
      const addressID = await fetchOrCreateAddressID();

      const newListing = {
        seller: userID,
        categoryID: parseInt(selectedCategoryID, 10),
        addressID,
        price: parseFloat(price),
        description,
        images: imageLink || null,
      };

      const response = await fetch('http://localhost:3300/add-listing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newListing),
      });

      if (response.ok) {
        alert('Listing added successfully!');
        setSelectedCategoryID('');
        setStreetAddress('');
        setCity('');
        setState('');
        setPostalCode('');
        setCountry('');
        setPrice('');
        setDescription('');
        setImageLink('');
      } else {
        const error = await response.json();
        alert(`Failed to add listing: ${error.message}`);
      }
    } catch (error) {
      alert('An error occurred while adding the listing.');
    }
  };

  return (
<div>
  <h1>Add New Listing</h1>
  <div
    style={{
      backgroundColor: '#3b82f6',
      padding: '5vh',
      borderRadius: '10px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}
  >
    {/* Category and Price - side by side */}
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        gap: '10px',
        marginBottom: '15px',
      }}
    >
      <select
        value={selectedCategoryID}
        onChange={(e) => setSelectedCategoryID(e.target.value)}
        style={{
          flex: '1',
          padding: '10px',
          borderRadius: '5px',
        }}
      >
        <option value="">Select Category</option>
        {categories.map((category) => (
          <option key={category.categoryID} value={category.categoryID}>
            {category.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Price"
        style={{
          flex: '1',
          padding: '10px',
          borderRadius: '5px',
        }}
      />
    </div>

    {/* Address fields - grid layout */}
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '10px',
        width: '100%',
        marginBottom: '15px',
      }}
    >
      <input
        type="text"
        value={streetAddress}
        onChange={(e) => setStreetAddress(e.target.value)}
        placeholder="Street Address"
        style={{
          padding: '8px',
          borderRadius: '5px',
        }}
      />
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="City"
        style={{
          padding: '8px',
          borderRadius: '5px',
        }}
      />
      <input
        type="text"
        value={state}
        onChange={(e) => setState(e.target.value)}
        placeholder="State"
        style={{
          padding: '8px',
          borderRadius: '5px',
        }}
      />
      <input
        type="text"
        value={postalCode}
        onChange={(e) => setPostalCode(e.target.value)}
        placeholder="Postal Code"
        style={{
          padding: '8px',
          borderRadius: '5px',
        }}
      />
      <input
        type="text"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        placeholder="Country"
        style={{
          padding: '8px',
          borderRadius: '5px',
        }}
      />
    </div>

    {/* Description and Image Link */}
    <textarea
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      placeholder="Description"
      style={{
        width: '100%',
        height: '100px',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '15px',
      }}
    />
    <textarea
      value={imageLink}
      onChange={(e) => setImageLink(e.target.value)}
      placeholder="Image Link"
      style={{
        width: '100%',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '15px',
      }}
    />

    {/* Add Listing Button */}
    <button
      onClick={addListing}
      style={{
        padding: '10px 20px',
        borderRadius: '5px',
        backgroundColor: 'white',
        color: '#2563eb',
        border: 'none',
        cursor: 'pointer',
      }}
    >
      Add Listing
    </button>
  </div>
</div>

  );
}

export default CreateListing;


