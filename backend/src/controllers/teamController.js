const { Team, Employee, EmployeeTeam, Log } = require("../models");

const listTeams = async (req, res) => {
  try {
    const organisationId = req.user.organisationId;

    // 1. Get all teams for this organisation
    const teams = await Team.findAll({
      where: { organisation_id: organisationId },
      order: [["id", "ASC"]],
    });

    // 2. For each team, count how many employees are assigned
    const teamsWithCounts = await Promise.all(
      teams.map(async (team) => {
        const count = await EmployeeTeam.count({
          where: { team_id: team.id },
        });

        // return plain object + extra field
        return {
          ...team.toJSON(),
          employeeCount: count,
        };
      })
    );

    return res.json(teamsWithCounts);
  } catch (err) {
    console.error("listTeams error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getTeamById = async (req, res) => {
  try {
    const organisationId = req.user.organisationId;
    const { id } = req.params;

    const team = await Team.findByPk(id);

    if (!team || team.organisation_id !== organisationId) {
      return res.status(404).json({ message: "Team not found" });
    }

    return res.json(team);
  } catch (err) {
    console.error("getTeamById error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const createTeam = async (req, res) => {
  try {
    const organisationId = req.user.organisationId;
    const userId = req.user.id;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "name is required" });
    }

    const team = await Team.create({
      organisation_id: organisationId,
      name,
      description,
    });
    await Log.create({
      organisation_id: organisationId,
      user_id: userId,
      action: "CREATE_TEAM",
      meta: { teamId: team.id },
    });

    return res.status(201).json(team);
  } catch (err) {
    console.error("createTeam error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateTeam = async (req, res) => {
  try {
    const organisationId = req.user.organisationId;
    const userId = req.user.id;
    const { id } = req.params;
    const { name, description } = req.body;

    const team = await Team.findByPk(id);

    if (!team || team.organisation_id !== organisationId) {
      return res.status(404).json({ message: "Team not found" });
    }

    team.name = name ?? team.name;
    team.description = description ?? team.description;

    await team.save();

    await Log.create({
      organisation_id: organisationId,
      user_id: userId,
      action: "UPDATE_TEAM",
      meta: { teamId: team.id },
    });

    return res.json(team);
  } catch (err) {
    console.error("updateTeam error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteTeam = async (req, res) => {
  try {
    const organisationId = req.user.organisationId;
    const userId = req.user.id;
    const { id } = req.params;

    const team = await Team.findByPk(id);

    if (!team || team.organisation_id !== organisationId) {
      return res.status(404).json({ message: "Team not found" });
    }

    await team.destroy();

    await Log.create({
      organisation_id: organisationId,
      user_id: userId,
      action: "DELETE_TEAM",
      meta: { teamId: Number(id) },
    });

    return res.json({ message: "Team deleted" });
  } catch (err) {
    console.error("deleteTeam error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// POST /api/teams/:teamId/assign
// body: { employeeId }  OR { employeeIds: [1,2,3] }

const assignEmployees = async (req, res) => {
  try {
    const organisationId = req.user.organisationId;
    const userId = req.user.id;
    const { teamId } = req.params;
    const { employeeId, employeeIds } = req.body;

    let ids = employeeIds || (employeeId ? [employeeId] : []);
    if (!ids.length) {
      return res.status(400).json({
        message: "employeeId or employeeIds is required",
      });
    }
    const team = await Team.findByPk(teamId);
    if (!team || team.organisation_id !== organisationId) {
      return res.status(404).json({ message: "Team not found" });
    }

    const createdAssignments = [];

    for (const id of ids) {
      const employee = await Employee.findByPk(id);
      if (!employee || employee.organisation_id !== organisationId) {
        // skip employees from other org OR non-existent
        continue;
      }

      const [assignment] = await EmployeeTeam.findOrCreate({
        where: {
          employee_id: employee.id,
          team_id: team.id,
        },
      });
      createdAssignments.push(assignment);
    }

    await Log.create({
      organisation_id: organisationId,
      user_id: userId,
      action: "ASSIGN_EMPLOYEES_TO_TEAM",
      meta: { teamId: Number(teamId), employeeIds: ids },
    });

    return res.json({
      message: "Employees assigned to team",
      assignedCount: createdAssignments.length,
    });
  } catch (err) {
    console.error("assignEmployees error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE /api/teams/:teamId/unassign
// body: { employeeId } OR { employeeIds: [] }

const unassignEmployees = async (req, res) => {
  try {
    const organisationId = req.user.organisationId;
    const userId = req.user.id;
    const { teamId } = req.params;
    const { employeeId, employeeIds } = req.body;

    let ids = employeeIds || (employeeId ? [employeeId] : []);

    if (!ids.length) {
      return res.status(400).json({
        message: "employeeId or employeeIds is required",
      });
    }

    const team = await Team.findByPk(teamId);

    if (!team || team.organisation_id !== organisationId) {
      return res.status(404).json({ message: "Team not found" });
    }

    let deletedCount = 0;

    for (const id of ids) {
      const employee = await Employee.findByPk(id);

      if (!employee || employee.organisation_id !== organisationId) {
        continue;
      }

      const count = await EmployeeTeam.destroy({
        where: {
          employee_id: employee.id,
          team_id: team.id,
        },
      });

      deletedCount += count;
    }

    await Log.create({
      organisation_id: organisationId,
      user_id: userId,
      action: "UNASSIGN_EMPLOYEES_FROM_TEAM",
      meta: { teamId: Number(teamId), employeeIds: ids },
    });

    return res.json({
      message: "Employees unassigned from team",
      removedCount: deletedCount,
    });
  } catch (err) {
    console.error("unassignEmployees error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  listTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  assignEmployees,
  unassignEmployees,
};
