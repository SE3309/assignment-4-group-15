import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';

const app = express();
app.use(express.json());
app.use(cors());

//Change accordingly
const db = mysql.createConnection({
    host: '127.0.0.1', //Or localhost
    port: 3306,
    user: 'root',
    password: '46319432Harry', //CHANGE
    database: 'marketplace' //CHANGE
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

//login user 
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
          res.status(200).json({ message: "Login successful", user: result[0] });
        } else {
          res.status(401).json({ message: "Wrong username or password" });
        }
      }
    );
  });

  //Import categories
  app.get('/categories', (req, res) => {
    db.query("SELECT categoryID, name FROM category", (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).json({message: "database error", error});
      }
      res.status(200).json(results);
    })
  })

  //Fetch top 5 highest rated listings for a category
  app.get("/top-listings/:categoryID", (req, res) => {
    const { categoryID } = req.params;
    console.log("Received request for category:", categoryID);
    db.query(
    `
    SELECT
      l.listingID,
      l.seller AS userID,
      l.price,
      AVG(r.rating) AS avgRating
    FROM 
      Listing l
    JOIN 
      review r ON l.listingID = r.listingID
    WHERE 
      l.categoryID = ?
    GROUP BY
      l.listingID
    ORDER BY
      avgRating DESC 
    LIMIT 5
    `,
    [categoryID],
    (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Database error", error });
      }
      res.status(200).json(results);
      console.log("hi");
      }
    );
  });

app.listen(3300, () =>{
    console.log("Server started on Port 3300");
})