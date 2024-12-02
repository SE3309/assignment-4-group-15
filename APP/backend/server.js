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
    password: 'ps', //CHANGE
    database: 'mydatabase' //CHANGE
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

  // get monthly revenue for a seller
app.post('/revenue', (req, res) => {
  const { sellerID, month, year } = req.body;

  if (!sellerID || !month || !year) {
    return res.status(400).json({ error: 'Seller ID, month, and year are required' });
  }

  db.query(`
    SELECT
      SUM(ol.quantity * l.price) AS revenue
    FROM
      Orders o
    JOIN
      OrderListing ol ON o.orderID = ol.orderID
    JOIN
      Listing l ON ol.listingID = l.listingID
    WHERE
      l.seller = ?
      AND MONTH(o.date) = ?
      AND YEAR(o.date) = ?;
  `, [sellerID, month, year], (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'Query failed' });
      }

      const revenue = results[0].revenue || 0;
      return res.json({ revenue });
  });
})


app.get('/categories', (req, res) => {
  db.query('SELECT categoryID, name FROM Category', (error, results) => {
    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ message: 'Database error', error });
    }
    res.status(200).json(results);
  });
});


app.post('/addresses', async (req, res) => {
  const { streetAddress, city, state, postalCode, country } = req.body;

  // Validate required fields
  if (!streetAddress || !city || !country) {
      return res.status(400).json({ message: 'streetAddress, city, and country are required.' });
  }

  try {
      const dbPromise = db.promise();

      const [rows] = await dbPromise.query(
          `
          SELECT addressID 
          FROM Address 
          WHERE streetAddress = ? AND city = ? AND state <=> ? AND postalCode <=> ? AND country = ?
          `,
          [streetAddress, city, state || null, postalCode || null, country]
      );

      if (rows.length > 0) {
          return res.status(200).json({ addressID: rows[0].addressID });
      }

      const [result] = await dbPromise.query(
          `
          INSERT INTO Address (streetAddress, city, state, postalCode, country)
          VALUES (?, ?, ?, ?, ?)
          `,
          [streetAddress, city, state || null, postalCode || null, country]
      );

      // Return the new address ID
      res.status(201).json({ addressID: result.insertId });
  } catch (error) {
      console.error('Error handling /addresses request:', error);
      res.status(500).json({ message: 'Internal server error', error });
  }
});


  // Add a new listing
app.post('/add-listing', (req, res) => {
  const { seller, categoryID, price, description, addressID, images } = req.body;

  if (!seller || !categoryID || !price || !description) {
      return res.status(400).json({ message: "Required fields are missing or invalid." });
  }

  if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({ message: "Price must be a positive number." });
  }

  db.query(
      `INSERT INTO Listing (seller, categoryID, price, description, addressID, images) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [seller, categoryID, price, description, addressID || null, images || null],
      (error, result) => {
          if (error) {
              console.error("Database error:", error);
              return res.status(500).json({ message: "Database error", error });
          }
          res.status(201).json({ message: "Listing added successfully", listingID: result.insertId });
      }
  );
});

app.listen(3300, () =>{
    console.log("Server started on Port 3300");
})