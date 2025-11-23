import React, { Component } from "react";

class TeamForm extends Component {
  constructor(props) {
    super(props);

    const initial = props.initialData || {};

    this.state = {
      id: initial.id || null, // needed only for edit
      name: initial.name || "",
      description: initial.description || "",
    };
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { onSubmitTeamForm } = this.props;
    onSubmitTeamForm(this.state);
  };

  render() {
    const { id, name, description } = this.state;

    const isEdit = !!id;

    return (
      <form className="form" onSubmit={this.handleSubmit}>
        <h3>{isEdit ? "Edit Team" : "Add Team"}</h3>
        <label>Team Name</label>
        <input name="name" value={name} onChange={this.handleChange} />
        <label>Description</label>
        <textarea
          name="description"
          value={description}
          onChange={this.handleChange}
        />
        <button type="submit">{isEdit ? "Update" : "Save"}</button>
      </form>
    );
  }
}

export default TeamForm;
