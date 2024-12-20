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
    password: '6x7VuxRQCAlF9DZ4', //CHANGE
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

//Endpoint to search by price range
app.get('/listings', (req, res) => {
  const { minPrice, maxPrice } = req.query;

  // Validate input
  if (!minPrice || !maxPrice || isNaN(minPrice) || isNaN(maxPrice)) {
      return res.status(400).json({ error: "Valid minPrice and maxPrice are required." });
  }

  const query = `SELECT listingID, seller, price, description FROM Listing WHERE price BETWEEN ? AND ?`;
  const params = [parseFloat(minPrice), parseFloat(maxPrice)];

  db.query(query, params, (err, results) => {
      if (err) {
          console.error("Error executing query:", err);
          return res.status(500).json({ error: "An error occurred while fetching listings." });
      }

      res.status(200).json(results);
  });
});

//endpoint to view items with high ratings
app.get('/listings/high-rated', (req, res) => {
  const { page = 1 } = req.query; // Default to page 1 if not provided
  const limit = 10; // 10 listings per page
  const offset = (page - 1) * limit;

  const query = `
      SELECT 
          l.listingID, l.seller, l.categoryID, l.price, l.description, l.images, 
          AVG(r.rating) AS avgRating 
      FROM 
          Listing l
      JOIN 
          Review r ON l.listingID = r.listingID
      GROUP BY 
          l.listingID
      HAVING 
          avgRating > 3
      ORDER BY 
          avgRating DESC
      LIMIT ? OFFSET ?;
  `;

  db.query(query, [limit, offset], (err, results) => {
      if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database query failed' });
      }

      res.status(200).json(results);
  });
});


app.listen(3300, () =>{
    console.log("Server started on Port 3300");
})

// Backend code
app.post('/get-address-id', (req, res) => {
  const { streetAddress, city, state, postalCode, country } = req.body;

  // Check if the address exists in the database
  db.query(
    "SELECT addressID FROM Address WHERE streetAddress = ? AND city = ? AND state = ? AND postalCode = ? AND country = ?",
    [streetAddress, city, state, postalCode, country],
    (error, result) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: "Error getting address ID", error });
      }

      if (result.length === 0) {
        // If the address doesn't exist, create a new one
        db.query(
          "INSERT INTO Address (streetAddress, city, state, postalCode, country) VALUES (?, ?, ?, ?, ?)",
          [streetAddress, city, state, postalCode, country],
          (error, result) => {
            if (error) {
              console.error(error);
              return res.status(500).json({ message: "Error creating address", error });
            }

            const addressID = result.insertId;
            res.status(200).json({ message: "Address ID retrieved successfully", addressID });
          }
        );
      } else {
        const addressID = result[0].id;
        res.status(200).json({ message: "Address ID retrieved successfully", addressID });
      }
    }
  );
});

// Create an order
app.post('/create-order', (req, res) => {
  const { buyer, listings, paymentMethod, shippingDetails } = req.body;

  // Start a transaction
  db.beginTransaction((err) => {
    if (err) return res.status(500).json({ message: "Transaction error", err });

    // Insert into Orders table
    db.query(
      "INSERT INTO Orders (buyer, date) VALUES (?, NOW())",
      [buyer],
      (error, result) => {
        if (error) {
          return db.rollback(() => {
            console.log(error);
            res.status(500).json({ message: "Database error", error });
          });
        }

        const orderID = result.insertId;

        // Insert into OrderListing table
        const orderListingQueries = listings.map(listing => {
          return new Promise((resolve, reject) => {
            db.query(
              "INSERT INTO OrderListing (orderID, listingID, quantity) VALUES (?, ?, ?)",
              [orderID, listing.listingID, listing.quantity],
              (error) => {
                if (error) return reject(error);
                resolve();
              }
            );
          });
        });

        Promise.all(orderListingQueries)
          .then(() => {
            // Insert into Payment table
            db.query(
              "INSERT INTO Payment (orderID, paymentMethod, status) VALUES (?, ?, ?)",
              [orderID, paymentMethod.paymentMethod, 'completed'],
              (error) => {
                if (error) {
                  return db.rollback(() => {
                    console.log(error);
                    res.status(500).json({ message: "Database error", error });
                  });
                }

                // Insert into Shipping table
                db.query(
                  "INSERT INTO Shipping (orderID, origin, destination, status) VALUES (?, ?, ?, ?)",
                  [orderID, shippingDetails.origin, shippingDetails.destination, 'pending'],
                  (error) => {
                    if (error) {
                      return db.rollback(() => {
                        console.log(error);
                        res.status(500).json({ message: "Database error", error });
                      });
                    }

                    // Commit the transaction
                    db.commit((err) => {
                      if (err) {
                        return db.rollback(() => {
                          console.log(err);
                          res.status(500).json({ message: "Transaction commit error", err });
                        });
                      }
                      res.status(201).json({ message: "Order created successfully", orderID });
                    });
                  }
                );
              }
            );
          })
          .catch(error => {
            db.rollback(() => {
              console.log(error);
              res.status(500).json({ message: "Database error", error });
            });
          });
      }
    );
  });
});

app.get('/orders', (req, res) => {
  const { buyer } = req.query; 

  if (!buyer) {
      return res.status(400).json({ message: 'Buyer is required' });
  }

  const query = `
      SELECT 
          o.orderID, 
          o.date, 
          p.paymentMethod, 
          p.status AS paymentStatus, 
          s.origin, 
          s.destination, 
          s.status AS shippingStatus, 
          s.arrivalDate, 
          s.company,
          ol.listingID, 
          ol.quantity
      FROM Orders o
      LEFT JOIN OrderListing ol ON o.orderID = ol.orderID
      LEFT JOIN Payment p ON o.orderID = p.orderID
      LEFT JOIN Shipping s ON o.orderID = s.orderID
      WHERE o.buyer = ?
      ORDER BY o.date DESC
  `;

  db.query(query, [buyer], (err, results) => {
      if (err) {
          console.error('Error fetching orders:', err);
          return res.status(500).json({ message: 'Internal server error' });
      }

      const orders = results.reduce((acc, row) => {
          const existingOrder = acc.find(order => order.orderID === row.orderID);
          if (existingOrder) {
              existingOrder.listings.push({
                  listingID: row.listingID,
                  quantity: row.quantity
              });
          } else {
              acc.push({
                  orderID: row.orderID,
                  date: row.date,
                  paymentMethod: row.paymentMethod,
                  paymentStatus: row.paymentStatus,
                  shippingDetails: {
                      origin: row.origin,
                      destination: row.destination,
                      status: row.shippingStatus,
                      arrivalDate: row.arrivalDate,
                      company: row.company
                  },
                  listings: [{
                      listingID: row.listingID,
                      quantity: row.quantity
                  }]
              });
          }
          return acc;
      }, []);

      res.json(orders);
  });
});
