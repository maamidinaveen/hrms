// src/seed.js
const bcrypt = require("bcrypt");
const { sequelize } = require("./db");
const { Organisation, User } = require("./models");

async function seed() {
  try {
    console.log("🌱 Seeding database...");

    await sequelize.sync({ force: true });

    // Create organisation
    const org = await Organisation.create({
      name: "Test Organisation",
    });

    const password = "password123";
    const passwordHash = await bcrypt.hash(password, 10);

    const admin = await User.create({
      organisation_id: org.id,
      email: "admin@test.com",
      password_hash: passwordHash,
      name: "Admin User",
    });

    console.log("Organisation created:", org.id);
    console.log("Admin created:", admin.id);
    console.log("Admin Login Password:", password);

    await sequelize.close();
    console.log("🔌 DB connection closed");
  } catch (err) {
    console.error("❌ Seed error:", err.message);
  }
}

seed();
