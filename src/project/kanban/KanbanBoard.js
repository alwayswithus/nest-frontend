import React, { Component } from "react";
import TaskList from "./task/TaskList";
import "./KanbanBoard.scss";
import DragonDrop from 'drag-on-drop';

class KanbanBoard extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      taskListInsertState: false,
      taskListTitle: "",
    };
  }

  //리스트 추가 버튼 UI변경
  taskListStateBtn() {
    this.setState({
      taskListInsertState: !this.state.taskListInsertState,
      taskListTitle: "",
    });
  }
  // 리스트 추가
  addTaskListEnter(event) {
    if (event.key === "Enter") {
      this.addTaskList();
    }
  }

  addTaskList() {
    this.props.taskCallbacks.addList(this.state.taskListTitle);
    this.setState({
      taskListTitle: "",
    });
    this.taskListStateBtn();
  }

  // 리스트명 입력 이벤트
  onTextAreaChanged(event) {
    this.setState({
      taskListTitle: event.target.value.substr(0, 13),
    });
    console.log(event.target.value);
  }

  // 리스트 추가 취소 버튼
  noneTaskListAddBtn() {
    this.setState({
      taskListInsertState: false,
    });
  }

  render() {
    const allTaskList = this.props.tasks;

    return (
      <>
        <div className="kanbanBoard">
          {/*업무 검색*/}
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="업무 검색"
            ></input>
          </div>
          {/*task 리스트*/}
          <div className="taskList">
            {allTaskList.map((task) => (
              <TaskList
                key={task.no}
                taskList={task}
                taskCallbacks={this.props.taskCallbacks}
              />
            ))}
            <div className="taskListAdd">
              {this.state.taskListInsertState ? (
                <>
                  <div className="taskListInsertForm">
                    <div>
                      <input
                        type="text"
                        className="textArea"
                        onChange={this.onTextAreaChanged.bind(this)}
                        onKeyPress={this.addTaskListEnter.bind(this)}
                        value={this.state.taskListTitle}
                        autoFocus
                      ></input>
                    </div>
                    <div className="taskListInsertBtn">
                      &nbsp;
                      <i
                        className="fas fa-plus Icon"
                        onClick={this.addTaskList.bind(this)}
                      ></i>
                      <i
                        class="far fa-trash-alt Icon"
                        onClick={this.taskListStateBtn.bind(this)}
                      ></i>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn btn-default addTaskListBtn"
                    onClick={this.taskListStateBtn.bind(this)}
                  >
                    + 추가
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default KanbanBoard;
