import React, { Component } from "react";
import TodoList from "./TodoList";
import "./Task.scss";

class Task extends Component {
  render() {
    const allTodoList = this.props.todoList;
    return (
      <>
        <div className="task">
          <div className="panel panel-primary">
            <div className="panel-body">
              <div className="task-title">
                <div className="point">
                  <i className="fas fa-circle"></i>&nbsp;
                  <i className="fas fa-circle"></i>&nbsp;
                  <i className="fas fa-circle"></i>&nbsp;
                  <i className="far fa-circle"></i>&nbsp;
                  <i className="far fa-circle"></i>&nbsp;
                </div>
                <div className="title">
                  <input type="checkbox" className="doneCheck"></input> &nbsp;
                  <label>{this.props.contents}</label>
                </div>
              </div>
              <div className="task-todoList">
                <TodoList todoList={allTodoList} />
              </div>
              <div className="task-tag">tag</div>
              <div className="task-date">date</div>
              <div className="task-bottom">bottom</div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Task;
