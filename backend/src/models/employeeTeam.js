const { DataTypes } = require("sequelize");
const { sequelize } = require("../db");

const EmployeeTeam = sequelize.define(
  "EmployeeTeam",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    team_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "employee_teams",
    createdAt: "assigned_at",
    updatedAt: false,
  }
);

module.exports = EmployeeTeam;
