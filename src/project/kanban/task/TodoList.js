import React, { Component, Fragment } from "react";
import "./TodoList.scss";

class TodoList extends Component {
  render() {
    const todoItem = this.props.todoList;
    return (
      <>
        <div>
          {todoItem.length > 0 ? (
            <div className="todoList">
              {todoItem && todoItem.map(todo => (
                  <Fragment key={todo.id}>
                    <div className="todo">
                      {todo.checked ? 
                        <>
                          <input type="checkbox" className="doneCheck" defaultChecked ></input>
                          <div className="text">
                            <del>&nbsp;{todo.text}</del>
                          </div>
                          </>
                       : 
                        <>
                          <input type="checkbox" className="doneCheck"></input>
                          <div className="text">
                            <p>&nbsp;{todo.text}</p>
                          </div>
                        </>
                      }
                    </div>
                    <hr></hr>
                  </Fragment>
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
