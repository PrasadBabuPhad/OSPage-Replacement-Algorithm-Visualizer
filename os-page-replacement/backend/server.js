const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const simulationRoutes = require("./routes/simulationRoutes");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/os_visualizer")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

app.use("/api/simulations", simulationRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
