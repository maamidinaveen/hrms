import React, { Component } from "react";

class Login extends Component {
  state = {
    email: "admin@demo.com", // for seed user
    password: "admin123",
    error: "",
    showError: false,
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleLoginSucess = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("userEmail", data.user.email);
    localStorage.setItem("userName", data.user.name || "");
    window.location.href = "/dashboard";
  };

  handleLoginFailure = (message) => {
    this.setState({
      showError: true,
      error: message,
    });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { email, password } = this.state;
      const loginApiUrl = "http://localhost:5000/api/auth/login";
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      };

      const response = await fetch(loginApiUrl, options);
      const data = await response.json();
      console.log(data);

      if (response.ok === true) {
        this.handleLoginSucess(data);
      } else {
        this.handleLoginFailure(data.message);
      }
    } catch (err) {
      this.setState({ error: err.message || "Login failed" });
    }
  };

  render() {
    const { email, password, error, showError } = this.state;
    return (
      <div className="card">
        <h2>Login</h2>
        <form className="form" onSubmit={this.handleSubmit}>
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
          <button type="submit">Login</button>
        </form>
        {showError && <p className="error">{error}</p>}
      </div>
    );
  }
}

export default Login;
