import React, { Component } from "react";
import CheckContents from "./CheckContents";
import "./CheckList.scss";

class CheckList extends Component {
  render() {
    const checkListItem = this.props.checkList;
    return (
      <>
        <div className="checkList">
          {checkListItem.length > 0 ? (
            <div className="checkList-inner">
              {checkListItem &&
                checkListItem.map((checkList) => (
                  <CheckContents
                    key={checkList.checklistNo}
                    checkList={checkList}
                    taskListId={this.props.taskListNo}
                    taskId={this.props.taskNo}
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

export default CheckList;
