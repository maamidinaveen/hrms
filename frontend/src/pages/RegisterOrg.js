import React, { Component } from "react";

class RegisterOrg extends Component {
  state = {
    orgName: "",
    adminName: "",
    email: "",
    password: "",
    showError: false,
    errorMsg: "",
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { orgName, adminName, email, password } = this.state;
      const regApiUrl = "http://localhost:5000/api/auth/register";
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orgName, adminName, email, password }),
      };
      const response = await fetch(regApiUrl, options);
      const data = await response.json();
      console.log(data);
      if (response.ok === true) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userEmail", data.user.email);
        localStorage.setItem("userName", data.user.name || "");
        window.location.href = "/dashboard";
      } else {
        this.setState({
          showError: true,
          errorMsg: data.message,
        });
      }
    } catch (err) {
      this.setState({
        showError: true,
        errorMsg: err.message || "Registration failed",
      });
    }
  };

  render() {
    const { orgName, adminName, email, password, showError, errorMsg } =
      this.state;
    return (
      <div className="card">
        <h2>Register Organisation</h2>
        <form className="form" onSubmit={this.handleSubmit}>
          <label>Organisation Name</label>
          <input
            type="text"
            name="orgName"
            value={orgName}
            onChange={this.handleChange}
          />
          <label>Admin Name</label>
          <input
            type="text"
            value={adminName}
            name="adminName"
            onChange={this.handleChange}
          />
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={this.handleChange}
          />
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={this.handleChange}
          />
          <button type="submit">Create Organisation</button>
        </form>
        {showError && <p className="error">{errorMsg}</p>}
      </div>
    );
  }
}

export default RegisterOrg;
