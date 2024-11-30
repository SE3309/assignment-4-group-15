import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';

const express = require('express');
const cors = require('cors');
const db = require('./db.js');

const app = express();
app.use(express.json());
app.use(cors());

//Change accordingly
const db = mysql.createConnection({
    host: '127.0.0.1', //Or localhost
    port: 3306,
    user: 'root',
    password: '46319432Harry', //CHANGE
    database: 'project' //CHANGE
})
db.connect((e) => {
    if (e) {
        console.log("Error: " + e.message);
    }
    console.log('Connected to MySQL');
})

//register user
app.post('/register', (req, res) => {
    const { username, displayName, password, role, phoneNo, email } = req.body;

    db.query(
        "INSERT INTO user (userID, displayName, password, role, phoneNo, email) VALUES (?, ?, ?, ?, ?, ?)",
        [username, displayName, password, role, phoneNo, email],
        (error, result) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: "Database error", error });
            }
            res.status(201).json({ message: "User registered successfully" });
        }
    );
});

// login user 
app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    db.query(
      "SELECT * FROM user WHERE userID = ? AND password = ?",
      [username, password],
      (error, result) => {
        if (error) {
          console.log(error);
          return res.status(500).json({ message: "Database error", error });
        }
        
        if (result.length > 0) {
          // Send a success response with the user details (or just a message/token)
          res.status(200).json({ message: "Login successful", user: result[0] });
        } else {
          // Wrong username or password
          res.status(401).json({ message: "Wrong username or password" });
        }
      }
    );
  });

app.listen(3000, () =>{
    console.log("Server started on Port 3300");
})