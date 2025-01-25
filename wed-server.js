const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql');

const port = 7733; // Port is correctly defined as 8080

const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
  });

conn.connect((err) => {
    if (err) {
        console.error("Error connecting to the database:", err);
        process.exit(1);
    }
    console.log("Connected to the MySQL database");
});

app.use(cors());
app.use(express.json())

app.post("/admin", (req, res) => {
      res.redirect("/admin/senaraiKehadiran");
});

app.get("/admin/senaraiKehadiran", (req, res) => {
    res.json({"message": "Hello, World!"});
});

app.post("/kehadiran", (req, res) => {
    const data = req.body;
    
    const query = `INSERT INTO List (id, name, nomborTelefon, jumlahKehadiran, ucapan, kehadiran)
    VALUES (?, ?, ?, ?, ?, ?)`;
    const params = [Date.now(), data.name, data.fon, parseInt(data.jumlah), data.ucapan, data.kehadiran];

    conn.query(query, params, (err, results) => { 
        if (err) {
            console.error("Error executing query:", err);
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }
    
        res.status(200).json({ message: "Data inserted successfully", data: results });
    });

        
});

app.post("/hadiah", (req, res) => {    
    const data = req.body;
    const query = `INSERT INTO Tempahan (id, name, itemName) VALUES (?, ?, ?)`;
    const params = [Date.now(), data.name, data.itemName];

    conn.query(query, params, (err, results) => {
        if (err) {
            console.error("Error executing query:", err);
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }

        res.status(200).json({ message: "Data inserted successfully", data: results });
    });
});

app.listen(port, () => { 
    console.log(`Server running on port ${port}`); // Updated log message to reflect the correct port
});
