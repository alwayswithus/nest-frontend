import React, { Component } from "react";
import TaskList from "./task/TaskList";
import "./KanbanBoard.scss";

class KanbanBoard extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      taskListInsertState: false,
      taskContents:""
    };
  }

  taskListAdd() {
    this.setState({
      taskListInsertState: !this.state.taskListInsertState,
    });
  }
  addTaskList(){

  }
  noneTaskInsertArea(){
    this.setState({
      taskListInsertState: false,
    });
  }
  onTextAreaChanged(event){
    this.setState({
      taskContents: event.target.value,
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
                  <div className="taskListInsertArea">
                    <div className="taskListInsertForm">
                      <textarea
                        className="textArea"
                        cols="35"
                        rows="2"
                        onChange={this.onTextAreaChanged.bind(this)}
                        value={this.state.taskContents}
                      ></textarea>
                    </div>
                    <div className="taskListInsertBtn">
                      <button
                        type="button"
                        className="btn cancel"
                        onClick={this.noneTaskInsertArea.bind(this)}
                      >
                        취소
                      </button>
                      <button
                        type="button"
                        className="btn comfirm"
                        onClick={this.addTaskList.bind(this)}
                      >
                        만들기
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn btn-default cardPlus"
                    onClick={this.taskListAdd.bind(this)}
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
