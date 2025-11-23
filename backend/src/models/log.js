const { DataTypes } = require("sequelize");
const { sequelize } = require("../db");

const Log = sequelize.define(
  "Log",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    organisation_id: {
      type: DataTypes.INTEGER,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    action: {
      type: DataTypes.STRING(255),
    },
    meta: {
      type: DataTypes.JSONB,
    },
  },
  {
    tableName: "logs",
    createdAt: "timestamp",
    updatedAt: false,
  }
);

module.exports = Log;
