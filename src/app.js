const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { errorHandler } = require("./middlewares/errorMiddleware");
const routes = require("./routes/base.routes");


const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// app.use("/api/farmer",farmerRoutes);
app.use("/", routes);
app.use(errorHandler);

app.get("/api/message", (req, res) => {
  res.json({ message: "Hello from Backend!" });
});

module.exports = app;