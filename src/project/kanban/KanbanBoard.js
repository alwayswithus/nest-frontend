import React, { Component } from "react";
import TaskList from "./task/TaskList";
import ReactTooltip from "react-tooltip";
import { Droppable } from "react-beautiful-dnd";
import "./KanbanBoard.scss";

class KanbanBoard extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      taskListInsertState: false,
      taskListName: "",
      searchKeyword:""
    };
  }

  //리스트 추가 버튼 UI변경
  taskListStateBtn() {
    this.setState({
      taskListInsertState: !this.state.taskListInsertState,
      taskListName: "",
    });
  }
  
  // 리스트 추가(Enter)
  addTaskListEnter(event) {
    if (event.key === "Enter") {
      this.addTaskList();
    }
  }

  // 리스트 추가
  addTaskList() {
    this.props.taskCallbacks.addList(this.state.taskListName, this.props.projectNo);
    this.setState({
      taskListName: "",
    });
    this.taskListStateBtn();
  }

  // 리스트명 입력 이벤트
  onTextAreaChanged(event) {
    this.setState({
      taskListName: event.target.value.substr(0, 13),
    });
  }

  // 리스트 추가 취소 버튼
  noneTaskListAddBtn() {
    this.setState({
      taskListInsertState: false,
    });
  }

  // 업무 검색
  searchKeyword(event) {
    this.setState({
      searchKeyword: event.target.value
  })
  }

  render() {
    const allTaskList = this.props.tasks;
    // console.log("//");
    // console.log(allTaskList);
    // console.log("//");

    return (
      <>
        <div className="kanbanBoard">
          {/*업무 검색*/}
          <div style={{position:'fixed'}} className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="업무 검색"
              value={this.state.searchKeyword}
              onChange={this.searchKeyword.bind(this)}
            ></input>
          </div>
          <div className="taskListArea">
            {/*task 리스트*/}

            <Droppable
              droppableId="all-columns"
              direction="horizontal"
              type="column"
            >
              {(provided) => (
                <div
                  className="taskList"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {allTaskList && allTaskList.map((taskList, index) => {
                    return ( 
                      <TaskList
                        authUserRole={this.props.authUserRole}
                        searchKeyword={this.state.searchKeyword}
                        key={taskList.taskListNo}
                        listNo={taskList.taskListNo}
                        taskList={taskList}
                        tasks={taskList.tasks}
                        index={index}
                        taskCallbacks={this.props.taskCallbacks}
                        projectNo={this.props.projectNo}
                        // isDropDisabled={this.props.isDropDisabled}
                      />
                    );
                  })}
                </div>
              )}
            </Droppable>
            {/* TaskList 추가 */}
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
                        value={this.state.taskListName}
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
                        className="fas fa-undo Icon"
                        onClick={this.taskListStateBtn.bind(this)}
                        data-tip="취소"
                      ></i>
                      <ReactTooltip />
                    </div>
                  </div>
                </>
              ) : (
                <>
                {this.props.authUserRole === 1 ? <button
                    type="button"
                    className="btn btn-default addTaskListBtn"
                    onClick={this.taskListStateBtn.bind(this)}
                  >
                    + 업무 목록 추가
                  </button> : null}
                  
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
