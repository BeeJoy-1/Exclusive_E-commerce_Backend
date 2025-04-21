const express = require("express");
const cors = require("cors");
const app = express();
const chalk = require("chalk");
const AllRoutes = require("./Routes/index.js");
const cookieParser = require("cookie-parser");

//All Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5175"], // Your frontend's origin
    credentials: true, // Allow credentials
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(AllRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log(
    chalk.bgCyanBright(
      `Server Connected on Port http://localhost:${process.env.PORT}`
    )
  );
});
