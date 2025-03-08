const express = require("express");
const app = express();
const chalk = require("chalk");
const AllRoutes = require("./Routes/index.js");
const cookieParser = require("cookie-parser");

//All Middleware
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
