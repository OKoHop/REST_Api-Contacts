const EeClient = require("elasticemail-webapiclient").client;
require("dotenv").config();

const { ELASTICEMAIL_APY_KEY } = process.env;

const options = {
  apiKey: ELASTICEMAIL_APY_KEY,
  apiUri: "https://api.elasticemail.com/",
  apiVersion: "v2",
};

const EE = new EeClient(options);

const sendEmail = async (data) => {
  const email = { ...data, from: "oconor2007@gmail.com" };
  EE.Email.Send(email).catch((err) => {
    throw new Error(err);
  });
};

module.exports = sendEmail;
