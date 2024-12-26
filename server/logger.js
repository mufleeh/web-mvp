const { createLogger, format, transports } = require("winston");

const logger = createLogger({
    level: "info",
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.File({ filename: "logs/usage.log", level: "info" }), // Save logs to a file
        new transports.Console() // Print logs to the console
    ]
});

module.exports = logger;
