const { Sequelize } = require("sequelize");
const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, "..", ".env"),
});

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("❌ DATABASE_URL is not set in .env");
}

console.log("👉 DATABASE_URL from env:", databaseUrl);

const sequelize = new Sequelize(databaseUrl, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to PostgreSQL via Sequelize");
  } catch (err) {
    console.error("❌ Unable to connect to database:", err.message);
  }
};

module.exports = { sequelize, testConnection };
