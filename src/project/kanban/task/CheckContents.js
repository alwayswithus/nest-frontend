import React, { Component } from "react";
import "./CheckContents.scss";

class CheckContents extends Component {

  // checkList 체크
  doneCheckList(event) { 
    event.preventDefault();
    
    this.props.taskCallbacks.checklistStateUpdate(
      this.props.taskListNo,
      this.props.taskNo,
      this.props.checkList.checklistNo,
      this.props.checkList.checklistState,
    );
    
  }
  
  render() {
    return (
      <>
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
      </>
    );
  }


}

export default CheckContents;
