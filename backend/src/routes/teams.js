const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const teamController = require("../controllers/teamController");

router.use(authMiddleware);

router.get("/", teamController.listTeams);
router.get("/:id", teamController.getTeamById); // optional
router.post("/", teamController.createTeam);
router.put("/:id", teamController.updateTeam);
router.delete("/:id", teamController.deleteTeam);

// assignment
router.post("/:teamId/assign", teamController.assignEmployees);
router.delete("/:teamId/unassign", teamController.unassignEmployees);

module.exports = router;
