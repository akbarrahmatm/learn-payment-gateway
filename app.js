const express = require("express");
const morgan = require("morgan");

const errorController = require("./controllers/errorController");
const cors = require("cors");
const router = require("./routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  req.encodedMidtransServerKey = Buffer.from(
    process.env.MIDTRANS_SERVER_KEY + ":"
  ).toString("base64");
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date();
  next();
});

app.use(router);

app.use(errorController.onLost);
app.use(errorController.onError);

module.exports = app;
