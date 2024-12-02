import { useState } from 'react';
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

function App() {
  const [count, setCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUsername, setCurrentUsername] = useState('');

  return (
    <Router>
      {
      <div className="top">
        <span>{isLoggedIn ? `Hello, ${currentUsername}` : 'Not Logged In'}</span>
        {isLoggedIn && (
          <Link to="/revenue">
            <button>View My Monthly Revenue</button>
          </Link>
        )}
      </div>
     }

      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Login" element={<Login setIsLoggedIn={setIsLoggedIn} setCurrentUsername={setCurrentUsername} />} />
        <Route path="/TopListings" element={<TopListings />} />
        <Route path="/Revenue" element={<Revenue isLoggedIn={isLoggedIn} currentUsername={currentUsername} />} />
        <Route path='/CreateListing' element={<CreateListing />} />
        <Route path='/SearchPriceRange' element={<SearchPriceRange />} />
      </Routes>
    </Router>
  );
}

export default App;

