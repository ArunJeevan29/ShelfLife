require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const connectDB = require("./config/db");
const errorMiddleware = require("./middleware/errorMiddleware");
const loggerMiddleware = require("./middleware/loggerMiddleware");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
  }),
);
app.use(helmet());
app.use(express.json());
app.use(loggerMiddleware);

app.use(errorMiddleware);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(process.env.PORT, () => {
      console.log(`Running on http://localhost:${process.env.PORT}`);
    });
  } catch (error) {
    console.log("Failed to start server", error.message);
    process.exit(1);
  }
};

startServer();
