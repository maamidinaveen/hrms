const bcrypt = require("bcrypt");

const { sequelize } = require("./db");

const {
  Organisation,
  User,
  Employee,
  Team,
  EmployeeTeam,
  Log,
} = require("./models");

const seedData = async () => {
  try {
    console.log("🌱 Starting seed...");
    // Drop + recreate tables
    await sequelize.sync({ force: true });
    console.log("✅ Tables recreated");

    // create organisation
    const org = await Organisation.create({
      name: "Demo Organisation",
    });

    // create admin user
    const passwordHash = await bcrypt.hash("admin123", 10);

    const admin = await User.create({
      organisation_id: org.id,
      email: "admin@demo.com",
      password_hash: passwordHash,
      name: "Admin User",
    });

    console.log("👤 Admin created:", admin.email);

    // create employee
    const employeeNames = [
      "Naveen Kumar",
      "Rahul Sharma",
      "Priya Reddy",
      "Aditya Verma",
      "Harika Devi",
      "Vamshi Krishna",
      "Sneha Gupta",
      "Rohit Mehta",
      "Anjali Singh",
      "Karthik Iyer",
      "Pooja Patel",
      "Vikram Rao",
      "Krishna Teja",
      "Varun Naidu",
      "Sravani Ch",
    ];

    const employees = [];
    for (let i = 0; i < employeeNames.length; i++) {
      const [first, last] = employeeNames[i].split(" ");

      const employee = await Employee.create({
        organisation_id: org.id,
        first_name: first,
        last_name: last || "",
        email: `${first.toLowerCase()}${i}@demo.com`,
        phone: "9876543" + (100 + i),
      });
      employees.push(employee);
    }
    console.log("👥 Employees created:", employees.length);

    // create teams
    const teamNames = [
      "Backend Team",
      "Frontend Team",
      "QA Team",
      "DevOps Team",
      "Support Team",
    ];

    const teams = [];

    for (const name of teamNames) {
      const t = await Team.create({
        organisation_id: org.id,
        name,
        description: `${name} handles related tasks.`,
      });
      teams.push(t);
    }
    console.log("👨‍👩‍👧 Teams created:", teams.length);

    // assign employees randomly to teams
    for (const emp of employees) {
      const randomTeam = teams[Math.floor(Math.random() * teams.length)];

      await EmployeeTeam.create({
        employee_id: emp.id,
        team_id: randomTeam.id,
      });
    }
    console.log("🔗 Employee-team assignments completed");

    await Log.create({
      organisation_id: org.id,
      user_id: admin.id,
      action: "SEED_DATA",
      meta: {
        employees: employees.length,
        teams: teams.length,
      },
    });

    console.log("📘 Log recorded");
  } catch (err) {
    console.error("❌ Seed error:", err);
  } finally {
    await sequelize.close();
    console.log("🔌 DB connection closed");
  }
};

seedData();
