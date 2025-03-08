//Checkers

const EmailChecker = (email = "blabla@gmail.com") => {
  const EmailRegex =
    /^[a-z0-9]+([._-][0-9a-z]+)*@[a-z0-9]+([.-][0-9a-z]+)*\.[a-z]{1,3}$/;
  const textResult = EmailRegex.test(email);
  return textResult;
};

const PasswordChecker = (Password = "BlackNigga003") => {
  const PasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,16}$/;
  const textResultPass = PasswordRegex.test(Password);

  return textResultPass;
};

const PhoneNoChecker = (Number = "01912121212") => {
  const bdPhoneRegex = /^(?:\+8801[3-9]\d{8}|01[3-9]\d{8})$/;
  const textResultPass = bdPhoneRegex.test(Number);

  return textResultPass;
};

module.exports = { EmailChecker, PasswordChecker, PhoneNoChecker };
