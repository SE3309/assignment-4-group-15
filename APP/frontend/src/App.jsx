import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import Register from './Components/Register'; //Register
import Login from './Components/Login'; //Login
import Start from './Components/Start'; //Start Page
import TopListings from './Components/TopListings'; //Top listings

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      {/* <div>
        <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <h1>Vite + React</h1>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.jsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </div> */}

      {/* Routes*/}
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/TopListings" element={<TopListings />} />
      </Routes>
    </Router>
  );
}

export default App;

