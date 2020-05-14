import React, { Component } from "react";
import TodoList from "./TodoList";
import TagList from "./TagList";
import Date from "./Date";
import "./Task.scss";

class Task extends Component {
  deleteTask() {
    this.props.taskCallbacks.delete(this.props.taskListId, this.props.task.no);
  }
  copyTask() {
    this.props.taskCallbacks.copy(this.props.taskListId, this.props.task.no);
  }

  render() {
    const taskItem = this.props.task;
    const labelColor = "#F75496";
    const labelStyle = {
      borderLeft: `5px solid ${labelColor}`,
    };

    return (
      <>
        <div className="task">
          <div className="panel panel-primary" style={labelStyle}>
            <div className="panel-body">
              <div className="task-item task-top">
                <div className="point">
                  <i className="fas fa-circle"></i>&nbsp;
                  <i className="fas fa-circle"></i>&nbsp;
                  <i className="fas fa-circle"></i>&nbsp;
                  <i className="far fa-circle"></i>&nbsp;
                  <i className="far fa-circle"></i>&nbsp;
                </div>
                <div className="setting">
                  <div className="btn-group">
                    <button
                      className="btn btn-default dropdown-toggle btn-xs"
                      type="button"
                      data-toggle="dropdown"
                    >
                      <i className="fas fa-ellipsis-v" aria-hidden="true"></i>
                    </button>
                    <ul className="dropdown-menu" role="menu">
                      <li>
                        <a href="#">업무 복사</a>
                      </li>
                      <li className="divider"></li>
                      <li>
                        <a href="#" onClick={this.deleteTask.bind(this)}>
                          업무 삭제
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="task-item task-title">
                <div className="title">
                  <input type="checkbox" className="doneCheck"></input> &nbsp;
                  <label>{taskItem.contents}</label>
                </div>
              </div>

              <div className="task-itemtask-todoList">
                <TodoList todoList={taskItem.todoList} />
              </div>
              <div className="task-item task-tag">
                <TagList tagList={taskItem.tag} />
              </div>
              <div className="task-item task-date">
                <Date
                  startDate={taskItem.startDate}
                  endDate={taskItem.endDate}
                />
              </div>
              <div className="task-item task-bottom">
                <div className="count">
                  <i className="fas fa-tasks"> 0/3</i>
                  <i className="fas fa-comment"> 3</i>
                  <i className="fas fa-paperclip"> 2</i>
                </div>
                <div className="userCocunt">
                  <i className="fas fa-user"> 3</i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Task;
