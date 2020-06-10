import React, { Component } from "react";
import moment from "moment";
import "./Date.scss";

class Date extends Component {
  render() {
    const startDate = this.props.startDate;
    const endDate = this.props.endDate;
    return (
      <>
        <div className="task-date">
          {!startDate && !endDate && "일정 미정"}
          {startDate && !endDate && `${moment(startDate).format('YYYY-MM-DD')} ~`}
          {startDate && endDate && `${moment(startDate).format('YYYY-MM-DD')} ~ ${moment(endDate).format('YYYY-MM-DD')}`}
        </div>
      </>
    );
  }
}

export default Date;
