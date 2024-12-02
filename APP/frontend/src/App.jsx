import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import Register from './Components/Register'; //Register
import Login from './Components/Login'; //Login
import Start from './Components/Start'; //Start Page
import TopListings from './Components/TopListings'; //Top listings
import Revenue from './Components/Revenue';
import CreateListing from './Components/CreateListing';
import SearchPriceRange from './Components/SearchPriceRange';
import HighRatedListings from "./Components/HighRatedListings";
import CreateOrder from './Components/CreateOrder';

function App() {
  const [count, setCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUsername, setCurrentUsername] = useState('');

  useEffect(() => {
    const username = localStorage.getItem('currentUsername');
    if (username && username !== '') {
      setCurrentUsername(username);
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      <div className="top">
        <span>{isLoggedIn ? `Hello, ${currentUsername}` : 'Not Logged In'}</span>
        <div>
          {/* Buttons visible only to logged-in users */}
          {isLoggedIn && (
            <>
              <Link to="/Revenue">
                <button>View My Monthly Revenue</button>
              </Link>
              <Link to="/HighRatedListings">
                <button>View Top Items</button>
              </Link>
              <Link to="/CreateOrder">
              <button>Create Order</button>
            </Link>
              <button
                onClick={() => {
                  localStorage.removeItem('currentUsername');
                  setIsLoggedIn(false);
                  setCurrentUsername('');
                }}
              >
                Log Out
              </button>
            </>
          )}
        </div>
      </div>


      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Login" element={<Login setIsLoggedIn={setIsLoggedIn} setCurrentUsername={setCurrentUsername} />} />
        <Route path="/TopListings" element={<TopListings />} />
        <Route path="/Revenue" element={<Revenue isLoggedIn={isLoggedIn} currentUsername={currentUsername} />} />
        <Route path='/CreateListing' element={<CreateListing />} />
        <Route path='/SearchPriceRange' element={<SearchPriceRange />} />
        <Route path="/HighRatedListings" element={<HighRatedListings />} />
        <Route path="/CreateOrder" element={<CreateOrder />} />
      </Routes>
    </Router>
  );
}

export default App;

