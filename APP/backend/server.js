const express = require('express');
const cors = require('cors');
const db = require('./db.js');

const app = express();
app.use(express.json());
app.use(cors());


app.listen(3000, () =>{
    console.log("Server started on Port 3000");
})