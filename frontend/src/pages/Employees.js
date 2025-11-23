// src/pages/Employees.js
import React, { Component } from "react";

import EmployeeForm from "../components/EmployeeForm";

const API_BASE_URL = "https://hrms-backend-e0bo.onrender.com/api";

class Employees extends Component {
  state = {
    // existing state
    employees: [],
    loading: true,
    showError: false,
    errorMsg: "",
    showForm: false,
    editingEmployee: null,

    // extra state for "Employee detail + teams UI"
    selectedEmployee: null, // which employee we are viewing teams for
    employeeTeams: [], // teams this employee belongs to
    employeeTeamsLoading: false, // loading state for teams
    employeeTeamsError: "", // error message for teams

    //list of all teams in organisation (for checkboxes)
    allTeams: [],
  };

  componentDidMount() {
    this.loadEmployees();
  }

  loadEmployees = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    this.setState({ loading: true, errorMsg: "" });
    try {
      const employeesApiUrl = `${API_BASE_URL}/employees`;
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await fetch(employeesApiUrl, options);
      const data = await response.json();
      console.log(data);
      if (response.ok === true) {
        this.setState({
          employees: data,
          loading: false,
        });
      } else {
        this.setState({
          showError: true,
          errorMsg: data.message || "Failed to load employees",
        });
      }
    } catch (error) {
      this.setState({
        showError: true,
        errorMsg: error.message,
      });
    }
  };

  handleSaveEmployee = async (employeesData) => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const { editingEmployee } = this.state;
    const isEdit = !!editingEmployee;

    try {
      const url = isEdit
        ? `${API_BASE_URL}/employees/${editingEmployee.id}`
        : `${API_BASE_URL}/employees`;
      const method = isEdit ? "PUT" : "POST";
      const options = {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(employeesData),
      };
      const response = await fetch(url, options);
      const data = await response.json();
      console.log(data);
      if (response.ok === true) {
        this.setState({ showForm: false, editingEmployee: null });
        this.loadEmployees();
      } else {
        this.setState({
          showError: true,
          errorMsg: data.message || "Failed to save employee",
        });
      }
    } catch (error) {
      this.setState({
        showError: true,
        errorMsg: error.message,
      });
    }
  };

  handleDeleteEmployee = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    if (!window.confirm("Delete this employee?")) return;
    try {
      const deleteEmployeeApiUrl = `${API_BASE_URL}/employees/${id}`;
      const options = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await fetch(deleteEmployeeApiUrl, options);
      const data = await response.json();
      if (response.ok === true) {
        this.setState({ loading: true });
        this.loadEmployees();
      } else {
        this.setState({ showError: true, errorMsg: data.message });
      }
    } catch (error) {
      this.setState({ showError: true, errorMsg: error.message });
    }
  };

  toggleForm = () => {
    this.setState((prev) => ({
      showForm: !prev.showForm,
      editingEmployee: null,
    }));
  };

  handleEditEmployee = (emp) => {
    this.setState({
      showForm: true,
      editingEmployee: emp,
    });
  };

  //load teams for one employee + all org teams
  handleViewTeams = async (emp) => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    this.setState({
      selectedEmployee: emp,
      employeeTeams: [],
      allTeams: [],
      employeeTeamsLoading: true,
      employeeTeamsError: "",
    });

    try {
      // 1) all teams in organisation
      const teamsRes = await fetch(`${API_BASE_URL}/teams`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const allTeams = await teamsRes.json();
      console.log(allTeams);

      // 2) teams that this employee belongs to
      const empTeamsRes = await fetch(
        `${API_BASE_URL}/employees/${emp.id}/teams`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const empTeams = await empTeamsRes.json();
      console.log(empTeams);

      this.setState({
        allTeams,
        employeeTeams: Array.isArray(empTeams) ? empTeams : [],
        employeeTeamsLoading: false,
      });
    } catch (error) {
      this.setState({
        employeeTeamsLoading: false,
        employeeTeamsError: error.message,
      });
    }
  };

  // helper - is this employee in a specific team?
  isEmployeeInTeam = (teamId) => {
    return this.state.employeeTeams.some((t) => t.id === teamId);
  };

  // toggle assign/unassign on checkbox click
  handleToggleTeam = async (team) => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const { selectedEmployee, employeeTeams } = this.state;
    if (!selectedEmployee) return;

    const isInTeam = employeeTeams.some((t) => t.id === team.id);

    const url = `${API_BASE_URL}/teams/${team.id}/${
      isInTeam ? "unassign" : "assign"
    }`;

    const method = isInTeam ? "DELETE" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ employeeId: selectedEmployee.id }),
      });

      const data = await res.json();
      console.log("toggle team result", data);

      if (!res.ok) {
        this.setState({
          employeeTeamsError: data.message || "Failed to update team",
        });
        return;
      }

      // update local state so UI matches
      if (isInTeam) {
        // remove team from employeeTeams
        this.setState({
          employeeTeams: employeeTeams.filter((t) => t.id !== team.id),
          employeeTeamsError: "",
        });
      } else {
        // add team to employeeTeams
        this.setState({
          employeeTeams: [...employeeTeams, team],
          employeeTeamsError: "",
        });
      }
    } catch (error) {
      this.setState({
        employeeTeamsError: error.message,
      });
    }
  };

  render() {
    const {
      employees,
      loading,
      showError,
      errorMsg,
      showForm,
      editingEmployee,

      // destructure new state
      selectedEmployee,
      employeeTeams,
      employeeTeamsLoading,
      employeeTeamsError,
      allTeams,
    } = this.state;

    return (
      <div>
        <h2>Employees List</h2>
        <button onClick={this.toggleForm}>
          {showForm ? "Cancel" : "Add Employee"}
        </button>

        {showForm && (
          <EmployeeForm
            key={editingEmployee ? editingEmployee.id : "new"}
            initialData={editingEmployee}
            onSubmitEmployeeForm={this.handleSaveEmployee}
          />
        )}
        {loading && !showForm && <p>loading...</p>}
        {!loading && employees.length === 0 && <p>No Employees yet.</p>}
        {showError && !loading && <p className="error">{errorMsg}</p>}
        {employees.length > 0 && (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.id}</td>
                  <td>
                    {emp.first_name} {emp.last_name}
                  </td>
                  <td>{emp.email}</td>
                  <td>{emp.phone}</td>
                  <td>
                    <button onClick={() => this.handleDeleteEmployee(emp.id)}>
                      Delete
                    </button>
                    <button
                      onClick={() => this.handleEditEmployee(emp)}
                      style={{ marginLeft: 10 }}
                    >
                      Edit
                    </button>
                    {/*View/Manage teams for this employee */}
                    <button
                      onClick={() => this.handleViewTeams(emp)}
                      style={{ marginLeft: 10 }}
                    >
                      View Teams
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/*employee detail + team assignment UI */}
        {selectedEmployee && (
          <div
            style={{
              marginTop: 24,
              padding: 16,
              border: "1px solid #ddd",
              borderRadius: 4,
            }}
          >
            <h3>
              Teams for {selectedEmployee.first_name}{" "}
              {selectedEmployee.last_name}
            </h3>

            {employeeTeamsLoading && <p>Loading teams...</p>}
            {employeeTeamsError && (
              <p className="error">{employeeTeamsError}</p>
            )}

            {!employeeTeamsLoading && (
              <>
                <p>Select teams for this employee:</p>

                {allTeams.length === 0 && (
                  <p>No teams created yet. Go to Teams page to add teams.</p>
                )}

                {allTeams.length > 0 && (
                  <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                    {allTeams.map((team) => {
                      const checked = this.isEmployeeInTeam(team.id);
                      return (
                        <li key={team.id} style={{ marginBottom: 8 }}>
                          <label>
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => this.handleToggleTeam(team)}
                              style={{ marginRight: 8 }}
                            />
                            {team.name}
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                )}

                {allTeams.length > 0 && employeeTeams.length === 0 && (
                  <p>This employee is not in any team yet.</p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default Employees;
