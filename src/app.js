const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const farmerRoutes = require("./routes/farmer.routes");
const { errorHandler } = require("./middlewares/errorMiddleware");

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/farmer",farmerRoutes)
app.use(errorHandler);

app.get("/api/message", (req, res) => {
  res.json({ message: "Hello from Backend!" });
});

module.exports = app;