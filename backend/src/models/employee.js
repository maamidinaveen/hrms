const { DataTypes } = require("sequelize");
const { sequelize } = require("../db");

const Employee = sequelize.define(
  "Employee",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    organisation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING(100),
    },
    last_name: {
      type: DataTypes.STRING(100),
    },
    email: {
      type: DataTypes.STRING(255),
    },
    phone: {
      type: DataTypes.STRING(50),
    },
  },
  {
    tableName: "employees",
    createdAt: "created_at",
    updatedAt: false,
  }
);

module.exports = Employee;
