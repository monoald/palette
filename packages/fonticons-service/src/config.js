require("dotenv").config();
const env = process.env;

const config = {
  PORT: env.PORT || 3000,
  STATUS: env.STATUS,
  CLIENT_URI: env.CLIENT_URI,
  JWT_SECRET: env.JWT_SECRET,
};

module.exports = config;
