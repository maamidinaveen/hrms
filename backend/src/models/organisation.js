const { DataTypes } = require("sequelize");
const { sequelize } = require("../db");

const Organisation = sequelize.define(
  "Organisation",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: "organisations",
    createdAt: "created_at",
    updatedAt: false,
  }
);

module.exports = Organisation;

// Sequelize automatically adds:

// 1. id

// Primary key, auto-increment integer.

// 2. createdAt

// Timestamp.

// 3. updatedAt

// Timestamp.
