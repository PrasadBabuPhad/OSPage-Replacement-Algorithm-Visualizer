const express = require("express");
const router = express.Router();
const Simulation = require("../models/Simulation");

// Save a simulation result
router.post("/", async (req, res) => {
  try {
    const saved = await Simulation.create(req.body);
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get recent 10 saved simulations
router.get("/", async (req, res) => {
  try {
    const history = await Simulation.find().sort({ createdAt: -1 }).limit(10);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
