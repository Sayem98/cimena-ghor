import winston from "winston";
import morgan from "morgan";
import path from "path";
import fs from "fs";

const logDir = path.join(__dirname, "..", "logs");

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    // Output all logs to a file in JSON format
    new winston.transports.File({
      filename: path.join(logDir, "access.log"),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Keep console output for real-time monitoring
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  ],
});

// 2. Create a write stream for Morgan that pipes to Winston
const stream = {
  // Use 'info' level for all request logs
  write: (message: string | Buffer) => {
    const msg = typeof message === "string" ? message : message.toString();
    logger.info(msg.trim());
  },
};

// 3. Define a custom format string (e.g., Common Log Format)
// This will be piped to Winston's stream
const prodFormat =
  ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';

// 4. Export the Morgan middleware
export const morganMiddleware = morgan(prodFormat, { stream });

module.exports = { logger, morganMiddleware };
