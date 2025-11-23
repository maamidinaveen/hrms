const express = require("express");
const router = express.Router();

const authMiddleWare = require("../middlewares/authMiddleware");

const employeeController = require("../controllers/employeeController");

//All routes use authmiddlewares

router.use(authMiddleWare);

router.get("/", employeeController.listEmployees);

router.get("/:id", employeeController.getEmployeeById);

router.post("/", employeeController.createEmployee);

router.put("/:id", employeeController.updateEmployee);

router.delete("/:id", employeeController.deleteEmployee);

router.get("/:id/teams", employeeController.getEmployeeTeams);

module.exports = router;
