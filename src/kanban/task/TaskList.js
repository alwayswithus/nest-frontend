import React, { Component, useState } from "react";
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
            <div className="panel-heading">
              <div className="taskList-head">
                <div className="head-title">
                  {this.props.taskList.title} &nbsp;
                  <i class="far fa-edit Icon"></i>
                </div>
                <div className="head-insertBtn">
                  <i class="fas fa-plus Icon"></i>
                </div>
                <div className="head-deleteBtn">
                  <i class="far fa-trash-alt Icon"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="tasks">{taskComponents}</div>
        </div>
      </>
    );
  }
}

export default TaskList;
