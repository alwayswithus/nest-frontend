import React, { Component } from "react";
import "./TodoList.scss";

class TodoList extends Component {
  render() {
    const todoItem = this.props.todoList;
    console.log(todoItem);
    return (
      <>
        <div>
          {todoItem.lenght !== 0 && 
              <div className="todoList">
                {todoItem &&
                  todoItem.map((todo) => (
                    <div className="text">
                      <input type="checkbox" className="doneCheck"></input>
                      {todo.text}
                    </div>
                  ))}
              </div>
            }
        </div>
      </>
    );
  }
}

export default TodoList;
