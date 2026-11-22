const mongoose = require("mongoose");

const simulationSchema = new mongoose.Schema(
  {
    referenceString: { type: [Number], required: true },
    frameCount: { type: Number, required: true },
    algorithm: { type: String, enum: ["FIFO", "LRU", "OPTIMAL"], required: true },
    hits: { type: Number, required: true },
    faults: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Simulation", simulationSchema);
