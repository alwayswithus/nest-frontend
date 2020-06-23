import React, { Component } from "react";
import CheckList from "./CheckList";
import TagList from "./TagList";
import Date from "./Date";
import "./TaskInnerContents.scss";
import ReactTooltip from "react-tooltip";
class TaskInnerContents extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      dropdownMenu: false,
    };
  }

  // task 삭제
  deleteTask(event) {
    this.noneClick(event)
    if (window.confirm("삭제하시겠습니까?")) {
      this.props.taskCallbacks.delete(
        this.props.taskListNo,
        this.props.task.taskNo
      );
    }
  }

  // task 복사
  copyTask(event) {
    this.noneClick(event)
    this.props.taskCallbacks.copy(
      this.props.taskListNo,
      this.props.task.taskNo
    );
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
      // this.props.task.taskState,
      // this.props.index
      // this.props.firstTrueIndex
    );
    this.noneClick(event);
  }
  test(event) {
    this.noneClick(event);
    this.setState({
      dropdownMenu: !this.state.dropdownMenu,
    });
  }

  render() {
    const taskItem = this.props.task;
    const labelColor = taskItem.taskLabel;
    const labelStyle = {
      borderLeft: `5px solid ${labelColor}`,
    };

    const fullIcon = <div className="circle1"></div>;
    const emptyIcon = <div className="circle2"></div>;
    let checkListCount = 0;
    let commentListCount = 0;
    let fileListCount = 0;
    let memberListCount = 0;

    // console.log(taskItem.checkList)
    taskItem.checkList.map((checkList) => {
      if (checkList.checklistState === "done") {
        return (checkListCount = checkListCount + 1);
      }
    });

    taskItem.commentList.map((comment) => {
      commentListCount = commentListCount + 1;
    });

    taskItem.fileList.map((file) => {
      fileListCount = fileListCount + 1;
    });

    taskItem.memberList.map((member) => {
      memberListCount = memberListCount + 1;
    });

    const locationTaskNo = window.location.href.split("/");

    return (
      <div className="panel panel-primary" style={labelStyle}>
        <div
          className="panel-body"
          style={
            locationTaskNo[9] === this.props.task.taskNo
              ? { backgroundColor: "#f0d7d2c4" }
              : null
          }
        >
          <div className="task-item task-top">
              <div className="point">
              {taskItem.taskPoint === null ? (
              <b>중요도 평가 없음</b>
              ) : null}
              {taskItem.taskPoint >= 1
                ? fullIcon
                : taskItem.taskPoint !== null
                ? emptyIcon
                : null}
              {taskItem.taskPoint >= 2
                ? fullIcon
                : taskItem.taskPoint !== null
                ? emptyIcon
                : null}
              {taskItem.taskPoint >= 3
                ? fullIcon
                : taskItem.taskPoint !== null
                ? emptyIcon
                : null}
              {taskItem.taskPoint >= 4
                ? fullIcon
                : taskItem.taskPoint !== null
                ? emptyIcon
                : null}
              {taskItem.taskPoint >= 5
                ? fullIcon
                : taskItem.taskPoint !== null
                ? emptyIcon
                : null}
              </div>
              {this.props.authUserRole === 1 ? (
              <>
              <div className="option">
                <i class="fas fa-copy" data-tip="복사" onClick={this.copyTask.bind(this)}></i>
                <i class="fas fa-trash-alt" data-tip="삭제" onClick={this.deleteTask.bind(this)}></i>
                <ReactTooltip />
              </div>
              </>
            ) : null}
              
          </div>
          <div className="task-item task-title">
            <div className="title">
              {taskItem.taskState === "done" ? (
                // 완료된 task
                <>
                  {this.props.authUserRole === 1 ? (
                    <input
                      type="checkbox"
                      className="doneCheck"
                      checked={true}
                      onClick={this.doneTask.bind(this)}
                    ></input>
                  ) : null}
                  &nbsp;
                  <del>{taskItem.taskContents}</del>
                </>
              ) : (
                // 미완료된 task
                <>
                  {this.props.authUserRole === 1 ? (
                    <input
                      type="checkbox"
                      className="doneCheck"
                      checked={false}
                      onClick={this.doneTask.bind(this)}
                    ></input>
                  ) : null}
                  &nbsp;
                  {taskItem.taskContents}
                </>
              )}
            </div>
          </div>

          <div className="task-itemtask-checkList">
            <CheckList
              key={taskItem.taskNo}
              checkList={taskItem.checkList}
              taskListNo={this.props.taskListNo}
              taskNo={taskItem.taskNo}
              taskCallbacks={this.props.taskCallbacks}
            />
          </div>
          <div className="task-item task-tag">
            <TagList key={taskItem.taskNo} tagList={taskItem.tagList} />
          </div>
          <div className="task-item task-date">
            <Date
              key={taskItem.taskNo}
              startDate={taskItem.taskStart}
              endDate={taskItem.taskEnd}
            />
          </div>
          <div className="task-item task-bottom">
            <div className="count">
              <i className="fas fa-tasks">
                {" "}
                {checkListCount}/{taskItem.checkList.length}
              </i>
              <i className="fas fa-comment"> {commentListCount}</i>
              <i className="fas fa-paperclip"> {fileListCount}</i>
            </div>
            <div className="userCocunt">
              <i className="fas fa-user"> {memberListCount}</i>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TaskInnerContents;
