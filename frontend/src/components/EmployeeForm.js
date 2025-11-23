import React, { Component } from "react";

class EmployeeForm extends Component {
  constructor(props) {
    super(props);

    const initial = props.initialData || {};

    this.state = {
      id: initial.id || null, // needed for edit
      firstName: initial.first_name || "",
      lastName: initial.last_name || "",
      email: initial.email || "",
      phone: initial.phone || "",
    };
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { onSubmitEmployeeForm } = this.props;
    onSubmitEmployeeForm(this.state);
  };

  render() {
    const { id, firstName, lastName, email, phone } = this.state;

    const isEditMode = !!id;

    return (
      <form className="form" onSubmit={this.handleSubmit}>
        <h3>{isEditMode ? "Edit Employee" : "Add Employee"}</h3>
        <label>First Name</label>
        <input
          type="text"
          name="firstName"
          value={firstName}
          onChange={this.handleChange}
        />
        <label>Last Name</label>
        <input
          type="text"
          name="lastName"
          value={lastName}
          onChange={this.handleChange}
        />
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={this.handleChange}
        />
        <label>Phone</label>
        <input
          type="text"
          name="phone"
          value={phone}
          onChange={this.handleChange}
        />
        <button type="submit">Save</button>
      </form>
    );
  }
}

export default EmployeeForm;
