import React, { Component } from "react";

class Dashboard extends Component {
  render() {
    const name = localStorage.getItem("userName");
    const email = localStorage.getItem("userEmail");
    const token = localStorage.getItem("token");

    if (!token) {
      return <p>Please login to view dashboard</p>;
    }

    return (
      <div>
        <h2>Dashboard</h2>
        <p>Welcome, {name || email}!</p>
        <p>Use the navigation links to manage employees and teams.</p>
      </div>
    );
  }
}

export default Dashboard;
