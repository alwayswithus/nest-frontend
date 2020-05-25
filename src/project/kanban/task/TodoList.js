import React, { Component } from "react";
import Todo from "./Todo";
import "./TodoList.scss";

class TodoList extends Component {
  render() {
    const todoItem = this.props.todoList;
    return (
      <>
        <div className="TodoList">
          {todoItem.length > 0 ? (
            <div className="todoList">
              {todoItem &&
                todoItem.map((todo) => (
                  <Todo
                    key={todo.id}
                    todo={todo}
                    taskListId={this.props.taskListId}
                    taskId={this.props.taskId}
                    taskCallbacks={this.props.taskCallbacks}
                  />
                ))}
            </div>
          ) : null}
        </div>
      </>
    );
  }
}

export default TodoList;
