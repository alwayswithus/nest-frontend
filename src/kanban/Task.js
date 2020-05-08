import React, { Component } from "react";
import TodoList from "./TodoList";
import TagList from "./TagList";
import Date from "./Date";
import "./Task.scss";

class Task extends Component {
  render() {
    const taskItem = this.props.task;
    return (
      <>
        <div className="task">
          <div className="panel panel-primary">
            <div className="panel-body">
              <div className="task-top">
                <div className="point">
                  <i className="fas fa-circle"></i>&nbsp;
                  <i className="fas fa-circle"></i>&nbsp;
                  <i className="fas fa-circle"></i>&nbsp;
                  <i className="far fa-circle"></i>&nbsp;
                  <i className="far fa-circle"></i>&nbsp;
                </div>
                <div className="setting">
                  <button className="btn btn-default" type="submit">
                    <i className="fas fa-ellipsis-v" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
              <div className="task-title">
                <div className="title">
                  <input type="checkbox" className="doneCheck"></input> &nbsp;
                  <label>{taskItem.contents}</label>
                </div>
              </div>

              <div className="task-todoList">
                <TodoList todoList={taskItem.todoList} />
              </div>
              <div className="task-tag">
                <TagList tagList={taskItem.tag} />
              </div>
              <div className="task-date"><Date startDate={taskItem.startDate} endDate={taskItem.endDate}/></div>
              <div className="task-bottom">bottom</div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Task;
