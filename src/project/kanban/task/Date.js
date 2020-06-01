import React, { Component } from "react";
import "./Date.scss";

class Date extends Component {
  render() {
    const startDate = this.props.startDate;
    const endDate = this.props.endDate;
    return (
      <>
        <div className="task-date">
          {!startDate && !endDate && "일정 미정"}
          {startDate && !endDate && `${startDate} ~`}
          {startDate && endDate && `${startDate} ~ ${endDate}`}
        </div>
      </>
    );
  }
}

export default Date;
