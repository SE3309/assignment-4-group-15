import React from 'react';
import { Link } from 'react-router-dom';

const Start = () => {
  return (
    <div className="start-page">
        <h2>Welcome to Smelly Spaghetti Marketplace!</h2>
        <div className="buttons">
            <Link to="/login">
                <button>Login</button>
            </Link>
            <Link to="/register">
                <button>Register</button>
            </Link>
        </div>
    </div>
  );
};

export default Start;
