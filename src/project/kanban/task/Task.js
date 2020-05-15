import React, { Component } from "react";
import TodoList from "./TodoList";
import TagList from "./TagList";
import Date from "./Date";
import Setting from "../tasksetting/setting/Setting";
import "./Task.scss";

class Task extends Component {


  deleteTask(event) {
    this.props.taskCallbacks.delete(this.props.taskListId, this.props.task.no);
    window.jQuery(document.body).removeClass('modal-open');
    window.jQuery(".modal-backdrop").remove();
  }
  copyTask() {
    this.props.taskCallbacks.copy(this.props.taskListId, this.props.task.no);
  }

  test() {
    this.setState({
      open:true
    })
  }

  render() {
    const taskItem = this.props.task;
    const labelColor = "#F75496";
    const labelStyle = {
      borderLeft: `5px solid ${labelColor}`,
    };

    return (
      <>
        <div
          className="task"
          data-toggle="modal"
          data-target={`#kanban-setting-${taskItem.no}`}
          onClick={this.test.bind(this)}
        >
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
                <TodoList
                  key={taskItem.todoList.id}
                  todoList={taskItem.todoList}
                />
              </div>
              <div className="task-item task-tag">
                <TagList key={taskItem.tag.id} tagList={taskItem.tag} />
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
        {/* Project Setting Modal */}
        <div className="project-setting-dialog">
          <div
            class="modal fade come-from-modal right"
            id={`kanban-setting-${taskItem.no}`}
            tabIndex="-1"
            role="dialog"
            aria-labelledby="myModalLabel"
          >
            <div
              class="modal-dialog"
              role="document"
              style={{ width: "670px" }}
            >
              <div class="modal-content">
                <div class="modal-body">
                  <Setting taskContents={taskItem.contents} />
                </div>
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-default"
                    data-dismiss="modal"
                  >
                    Close
                  </button>
                  <button type="button" class="btn btn-primary" >
                    Save changes
                  </button>
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
