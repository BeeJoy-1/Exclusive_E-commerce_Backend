const nodemailer = require("nodemailer");
const { Template } = require("../Helper/Template");

const SendMail = async (
  FirstName,
  OTP,
  Email_Adress = "beejoy3000@gmail.com"
) => {
  try {
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
      html: Template(FirstName, OTP), // html body
    });

    return info;
  } catch (error) {
    console.log("SendMail Error :", error);
  }
};

module.exports = { SendMail };
