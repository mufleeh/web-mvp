const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
    process.env.DB_NAME, // Database name
    process.env.DB_USER, // Username
    process.env.DB_PASSWORD, // Password
    {
        host: process.env.DB_HOST || "127.0.0.1", // Host (use IPv4)
        port: process.env.DB_PORT || 3306, // Port
        dialect: "mysql", // Database dialect
        logging: false, // Disable SQL query logs (optional)
    }
);

module.exports = { sequelize };

console.log("Database Config:", {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});