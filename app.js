const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require('celebrate');
const mainRouter = require("./routes");
const { createUser, login } = require("./controllers/users");
const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
require('dotenv').config();

const app = express();
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

app.post("/signin", login);
app.post("/signup", createUser);

app.use(requestLogger);
app.use("/", mainRouter);
app.use(errorLogger);

// celebrate error handler
app.use(errors());
// centralized handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening ${PORT}`);
});
