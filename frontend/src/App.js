import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import RegisterOrg from "./pages/RegisterOrg";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Teams from "./pages/Teams";
import "./App.css";

class App extends Component {
  handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    window.location.href = "/login";
  };

  render() {
    const token = localStorage.getItem("token");
    const userEmail = localStorage.getItem("userEmail");

    return (
      <Router>
        <div className="app">
          <header className="app-header">
            <div className="nav-left">
              <span className="brand">HRMS</span>
              {token && (
                <>
                  <Link to="/dashboard">Dashboard</Link>
                  <Link to="/employees">Employees</Link>
                  <Link to="/teams">Teams</Link>
                </>
              )}
            </div>
            <div className="nav-right">
              {!token ? (
                <>
                  <Link to="/login">Login</Link>
                  <Link to="/register">Register Org</Link>
                </>
              ) : (
                <>
                  <span className="user-label">{userEmail}</span>
                  <button onClick={this.handleLogout}>Logout</button>
                </>
              )}
            </div>
          </header>

          <main className="app-main">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<RegisterOrg />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </main>
        </div>
      </Router>
    );
  }
}

export default App;
