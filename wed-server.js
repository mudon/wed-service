const express = require("express");
const app = express();
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const port = 7733; // Port for the server

// Supabase setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors());
app.use(express.json());

// Route: Redirect to admin attendance list
app.post("/admin", (req, res) => {
  res.redirect("/admin/senaraiKehadiran");
});

// Route: Get admin attendance list
app.get("/admin/senaraiKehadiran", (req, res) => {
  res.json({ message: "Hello, World!" });
});

app.get("/kehadiran", async (req, res) => {
  try {
    const { data, error } = await supabase
    .from("Senarai")
    .select("*") // Adjust columns if needed
    .order("id", { ascending: false }) // Order by "id" in descending order
    .limit(6); // Limit to only the latest record

    if (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    res.status(200).json({ data }); // Respond with the retrieved data
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "Unexpected error occurred" });
  }
});

// Route: Insert attendance data
app.post("/kehadiran", async (req, res) => {
  const data = req.body;
  
  try {
    const { error } = await supabase.from("Senarai").insert({
      id: Date.now().toString(),
      name: data.name,
      nomborFon: data.fon,
      jumlahKehadiran: parseInt(data.jumlah),
      ucapan: data.ucapan,
      kehadiran: data.kehadiran,
    });

    if (error) {
      console.error("Error inserting data:", error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    res.status(200).json({ message: "Data inserted successfully" });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "Unexpected error occurred" });
  }
});

// Route: Insert gift booking data
app.post("/hadiah", async (req, res) => {
  const data = req.body;

  try {
    const { error } = await supabase.from("Tempahan").insert({
      id: Date.now().toString(),
      name: data.name,
      itemName: data.itemName,
    });

    if (error) {
      console.error("Error inserting data:", error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    res.status(200).json({ message: "Data inserted successfully" });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "Unexpected error occurred" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
