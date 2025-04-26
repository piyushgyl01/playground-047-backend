const express = require("express");
const app = express();

const { connectToDb } = require("./db/db.connect");

connectToDb();
app.use(express.json());

const cors = require("cors");
const Startup = require("./models/startup.model");

const corsOptions = {
  origin: "*",
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.json("Startups Database! Browse your favorite startup");
});

// async function insertData(data) {
//   try {
//     const savedData = await Startup.insertMany(data);
//     console.log(savedData);
//   } catch (error) {
//     console.log(error);
//   }
// }

app.get("/startups", async (req, res) => {
  try {
    const startups = await Startup.find();
    res.json(startups);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/startups/:id", async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id);
    res.json(startup);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

app.post("/startups", async (req, res) => {
  const { name, description, founder } = req.body;

  if (!name || !description || !founder) {
    return res
      .status(404)
      .json({ message: "Please fill in all the required fields" });
  }

  try {
    const newStartup = new Startup({ name, description, founder });
    const savedStartup = await newStartup.save();
    res.status(201).json(savedStartup);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

app.put("/startups/:id", async (req, res) => {
  try {
    const editedStartup = await Startup.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!editedStartup) {
      return res.status(404).json({ message: "Unable to find the startup" });
    }

    res.json(editedStartup);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

app.delete("/startups/:id", async (req, res) => {
  try {
    const deletedStartup = await Startup.findByIdAndDelete(req.params.id);

    if (!deletedStartup) {
      return res.status(404).json({ message: "Unable to find the startup" });
    }

    res.json({
      deletedStartup: deletedStartup,
      message: "Deleted successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

app.listen(4000, () => {
  console.log("Server is running on PORT 4000");
});
