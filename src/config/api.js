const path = require("path");
const dotenv = require("dotenv");

const envFile = process.env.ENV_FILE || ".env";
dotenv.config({ path: path.resolve(process.cwd(), envFile), quiet: true });

const ENV = process.env.NODE_ENV || "test";
const BASE_URL = process.env.BASE_URL || "https://serverest.dev";
const TIMEOUT = Number(process.env.REQUEST_TIMEOUT) || 15000;
const LOG_LEVEL = process.env.LOG_LEVEL || "info";
const CREDENTIALS = {
  email: process.env.ADMIN_EMAIL || "fulano@qa.com",
  password: process.env.ADMIN_PASSWORD || "teste",
};

module.exports = {
  ENV,
  BASE_URL,
  TIMEOUT,
  LOG_LEVEL,
  CREDENTIALS,
};
