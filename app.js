const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const helmet = require("helmet");
const db = require("./database/db");

const contactRoutes = require("./routes/contact");

const app = express();
const port = 3000;

app.use(helmet());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", contactRoutes);

// connect to MySQL database
db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("MySQL database connected!");
  }
});

// start server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

module.exports = app;
