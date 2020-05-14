import React, { Component } from "react";
import "./TodoList.scss";

class TodoList extends Component {
  render() {
    const todoItem = this.props.todoList;
    return (
      <>
        <div>
          {todoItem.length > 0 ? (
           
            <div className="todoList">
              {todoItem && 
                todoItem.map((todo) => (
                  <>
                  <div className="todo">
                    <input type="checkbox" className="doneCheck"></input>
                    <div className="text">&nbsp;{todo.text} </div>
                   
                  </div><hr></hr>
                  </>
                ))}
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </>
    );
  }
}

export default TodoList;
