import React, { Component } from "react";
import Task from "./Task";
import "./TaskList.scss";

class TaskList extends Component {
  render() {
    const taskComponents = [];
    this.props.taskList.tasks.forEach((task) =>
      taskComponents.push(<Task task={task} />)
    );
    return (
      <>
        <div className="taskCategory">
          <div className="panel panel-primary">
            <div className="panel-heading">{this.props.taskList.title}</div>
          </div>
          <div className="tasks">{taskComponents}</div>
        </div>
      </>
    );
  }
}

export default TaskList;
