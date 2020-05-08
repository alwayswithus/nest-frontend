import React, { Component } from "react";
import TaskList from "./TaskList";
import "./KanbanBoard.scss";

class KanbanBoard extends Component {
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
              <TaskList taskList={task}/>
            ))}
            <button type="button" className="btn btn-default cardPlus">
              + 추가
            </button>
          </div>
        </div>
      </>
    );
  }
}

export default KanbanBoard;
