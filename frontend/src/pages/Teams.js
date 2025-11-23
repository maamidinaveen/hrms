import React, { Component } from "react";

import TeamForm from "../components/TeamForm";

class Teams extends Component {
  state = {
    teams: [],
    loading: true,
    showError: false,
    errorMsg: "",
    showForm: false,
    editingTeam: null,
  };

  componentDidMount() {
    this.loadTeams();
  }

  loadTeams = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    this.setState({
      loading: true,
    });
    try {
      const loadTeamsApiUrl = "http://localhost:5000/api/teams";
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await fetch(loadTeamsApiUrl, options);
      const data = await response.json();
      console.log(data);
      if (response.ok === true) {
        this.setState({
          teams: data,
          loading: false,
        });
      } else {
        this.setState({
          loading: false,
          showError: true,
          errorMsg: data.message,
        });
      }
    } catch (error) {
      this.setState({
        loading: false,
        showError: true,
        errorMsg: error.message,
      });
    }
  };

  handleSaveTeam = async (teamData) => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const { editingTeam } = this.state;
    const isEdit = !!editingTeam;

    try {
      const url = isEdit
        ? `http://localhost:5000/api/teams/${editingTeam.id}` // PUT (update)
        : "http://localhost:5000/api/teams"; // POST (create)

      const method = isEdit ? "PUT" : "POST";
      const options = {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(teamData),
      };
      const response = await fetch(url, options);
      const data = await response.json();
      if (response.ok === true) {
        this.setState({
          showForm: false,
          editingTeam: null,
        });
        this.loadTeams();
      } else {
        this.setState({
          loading: false,
          showError: true,
          errorMsg: data.message,
        });
      }
    } catch (error) {
      this.setState({
        loading: false,
        showError: true,
        errorMsg: error.message,
      });
    }
  };

  handleDeleteTeam = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    if (!window.confirm("Delete this team?")) return;
    try {
      const deleteTeamApiUrl = `http://localhost:5000/api/teams/${id}`;
      const options = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await fetch(deleteTeamApiUrl, options);
      const data = await response.json();
      if (response.ok === true) {
        this.setState({ loading: true });
        this.loadTeams();
      } else {
        this.setState({ showError: true, errorMsg: data.message });
      }
    } catch (error) {
      this.setState({ showError: true, errorMsg: error.message });
    }
  };

  handleEditTeam = (team) => {
    this.setState({
      editingTeam: team,
      showForm: true,
    });
  };

  render() {
    const { teams, loading, showError, errorMsg, showForm, editingTeam } =
      this.state;

    return (
      <div>
        <h2>Teams List</h2>
        <button
          onClick={() =>
            this.setState({ showForm: !showForm, editingTeam: null })
          }
        >
          {showForm ? "Cancel" : "Add Team"}
        </button>
        {showForm && (
          <TeamForm
            key={editingTeam ? editingTeam.id : "new"}
            initialData={editingTeam}
            onSubmitTeamForm={this.handleSaveTeam}
          />
        )}
        {loading && <p>Loading...</p>}
        {showError && <p className="error">{errorMsg}</p>}

        <ul style={{ marginTop: 16, paddingLeft: 0, listStyle: "none" }}>
          {teams.map((team) => (
            <li key={team.id} className="card">
              <strong>{team.name}</strong>
              <p>{team.description}</p>
              <p>
                Assigned employees:{" "}
                {team.employeeCount !== undefined ? team.employeeCount : 0}
              </p>
              <button onClick={() => this.handleDeleteTeam(team.id)}>
                Delete
              </button>
              <button
                onClick={() => this.handleEditTeam(team)}
                style={{ marginLeft: 10 }}
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Teams;
