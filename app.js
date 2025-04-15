const express = require("express");
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require('celebrate');
require('dotenv').config();
const mainRouter = require("./routes");
const { createUser, login } = require("./controllers/users");
const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');


const app = express();

// limiter of requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // in 15 minutes
  max: 100 // you can make a maximum of 100 requests from one IP
});

app.use(limiter);
app.use(helmet());

const { PORT = 3001 } = process.env;
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

app.use(requestLogger);

app.post("/signin", login);
app.post("/signup", createUser);


app.use("/", mainRouter);
app.use(errorLogger);

// celebrate error handler
app.use(errors());
// centralized handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening ${PORT}`);
});
