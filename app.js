const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const studentRoutes = require("./routes/studentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const app = express();

app.use(bodyParser.json());

app.use("/student", studentRoutes);
app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);

//last middleware for error handling
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message, data });
});

mongoose.set("strictQuery", false);
mongoose
  .connect(
    `mongodb+srv://${process.env.ADMIN_NAME}:${process.env.ADMIN_PASSWORD}@cluster0.2t2nvxz.mongodb.net/test?retryWrites=true&w=majority`
  )
  .then((result) => {
    console.log("connected Successfully and started server")
    app.listen(process.env.PORT_NUMBER)})
  .catch(error => console.log(error));
