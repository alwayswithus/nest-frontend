import React, { Component } from "react";
import ReactTooltip from "react-tooltip";
import Task from "./Task";
import { Droppable, Draggable } from "react-beautiful-dnd";

import "./TaskList.scss";

class TaskList extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      title: this.props.taskList.taskListName,
      keyword: this.props.taskList.taskListName,
      showEditNameInput: false,
      viewTaskInsertArea: false,
      taskInsertState: false,
      taskContents: "",
      showComplete: false,
      beforTaskListName: "",
      completeTaskState: true,
    };
  }

  // 클릭 모달 막기
  noneClick() {
    window.jQuery(document.body).removeClass("modal-open");
    window.jQuery(".modal-backdrop").remove();
  }

  // Task List 이름 수정(input 태그) 상태 변경
  editNameInputState() {
    this.setState({
      showEditNameInput: !this.state.showEditNameInput,
      beforTaskListName: this.state.keyword,
    });
  }

  //Task List 이름 수정 취소
  unEditTaskListName() {
    this.setState({
      keyword: this.state.beforTaskListName,
    });
    this.editNameInputState();
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
      taskContents: event.target.value.substr(0, 30),
    });
  }

  // 완료된 Task List 목록 상태
  showCompleteTaskList() {
    this.setState({
      showComplete: !this.state.showComplete,
    });
    this.noneClick();
  }

  // taskList 삭제
  deleteTaskList() {
    if (window.confirm("업무 목록을 삭제하시겠습니까?")) {
      this.props.taskCallbacks.deleteList(this.props.taskList.taskListNo);
      this.setState({
        keyword: this.props.taskList.title,
      });
    }
  }

  // task 추가
  addTask() {
    this.props.taskCallbacks.add(
      this.props.taskList.taskListNo,
      this.state.taskContents
    );
    this.setState({
      taskContents: "",
    });
    this.showTaskInsertArea();
  }
  render() {
    let completeTaskState = false;
    return (
      <Draggable draggableId={this.props.taskList.taskListNo} index={this.props.index}>
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
                    <>
                      <i
                        className="fas fa-undo Icon reset"
                        data-tip="취소"
                        onClick={this.unEditTaskListName.bind(this)}
                      ></i>
                      <ReactTooltip />
                    </>
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
              <Droppable droppableId={this.props.taskList.taskListNo} type="task">
                {(provided, snapshot) => (
                  <div
                    className="tasks"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    // isDraggingOver={snapshot.isDraggingOver}
                  >
                    {/* task 목록 */}
                    {this.props.taskList.tasks
                      .filter(
                        (task) =>
                          task.taskContents.indexOf(this.props.searchKeyword) !== -1
                      )
                      .map((task, index) =>
                        task.checked ? null : task !== "" ? (
                          <Task
                            path={this.props.path}
                            key={task.taskNo}
                            taskListNo={this.props.taskList.taskListNo}
                            task={task}
                            index={index}
                            taskCallbacks={this.props.taskCallbacks}
                          />
                        ) : (
                          <div>없음</div>
                        )
                      )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              <div
                className="completeTasks"
                ref={provided.innerRef}
                // {...provided.droppableProps}
              >
                {this.props.tasks.map(task => task.taskState === "done" ? completeTaskState = true : null)}
                {completeTaskState ? <div
                    className="completeArea"
                    onClick={this.showCompleteTaskList.bind(this)}
                  >
                    완료된 업무
                  </div> :
                  null
                  }
               

                {this.state.showComplete ? (
                  <div className="completeTask">
                    {this.props.taskList.tasks
                      .filter(
                        (task) =>
                          task.taskContents.indexOf(this.props.searchKeyword) !== -1
                      )
                      .map((task, index) =>
                        task.taskState === 'done' ? (
                          <Task
                            key={task.taskNo}
                            taskListNo={this.props.taskList.taskListNo}
                            task={task}
                            index={index}
                            taskCallbacks={this.props.taskCallbacks}
                            complete={true}
                          />
                        ) : null
                      )}
                    {provided.placeholder}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </Draggable>
    );
  }
}

export default TaskList;
