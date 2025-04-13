const { createLogger, transports, format } = require("winston");

const logger = createLogger({
  level: "debug",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.colorize(),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
  transports: [
    new transports.Console(),
  ],
});

module.exports = logger;
