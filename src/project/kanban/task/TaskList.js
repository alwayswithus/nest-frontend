import React, { Component } from "react";
import Task from "./Task";

import "./TaskList.scss";

class TaskList extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      title: this.props.taskList.title,
      keyword: this.props.taskList.title,
      showEditNameInput: false,
      viewTaskInsertArea: false,
      taskInsertState: false,
      taskContents: "",
      showComplete: false,
    };
  }

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

  // Task List 이름 수정 영역 UI 상태
  showTaskInsertArea() {
    this.setState({
      taskInsertState: !this.state.taskInsertState,
    });
  }

  // Task List 입력 이벤트
  onTextAreaChanged(event) {
    this.setState({
      taskContents: event.target.value,
    });
  }

  // taskList 삭제
  deleteTaskList() {
    if (window.confirm("업무 목록을 삭제하시겠습니까?")) {
      this.props.taskCallbacks.deleteList(this.props.taskList.no);
      this.setState({
        keyword: this.props.taskList.title,
      });
    }
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
    this.showTaskInsertArea();
  }

  // 완료된 Task List 목록 상태
  showCompleteTaskList() {
    this.setState({
      showComplete: !this.state.showComplete,
    });
  }

  render() {
    return (
      <>
        <div className="taskCategory">
          <div className="panel panel-primary">
            <div className="panel-heading">
              <div className="taskList-head">
                <div className="head-title">
                  {/* task list 이름 수정 state*/}
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
                      {this.state.keyword} &nbsp;
                      {this.state.taskInsertState ? (
                        ""
                      ) : (
                        <i
                          className="far fa-edit Icon"
                          onClick={this.editNameInputState.bind(this)}
                        />
                      )}
                    </div>
                  )}
                </div>
                {/* task list 이름 수정 시 버튼 유무*/}
                {this.state.showEditNameInput ? (
                  ""
                ) : (
                  <>
                    {this.state.taskInsertState ? (
                      ""
                    ) : (
                      <>
                        <div className="head-insertBtn">
                          <i
                            className="fas fa-plus Icon"
                            onClick={this.showTaskInsertArea.bind(this)}
                          ></i>
                        </div>
                        <div className="head-deleteBtn">
                          <i
                            className="far fa-trash-alt Icon"
                            onClick={this.deleteTaskList.bind(this)}
                          ></i>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
            {/* task 추가 시 입력 창 state*/}
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
                    className="btn cancel"
                    onClick={this.showTaskInsertArea.bind(this)}
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    className="btn comfirm"
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

          <div className="tasks">
            {/* task 목록 */}
            {this.props.taskList.tasks.map((task) =>
              task.checked ? null : (
                <Task
                  key={task.no}
                  taskListId={this.props.taskList.no}
                  task={task}
                  taskCallbacks={this.props.taskCallbacks}
                />
              )
            )}
            {/* 완료된 task 목록 */}
            <div
              className="completeArea"
              onClick={this.showCompleteTaskList.bind(this)}
            >
              완료된 업무
            </div>
            {this.state.showComplete ? (
              <div className="completeTask">
                {this.props.taskList.tasks.map((task) =>
                  task.checked ? (
                    <Task
                      key={task.no}
                      taskListId={this.props.taskList.no}
                      task={task}
                      taskCallbacks={this.props.taskCallbacks}
                    />
                  ) : null
                )}
              </div>
            ) : null}
          </div>
        </div>
      </>
    );
  }
}

export default TaskList;
