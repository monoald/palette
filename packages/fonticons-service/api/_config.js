require("dotenv").config();
const env = process.env;

const config = {
  JWT_SECRET: env.JWT_SECRET,
};

module.exports = config;
