import React, { Component } from "react";
import "./Date.scss";

class Date extends Component {
  render() {
    const startDate = this.props.startDate;
    const endDate = this.props.endDate;
    return (
      <>
        <div className="task-date">
          {endDate && endDate ? (
            <b>
              {startDate} ~ {endDate}
            </b>
          ) : (
            <b>일정 미정</b>
          )}
        </div>
      </>
    );
  }
}

export default Date;
