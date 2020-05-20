import React, { Component, Fragment } from "react";

import "./Todo.scss";

class Todo extends Component {
  // todo 체크
  doneTodoList() {
    this.props.taskCallbacks.todoCheck(
      this.props.taskListId,
      this.props.taskId,
      this.props.todo.id,
      this.props.todo.checked
    );
    this.noneClick();
  }

  // 클릭 모달 막기
  noneClick() {
    window.jQuery(document.body).removeClass("modal-open");
    window.jQuery(".modal-backdrop").remove();
  }
  render() {
    return (
      <Fragment>
        <div className="todo">
          {this.props.todo.checked ? (
            <>
              <input
                type="checkbox"
                className="doneCheck"
                onClick={this.doneTodoList.bind(this)}
                defaultChecked
              ></input>
              <div className="text">
                <del>&nbsp;{this.props.todo.text}</del>
              </div>
            </>
          ) : (
            <>
              <input
                type="checkbox"
                className="doneCheck"
                onClick={this.doneTodoList.bind(this)}
              ></input>
              <div className="text">
                <p>&nbsp;{this.props.todo.text}</p>
              </div>
            </>
          )}
        </div>
        <hr></hr>
      </Fragment>
    );
  }
}

export default Todo;
