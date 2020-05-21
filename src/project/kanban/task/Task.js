import React, { Component } from "react";
import TodoList from "./TodoList";
import TagList from "./TagList";
import Date from "./Date";
import Setting from "../tasksetting/setting/Setting";
import File from "../tasksetting/file/File";
import Comment from "../tasksetting/comment/Comment";
import DragonDrop from "drag-on-drop";
import "./Task.scss";
import { BrowserRouter, Route } from "react-router-dom";

class Task extends Component {
  constructor() {
    super(...arguments);

    this.state = {
      path: "",
      closeValue: false,
    };
  }
  // task 삭제
  deleteTask() {
    this.props.taskCallbacks.delete(this.props.taskListId, this.props.task.no);
    this.noneClick();
  }

  // task 복사
  copyTask() {
    this.props.taskCallbacks.copy(this.props.taskListId, this.props.task.no);
    this.noneClick();
  }

  // 클릭 모달 막기
  noneClick() {
    window.jQuery(document.body).removeClass("modal-open");
    window.jQuery(".modal-backdrop").remove();
  }

  // task 완료 체크 박스
  doneTask() {
    this.props.taskCallbacks.doneTask(
      this.props.taskListId,
      this.props.task.no,
      this.props.task.checked
    );
    this.noneClick();
  }

  //모달 클릭 후 path 초기화.
  onModalOpen() {
    this.setState({
      path: "",
    });
  }

  onCallbackSetting(path) {
    this.setState({
      path: path,
    });
  }

  onClickModal(){
    this.setState({
      closeValue:!this.state.closeValue,
    })
  }
  
  onCallbackChecked(check){
    this.setState({
      checked:check
    })
  }
  render() {
    const taskItem = this.props.task;
    const labelColor = taskItem.label;
    const labelStyle = {
      borderLeft: `5px solid ${labelColor}`,
    };

    return (
      <>
        <div
          className="task"
          data-toggle="modal"
          data-target={`#kanban-setting-${taskItem.no}`}
          onClick={this.onModalOpen.bind(this)}
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
                    <ul
                      className="dropdown-menu"
                      role="menu"
                      onClick={this.noneClick.bind(this)}
                    >
                      <li>
                        <a onClick={this.copyTask.bind(this)}>업무 복사</a>
                      </li>
                      <li>
                        <a onClick={this.deleteTask.bind(this)}>업무 삭제</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="task-item task-title">
                <div className="title">
                  {taskItem.checked ? (
                    // 완료된 task
                    <>
                      <input
                        type="checkbox"
                        className="doneCheck"
                        defaultChecked
                        onClick={this.doneTask.bind(this)}
                      ></input>
                      &nbsp;
                      <del>{taskItem.contents}</del>
                    </>
                  ) : (
                      // 미완료된 task
                      <>
                        <input
                          type="checkbox"
                          className="doneCheck"
                          onClick={this.doneTask.bind(this)}
                        ></input>
                      &nbsp;
                      <label>{taskItem.contents}</label>
                      </>
                    )}
                </div>
              </div>

              <div className="task-itemtask-todoList">
                <TodoList
                  key={taskItem.todoList.id}
                  todoList={taskItem.todoList}
                  taskListId={this.props.taskListId}
                  taskId={this.props.task.no}
                  taskCallbacks={this.props.taskCallbacks}
                />
              </div>
              <div className="task-item task-tag">
                <TagList key={taskItem.tag.id} tagList={taskItem.tag} />
              </div>
              <div className="task-item task-date">
                <Date
                  key={taskItem.no}
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
          <form id={`Form-setting-${taskItem.no}`}>
          <div
            className="modal fade come-from-modal right"
            id={`kanban-setting-${taskItem.no}`}
            tabIndex="-1"
            role="dialog"
            aria-labelledby="myModalLabel"
          >
            <div
              className="modal-dialog"
              role="document"
              style={{ width: "670px" }}
            >
              <div className="modal-content">
                {/* modal 띄우기. */}
                <div className="modal-body">
                  {this.state.path == 'http://localhost:3000/nest/setting' ? 
                      <Setting 
                            path={this.state.path} 
                            closeValue={this.state.closeValue} 
                            onClickModal={this.onClickModal.bind(this)} 
                            taskCallbacks={this.props.taskCallbacks} 
                            onCallbackSetting={this.onCallbackSetting.bind(this)} 
                            task={taskItem} 
                            key={taskItem.no} 
                            taskListNo = {this.props.taskListId} /> : (
                    <>{this.state.path == 'http://localhost:3000/nest/comment' ? 
                        <Comment 
                            path={this.state.path} 
                            onCallbackSetting={this.onCallbackSetting.bind(this)} 
                            task={taskItem} 
                            key={taskItem.no} /> : (
                      <> {this.state.path == 'http://localhost:3000/nest/file' ? 
                            <File 
                              path={this.state.path} 
                              onCallbackSetting={this.onCallbackSetting.bind(this)} 
                              task={taskItem} key={taskItem.no} /> : 
                            <Setting 
                              taskCallbacks={this.props.taskCallbacks}  
                              closeValue={this.state.closeValue}
                              onClickModal={this.onClickModal.bind(this)} 
                              onCallbackSetting={this.onCallbackSetting.bind(this)} 
                              task={taskItem} key={taskItem.no} 
                              taskListNo = {this.props.taskListId} />}</>
                    )} </>)}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-default"
                    data-dismiss="modal"
                    onClick={()=>this.setState({
                      closeValue: false
                    })}
                  >
                    Close
                  </button>
                  <button type="button" className="btn btn-primary">
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          </div>
          </form>
        </div>
      </>
    );
  }
  componentDidMount() {
    this.setState({
      dragonDrop: new DragonDrop(this.dragon),
    });
  }
}

export default Task;
