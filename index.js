const compression = require("compression");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(compression());
const mongoose = require("mongoose");
const userRouter = require("./modules/auth/userRouter");
const doctorRouter = require("./modules/doctor/doctorRouter");
app.use(express.json());

app.use(express.urlencoded());

mongoose.connect("mongodb://localhost:27017/Users", { useNewUrlParser: true });
app.use("/users", userRouter);
app.use("/doctors", doctorRouter);

app.use((err, req, res, next) => {
  res.send({
    statusCode: err.statusCode,
    message: err.message,
  });
});

app.listen(3000);
