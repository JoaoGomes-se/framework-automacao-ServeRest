const fs = require("fs");
const path = require("path");
const winston = require("winston");
const { LOG_LEVEL } = require("../config/api");

const logDir = path.resolve(process.cwd(), "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const now = new Date();
const timestampFile = now.toISOString().replace(/T/, "_").replace(/:/g, "-").slice(0, 19);

const logFilePath = path.join(logDir, `execucao_${timestampFile}.log`);

const maskToken = (text) =>
  String(text).replace(/(Bearer\s+[A-Za-z0-9\-._~+/]{8})[A-Za-z0-9\-._~+/=]+/gi, "$1...");

const lineFormat = winston.format.printf(({ timestamp, level, module: mod, message }) => {
  const modulo = mod || "geral";
  return `${timestamp} | ${level.toUpperCase()} | ${modulo} | ${maskToken(message)}`;
});

const logger = winston.createLogger({
  level: LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    lineFormat
  ),
  transports: [
    new winston.transports.File({
      filename: logFilePath,
    }),
  ],
});

module.exports = {
  logger,
  logFilePath,
};
