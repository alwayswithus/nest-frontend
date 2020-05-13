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

  // task 추가
  addTask() {
    this.props.taskCallbacks.add(this.props.taskList.no, "test");
  }

  // task 삭제
  deleteTaskList() {
    if (window.confirm("업무 목록을 삭제하시겠습니까?")) {
      this.props.taskCallbacks.delete(this.props.taskList.no);
    }
  }

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
                    <div className="head-insertBtn">
                      <i
                        class="fas fa-plus Icon"
                        onClick={this.addTask.bind(this)}
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
