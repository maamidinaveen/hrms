const express = require("express");

const app = express();

app.use(express.json());

const cors = require("cors");
const { testConnection, sequelize } = require("./db");

require("./models");

const authRoutes = require("./routes/auth");

const employeeRoutes = require("./routes/employees");
const teamRoutes = require("./routes/teams");

app.use(cors());

const port = process.env.PORT || 5000;

const initializeDBAndServer = async () => {
  await testConnection();
  try {
    await sequelize.sync();
    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    });
  } catch (e) {
    console.error("❌ Error starting server:", e.message);
  }
};

initializeDBAndServer();

app.get("/", (req, res) => {
  res.send("HRMS Backend API is running 🚀");
});

app.use("/api/auth", authRoutes);

app.use("/api/employees", employeeRoutes);

app.use("/api/teams", teamRoutes);
