import React, { Component } from "react";
import TaskInnerContents from "./TaskInnerContents";
import "./Task.scss";
import { Draggable } from "react-beautiful-dnd";

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
  // 클릭 모달 막기
  noneClick() {
    window.jQuery(document.body).removeClass("modal-open");
    window.jQuery(".modal-backdrop").remove();
  }

  // task 완료 체크 박스
  doneTask() {
    this.props.taskCallbacks.doneTask(
      this.props.taskListId,
      this.props.task.no,
      this.props.task.checked
    );
    this.noneClick();
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
        <Draggable draggableId={taskItem.no} index={this.props.index} isDragDisabled={this.props.complete}>
          {(provided, snapshot) => (
            <a href={`/nest/kanbanMain/${this.props.taskListId}/task/${taskItem.no}`}>
              <div
                className={taskItem.checked ? "task completeTask" : " task"}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                ref={provided.innerRef}
              >
                {this.props.firstTrueIndex === this.props.index &&
                taskItem.checked ? (
                  <div
                    className="completeArea"
                    onClick={this.showCompleteTaskList.bind(this)}
                  >
                    완료된 업무
                  </div>
                ) : null}

                {/* {taskItem.checked === true && this.state.showComplete  ?  ( */}
                <TaskInnerContents
                  key={taskItem.no}
                  index={this.props.index}
                  task={taskItem}
                  taskListId={this.props.taskListId}
                  taskCallbacks={this.props.taskCallbacks}
                  firstTrueIndex =  {this.props.firstTrueIndex}
                />
                {/* ) : null} */}
              </div>
            </a>
          )}
        </Draggable>
      </>
    );
  }
}

export default Task;
