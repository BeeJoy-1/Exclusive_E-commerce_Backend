const mongoose = require("mongoose");
const chalk = require("chalk");
const DBname = require("../Constant/Constant.js");

const DbConnection = async () => {
  try {
    const DatabaseInfo = await mongoose.connect(
      `${process.env.DATABASE_URL}/${DBname}`
    );

    console.log(
      chalk.blue.bgGreenBright.bold(
        `Database Connected! || ${
          (await DatabaseInfo).connection.host
        } ${DBname}`
      )
    );
  } catch (error) {
    console.log(chalk.bgRedBright(error));
  }
};

module.exports = { DbConnection };
