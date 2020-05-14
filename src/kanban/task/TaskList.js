import React, { Component } from "react";
import Task from "./Task";

import "./TaskList.scss";

class TaskList extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      keyword: this.props.taskList.title,
      showEditNameInput: false,
      viewTaskInsertArea: false,
      taskInsertState: false,
      taskContents: "",
    };
  }

  taskList() {}

  // Task List 이름 수정(input 태그) 상태 변경
  editNameInputState() {
    this.setState({
      showEditNameInput: !this.state.showEditNameInput,
    });
  }

  // Task List 이름 수정시 글자 수 limit
  onInputChanged(event) {
    this.setState({
      keyword: event.target.value.substr(0, 13),
    });
  }

  // Task List 이름 수정시 엔터키로 수정
  onInputKeyPress(event) {
    if (event.key === "Enter") {
      this.editNameInputState();
    }
  }

  showTaskInsertArea() {
    this.setState({
      taskInsertState: true,
    });
  }

  noneTaskInsertArea() {
    this.setState({
      taskInsertState: false,
    });
  }

  onTextAreaChanged(event) {
    this.setState({
      taskContents: event.target.value,
    });
  }

  // task 추가
  addTask() {
    this.props.taskCallbacks.add(
      this.props.taskList.no,
      this.state.taskContents
    );
    this.setState({
      taskContents: "",
    });
    this.noneTaskInsertArea();
  }

  // taskList 삭제
  deleteTaskList() {
    if (window.confirm("업무 목록을 삭제하시겠습니까?")) {
      this.props.taskCallbacks.deleteList(this.props.taskList.no);
    }
  }
  getSnapshotBeforeUpdate(props) {
    return props;
  }
  render() {
    const keyword = this.getSnapshotBeforeUpdate(this.props.taskList.title);
    return (
      <>
        <div className="taskCategory">
          <div className="panel panel-primary">
            <div className="panel-heading">
              <div className="taskList-head">
                <div className="head-title">
                  {this.state.showEditNameInput ? (
                    <input
                      className="newTaskListName"
                      type="text"
                      onChange={this.onInputChanged.bind(this)}
                      value={this.state.keyword}
                      onKeyPress={this.onInputKeyPress.bind(this)}
                      autoFocus
                    />
                  ) : (
                    <div>
                      {keyword} &nbsp;
                      <i
                        class="far fa-edit Icon"
                        onClick={this.editNameInputState.bind(this)}
                      />
                    </div>
                  )}
                </div>
                {this.state.showEditNameInput ? (
                  <></>
                ) : (
                  <>
                    {this.state.taskInsertState ? (
                      ""
                    ) : (
                      <>
                        <div className="head-insertBtn">
                          <i
                            class="fas fa-plus Icon"
                            onClick={this.showTaskInsertArea.bind(this)}
                          ></i>
                        </div>
                        <div className="head-deleteBtn">
                          <i
                            class="far fa-trash-alt Icon"
                            onClick={this.deleteTaskList.bind(this)}
                          ></i>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
            {this.state.taskInsertState ? (
              <div className="taskInsertArea">
                <div className="taskInsertForm">
                  <textarea
                    className="textArea"
                    cols="35"
                    rows="2"
                    onChange={this.onTextAreaChanged.bind(this)}
                    value={this.state.taskContents}
                  ></textarea>
                </div>
                <div className="taskInsertBtn">
                  <button
                    type="button"
                    class="btn cancel"
                    onClick={this.noneTaskInsertArea.bind(this)}
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    class="btn comfirm"
                    onClick={this.addTask.bind(this)}
                  >
                    만들기
                  </button>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="tasks"  >
            {this.props.taskList.tasks.map((task) => (
              <Task
                taskListId={this.props.taskList.no}
                task={task}
                taskCallbacks={this.props.taskCallbacks}
              />
            ))}
          </div>
        </div>
        
      </>
    );
  }
}

export default TaskList;
