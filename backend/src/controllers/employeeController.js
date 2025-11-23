const { Employee, Log, Team, EmployeeTeam } = require("../models");

// GET /api/employees

const listEmployees = async (req, res) => {
  try {
    const organisationId = req.user.organisationId;

    const employees = await Employee.findAll({
      where: { organisation_id: organisationId },
      order: [["id", "ASC"]],
    });
    return res.json(employees);
  } catch (err) {
    console.error("listEmployees error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// GET /api/employees/:id

const getEmployeeById = async (req, res) => {
  try {
    const organisationId = req.user.organisationId;
    const { id } = req.params;

    const employee = await Employee.findByPk(id);

    if (!employee || employee.organisation_id !== organisationId) {
      return res.status(404).json({ message: "Employee not found" });
    }
    return res.json(employee);
  } catch (err) {
    console.error("getEmployeeById error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// POST /api/employees

const createEmployee = async (req, res) => {
  try {
    const organisationId = req.user.organisationId;
    const userId = req.user.id;

    const { firstName, lastName, email, phone } = req.body;
    console.log(req.body);
    if (!firstName || !lastName) {
      return res
        .status(400)
        .json({ message: "firsName and lastNames are required" });
    }

    const employee = await Employee.create({
      organisation_id: organisationId,
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
    });

    await Log.create({
      organisation_id: organisationId,
      user_id: userId,
      action: "CREATE_EMPLOYEE",
      meta: {
        employeeId: employee.id,
      },
    });
    return res
      .status(201)
      .json({ employee, message: "Employee created successfully" });
  } catch (err) {
    console.error("createEmployee error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// POST /api/employees

const updateEmployee = async (req, res) => {
  try {
    const organisationId = req.user.organisationId;
    const userId = req.user.id;
    const { id } = req.params;

    const { firstName, lastName, email, phone } = req.body;

    const employee = await Employee.findByPk(id);

    if (!employee || employee.organisation_id !== organisationId) {
      return res.status(404).json({ message: "Employee not found" });
    }

    employee.first_name = firstName ?? employee.first_name;
    employee.last_name = lastName ?? employee.last_name;
    employee.email = email ?? employee.email;
    employee.phone = phone ?? employee.phone;

    await employee.save();

    await Log.create({
      organisation_id: organisationId,
      user_id: userId,
      action: "UPDATE_EMPLOYEE",
      meta: { employeeId: employee.id },
    });

    return res.json(employee);
  } catch (err) {
    console.error("updateEmployee error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE /api/employees/:id

const deleteEmployee = async (req, res) => {
  try {
    const organisationId = req.user.organisationId;
    const userId = req.user.id;
    const { id } = req.params;
    const employee = await Employee.findByPk(id);

    if (!employee || employee.organisation_id !== organisationId) {
      return res.status(404).json({ message: "Employee not found" });
    }

    await employee.destroy();

    await Log.create({
      organisation_id: organisationId,
      user_id: userId,
      action: "DELETE_EMPLOYEE",
      meta: { employeeId: Number(id) },
    });
    return res.json({ message: "Employee deleted" });
  } catch (err) {
    console.error("deleteEmployee error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// get employeeTeams

const getEmployeeTeams = async (req, res) => {
  try {
    const organisationId = req.user.organisationId;
    const { id } = req.params; // employee id

    const employee = await Employee.findByPk(id);

    if (!employee || employee.organisation_id !== organisationId) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Find all assignments for this employee
    const assignments = await EmployeeTeam.findAll({
      where: { employee_id: id },
    });

    const teamIds = assignments.map((a) => a.team_id);

    if (teamIds.length === 0) {
      return res.json([]); // no teams
    }

    const teams = await Team.findAll({
      where: {
        id: teamIds,
        organisation_id: organisationId,
      },
      order: [["name", "ASC"]],
    });

    return res.json(teams);
  } catch (err) {
    console.error("getEmployeeTeams error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  listEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeTeams,
};
