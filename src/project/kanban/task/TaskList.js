import React, { Component } from "react";
import ReactTooltip from "react-tooltip";
import Task from "./Task";
import { Droppable, Draggable } from "react-beautiful-dnd";
import update from "react-addons-update";

import "./TaskList.scss";

const API_URL = "http://localhost:8080/nest";
const API_HEADERS = {
  "Content-Type": "application/json",
};

class TaskList extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      title: "",
      keyword: "",
      showEditNameInput: false,
      viewTaskInsertArea: false,
      taskInsertState: false,
      taskContents: "",
      showComplete: false,
      beforTaskListName: "",
      completeTaskState: true,
    };
  }

  // 클릭 이벤트 막기
  noneClick(event) {
    event.preventDefault();
  }

  // Task List 이름 수정(input 태그) 및 UI 변경
  editNameInputState() {
    if (this.state.showEditNameInput) {
      const newTaskList = update(this.props.taskList, {
        taskListName: { $set: this.state.keyword },
      });

      this.props.taskCallbacks.editTaskListName(newTaskList);

      this.setState({
        keyword: this.props.taskList.taskListName,
      });
    }

    this.setState({
      showEditNameInput: !this.state.showEditNameInput,
      beforTaskListName: this.state.keyword,
      keyword: this.props.taskList.taskListName,
    });
  }

  //Task List 이름 수정 취소
  unEditTaskListName() {
    this.setState({
      showEditNameInput: !this.state.showEditNameInput,
      beforTaskListName: this.state.keyword,
      keyword: this.state.beforTaskListName,
    });
  }

  // Task List 이름 수정시 글자 수 limit
  onInputChanged(event) {
    this.setState({
      keyword: event.target.value.substr(0, 13),
    });
  }

  // Task List 이름 수정 (Enter키로 함수 호출)
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

  // Task 내용 입력 이벤트
  onTextAreaChanged(event) {
    this.setState({
      taskContents: event.target.value.substr(0, 30),
    });
  }

  // 완료된 Task List 목록 상태
  showCompleteTaskList() {
    this.setState({
      showComplete: !this.state.showComplete,
    });
  }

  // taskList 삭제
  deleteTaskList() {
    if (window.confirm("업무 목록을 삭제하시겠습니까?")) {
      this.props.taskCallbacks.deleteList(this.props.taskList);
      this.setState({
        keyword: this.props.taskList.title,
      });
    }
  }

  // task 추가
  addTask() {
    this.props.taskCallbacks.add(
      this.props.taskList.taskListNo,
      this.state.taskContents,
      this.props.projectNo
    );
    this.setState({
      taskContents: "",
    });
    this.showTaskInsertArea();
  }

  render() {

    let doneCount = 0;
    this.props.tasks.map((task) =>
      task.taskState === "done" ? (doneCount = doneCount + 1) : null
    );

    return (
      <Draggable
        draggableId={this.props.taskList.taskListNo}
        index={this.props.index}
        isDragDisabled={this.props.authUserRole !== 1}
      >
        {(provided) => (
          <div
            className="taskCategory"
            {...provided.draggableProps}
            ref={provided.innerRef}
          >
            <div
              className="panel panel-primary taskPanel"
              {...provided.dragHandleProps}
            >
              <div className="panel-heading">
                <div className="taskList-head">
                  <div className="head-title">
                    {/* task list 이름 수정 state*/}
                    {this.state.showEditNameInput ? (
                      <input
                        style={{ fontSize: "17px" }}
                        className="newTaskListName"
                        type="text"
                        onChange={this.onInputChanged.bind(this)}
                        value={this.state.keyword}
                        onKeyPress={this.onInputKeyPress.bind(this)}
                        autoFocus
                      />
                    ) : (
                      <div style={{ display: "flex" }}>
                        <div style={{ fontSize: "17px" }}>
                          {this.props.taskList.taskListName} &nbsp;
                        </div>
                        {this.state.taskInsertState ? (
                          ""
                        ) : (
                          <>
                            {this.props.authUserRole === 1 ? (
                              <i
                                className="far fa-edit Icon"
                                onClick={this.editNameInputState.bind(this)}
                              />
                            ) : null}
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* task list 이름 수정 시 버튼 유무*/}
                  {this.state.showEditNameInput ? (
                    <>
                      <i 
                        className="fas fa-check Icon edite" 
                        data-tip="저장(Enter)"
                        onClick={this.editNameInputState.bind(this)}></i>
                      <i
                        className="fas fa-times Icon edite"
                        data-tip="취소"
                        onClick={this.unEditTaskListName.bind(this)}></i>
                      <ReactTooltip />
                    </>
                  ) : (
                    <>
                      {this.state.taskInsertState ? (
                        ""
                      ) : (
                        <>
                          {this.props.authUserRole === 1 ? (
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
                          ) : null}
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
                      autoFocus
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
            <div className="taskArea">
              <div className="test">
                <Droppable
                  droppableId={this.props.taskList.taskListNo}
                  type="task"
                >
                  {(provided, snapshot) => (
                    <>
                      <div
                        className="tasks"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        {/* task 목록 */}

                        {this.props.selectPicker === "task" ?
                        <>
                        {this.props.taskList.tasks
                          .filter(
                            (task) =>
                              task.taskContents.indexOf(
                                this.props.searchKeyword
                              ) !== -1
                          )
                          .map((task, index) => (
                            <>
                              <div>
                                {this.state.showComplete 
                                  ? 
                                  <Task
                                    authUserRole={this.props.authUserRole}
                                    projectNo={this.props.projectNo}
                                    key={task.taskNo}
                                    taskListNo={this.props.taskList.taskListNo}
                                    task={task}
                                    index={index}
                                    taskCallbacks={this.props.taskCallbacks}
                                    complete={task.taskState === "done" ? true : false}
                                  />
                                  : 
                                  task.taskState === "done" 
                                    ? null 
                                    :
                                    <Task
                                      authUserRole={this.props.authUserRole}
                                      projectNo={this.props.projectNo}
                                      key={task.taskNo}
                                      taskListNo={this.props.taskList.taskListNo}
                                      task={task}
                                      index={index}
                                      taskCallbacks={this.props.taskCallbacks}
                                      complete={task.taskState === "done" ? true : false}
                                    />
                                }
                                
                              </div>
                            </>
                          ))}
                          </>
                          : 
                          <>
                            {this.props.taskList.tasks
                            .map((task, index) => (
                              <div>
                                {this.state.showComplete 
                                  ? 
                                  <Task
                                    authUserRole={this.props.authUserRole}
                                    projectNo={this.props.projectNo}
                                    key={task.taskNo}
                                    taskListNo={this.props.taskList.taskListNo}
                                    task={task}
                                    index={index}
                                    taskCallbacks={this.props.taskCallbacks}
                                    complete={task.taskState === "done" ? true : false}
                                  />
                                  : 
                                  task.taskState === "done" 
                                    ? null 
                                    :
                                    <Task
                                      authUserRole={this.props.authUserRole}
                                      projectNo={this.props.projectNo}
                                      key={task.taskNo}
                                      taskListNo={this.props.taskList.taskListNo}
                                      task={task}
                                      index={index}
                                      taskCallbacks={this.props.taskCallbacks}
                                      complete={task.taskState === "done" ? true : false}
                                    />
                                }
                                
                              </div>
                          ))}
                          </>}
                        {provided.placeholder}
                      </div>
                    </>
                  )}
                </Droppable>
              </div>
              <div className="completeTasks" onClick={this.showCompleteTaskList.bind(this)} >
                <div>
                  <b>완료된 업무 {doneCount} / {this.props.tasks.length}</b>
                </div>
                <div>
                  <b>{this.state.showComplete  ? "숨기기": "보이기"}</b>
                </div>
              </div>
            </div>
          </div>
        )}
      </Draggable>
    );
  }
}

export default TaskList;
