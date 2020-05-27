import React, { Component, Fragment } from "react";
import "./CheckContents.scss";

class CheckContents extends Component {
  // checkList 체크
  doneCheckList() { 
    this.props.taskCallbacks.checklistCheck(
      this.props.taskListId,
      this.props.taskId,
      this.props.checkList.checklistNo,
      this.props.checkList.checklistState
    );
    this.noneClick();
  }

  // 클릭 모달 막기
  noneClick() {
    window.jQuery(document.body).removeClass("modal-open");
    window.jQuery(".modal-backdrop").remove();
  }
  render() {
    console.log(this.props.checkList.checklistState);
    return (
      <Fragment>
        <div className="checklist">
            <input
                type="checkbox"
                className="doneCheck"
                onClick={this.doneCheckList.bind(this)}
                checked={this.props.checkList.checklistState === "done"}
                readOnly
              ></input>
                {this.props.checkList.checklistState === "done"
                  ? <div className="text"><del>&nbsp;{this.props.checkList.checklistContents}</del></div> 
                  : <div className="text">&nbsp;{this.props.checkList.checklistContents}</div>}
        </div>
        <hr></hr>
      </Fragment>
    );
  }
}

export default CheckContents;
