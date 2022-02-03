const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const passport = require("passport");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
dotenv.config();

//MIDDILWARES

const app = express();
let server = http.createServer(app);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const adminRoutes = require("./routes/adminRoutes");

//Passport Middleware
app.use(passport.initialize());

//Passport Config.
require("./config/passport")(passport);

app.use(morgan("dev"));

let _response = {};

//ROUTES
app.use("/api/admin", adminRoutes);

//Catching 404 Error
app.use((req, res, next) => {
  const error = new Error("INVALID ROUTE");
  error.status = 404;
  next(error);
});

//Error handler function
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

const PORT = process.env.PORT || 5000;
// mongoose.connect("mongodb://localhost/codeial_development", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
mongoose
  .connect("mongodb://localhost/votingApp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    _response.database = "Healthy";
    console.log("Database Connected");
    console.log("server Started on PORT", PORT);
  })
  .catch((err) => {
    _response.database = "Unhealthy";
    console.log("Error in connecting to DataBase", err.message);
  });

// mongoose.connect("mongodb://localhost/college", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// const db = mongoose.connection;

// db.on(
//   "error",
//   console.error.bind(console, "Error in connecting to the database")
// );

// db.once("open", function () {
//   console.log("Connected to the database!");
// });
app.use("/", (req, res) => {
  res.status(200).json(_response);
});

server.listen(PORT, () => {
  _response.server = "Healthy";
});

// process.env.MONGO_URL.replace("<password>", process.env.MONGO_PASSWORD
// "mongodb://127.0.0.1:27017/frontEndProject"
