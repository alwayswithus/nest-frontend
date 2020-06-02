import React, { Component } from "react";
import TaskInnerContents from "./TaskInnerContents";
import "./Task.scss";
import { Draggable } from "react-beautiful-dnd";
import { Link } from "react-router-dom";

class Task extends Component {
  constructor() {
    super(...arguments);

    this.state = {
      path: "",
      closeValue: false,
      showComplete: false,
      closeTag: false,
    };
  }
  // 클릭 업무설정 막기
  noneClick(event) {
    event.preventDefault();
  }

  // task 완료 체크 박스
  doneTask(event) {
    this.props.taskCallbacks.doneTask(
      this.props.taskListNo,
      this.props.task.taskNo
    );
    this.noneClick(event);
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

  //tag modal close
  onClickModal() {
    this.setState({
      closeValue: !this.state.closeValue,
    });
  }

  // 완료된 Task List 목록 상태
  showCompleteTaskList() {
    this.setState({
      showComplete: !this.state.showComplete,
    });
    this.noneClick();
  }

  //새태그 만들기에서 뒤로가기 눌렀을 때
  onClicknewTagModal() {
    this.setState({
      closeTag: !this.state.closeTag,
    });
    this.onClickModal();
  }
  render() {
    const taskItem = this.props.task;
    return (
      <>
        <Draggable
          draggableId={taskItem.taskNo}
          index={this.props.index}
          isDragDisabled={this.props.complete}
        >
          {(provided, snapshot) => (
            <Link
              style={{ textDecoration: "none", color: "black" }}
              to={`/nest/dashboard/${this.props.projectNo}/kanbanboard/${this.props.taskListNo}/task/${taskItem.taskNo}`}
              onClick={this.props.taskCallbacks.modalStateFalse}
            > 
              <div
                className={
                  taskItem.taskState === "done" ? "task completeTask" : " task"
                }
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                ref={provided.innerRef}
              >
                {this.props.firstTrueIndex === this.props.index &&
                taskItem.taskState === "done" ? (
                  <div
                    className="completeArea"
                    onClick={this.showCompleteTaskList.bind(this)}
                  >
                    완료된 업무
                  </div>
                ) : null}

                {/* {taskItem.checked === true && this.state.showComplete  ?  ( */}
                <TaskInnerContents
                  key={taskItem.taskNo}
                  index={this.props.index}
                  task={taskItem}
                  taskListNo={this.props.taskListNo}
                  taskCallbacks={this.props.taskCallbacks}
                  firstTrueIndex={this.props.firstTrueIndex}
                />
                {/* ) : null} */}
              </div>
            </Link>
          )}
        </Draggable>
      </>
    );
  }
}

export default Task;
