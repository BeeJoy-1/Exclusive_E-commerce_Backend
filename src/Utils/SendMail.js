const nodemailer = require("nodemailer");
const { Template } = require("../Helper/Template");

const SendMail = async (
  FirstName,
  OTP,
  Email_Adress = "beejoy3000@gmail.com"
) => {
  try {
    // console.log("Using email:", process.env.HOST_MAIL); // Debug check
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.HOST_MAIL,
        pass: process.env.HOST_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.HOST_MAIL, // sender address
      to: `${Email_Adress}`, // list of receivers
      subject: "Exclusive Backend ✔", // Subject line
      html: Template(FirstName, OTP, Email_Adress), // html body
    });

    return info;
  } catch (error) {
    console.log("SendMail Error :", error);
  }
};

module.exports = { SendMail };
