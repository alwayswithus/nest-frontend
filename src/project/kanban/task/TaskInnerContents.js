import React, { Component } from "react";
import CheckList from "./CheckList";
import TagList from "./TagList";
import Date from "./Date";
import "./Task.scss";

class TaskInnerContents extends Component {
  // constructor() {
  //   super(...arguments);
  //   this.state = {
  //     closeValue: false,
  //   };
  // }

  // task 삭제
  deleteTask() {
    this.props.taskCallbacks.delete(this.props.taskListNo, this.props.task.taskNo);
  }

  // task 복사
  copyTask() {
    this.props.taskCallbacks.copy(this.props.taskListNo, this.props.task.taskNo);
  }

  // 클릭 업무설정 막기
  noneClick(event) {
    event.preventDefault();
  }

  // task 완료 체크 박스
  doneTask(event) {
    this.props.taskCallbacks.doneTask(
      this.props.taskListNo,
      this.props.task.taskNo,
      this.props.task.taskState,
      this.props.index
      // this.props.firstTrueIndex
    );
    this.noneClick(event);
  }

  render() {
    const taskItem = this.props.task;
    const labelColor = taskItem.taskLabel;
    const labelStyle = {
      borderLeft: `5px solid ${labelColor}`,
    };

    return (
      <div className="panel panel-primary" style={labelStyle}>
        <div className="panel-body">
          <div className="task-item task-top">
            <div className="point">
              <i className="fas fa-circle"></i>&nbsp;
              <i className="fas fa-circle"></i>&nbsp;
              <i className="fas fa-circle"></i>&nbsp;
              <i className="far fa-circle"></i>&nbsp;
              <i className="far fa-circle"></i>&nbsp;
            </div>
            <div className="setting">
              <div className="btn-group">
                <button
                  className="btn btn-default dropdown-toggle btn-xs"
                  type="button"
                  data-toggle="dropdown"
                >
                  <i className="fas fa-ellipsis-v" aria-hidden="true"></i>
                </button>
                <ul
                  className="dropdown-menu"
                  role="menu"
                  onClick={this.noneClick.bind(this)}
                >
                  <li>
                    <a onClick={this.copyTask.bind(this)}>업무 복사</a>
                  </li>
                  <li>
                    <a onClick={this.deleteTask.bind(this)}>업무 삭제</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="task-item task-title">
            <div className="title">
              {taskItem.taskState === "done" ? (
                // 완료된 task
                <>
                  <input
                    type="checkbox"
                    className="doneCheck"
                    defaultChecked
                    onClick={this.doneTask.bind(this)}
                  ></input>
                  &nbsp;
                  <del>{taskItem.taskContents}</del>
                </>
              ) : (
                // 미완료된 task
                <>
                  <input
                    type="checkbox"
                    className="doneCheck"
                    onClick={this.doneTask.bind(this)}
                  ></input>
                  &nbsp;
                  <label>{taskItem.taskContents}</label>
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
              <i className="fas fa-tasks"> 0/3</i>
              <i className="fas fa-comment"> 3</i>
              <i className="fas fa-paperclip"> 2</i>
            </div>
            <div className="userCocunt">
              <i className="fas fa-user"> 3</i>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TaskInnerContents;
