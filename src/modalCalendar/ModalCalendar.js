import React from "react";

import DayPicker, { DateUtils } from "react-day-picker";
import "react-day-picker/lib/style.css";
import "./ModalCalendar.scss";
import moment, { now } from "moment";

export default class ModalCalendar extends React.Component {
  static defaultProps = {
    numberOfMonths: 1,
  };

  constructor(props) {
    super(props);
    this.handleDayClick = this.handleDayClick.bind(this);
    // this.handleResetClick = this.handleResetClick.bind(this);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      from:
        this.props.from === undefined
          ? null
          : this.props.from === null
          ? null
          : moment(this.props.from, moment.defaultFormat)._d,
      to:
        this.props.to === undefined
          ? null
          : this.props.to === null
          ? null
          : moment(this.props.to, moment.defaultFormat)._d,
    };
  }

  handleDayClick(day) {
    const range = DateUtils.addDayToRange(day, this.state);
    this.setState(range);
  }

  // 날짜 지정 확인
  onClickConfirm() {
    // this.props.onClickCalendar(); // 창 닫기
    this.props.taskCallbacks.modalStateUpdate();
    this.props.onClickConfirm(
      this.state.from,
      this.state.to,
      this.props.taskListIndex,
      this.props.taskIndex
    );
  }

  render() {
    const { from, to } = this.state;
    const modifiers = { start: from, end: to };
    return (
      <> 
        <div className="container Range">
          <div className="calendar">
            <div className="calendar-header">
              <h6>업무 마감일 지정</h6>

              <button
                type="button"
                className="close"
                onClick={this.props.taskCallbacks.modalStateUpdate}
              >
                &times;
              </button>
              <hr />
            </div>
            <div className="calendar-body">
              <p>
                {!from && !to && "날짜 미정"}
                {from && !to && `${from.toLocaleDateString()} ~`}
                {from &&
                  to &&
                  `${from.toLocaleDateString()} ~ ${to.toLocaleDateString()}`}
                <button
                  type="button"
                  onClick={this.onClickConfirm.bind(this)}
                  className="confirm btn btn-info"
                >
                  적용
                </button>
              </p>
              <DayPicker
                className="Selectable"
                numberOfMonths={this.props.numberOfMonths}
                selectedDays={[from, { from, to }]}
                modifiers={modifiers}
                onDayClick={this.handleDayClick}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
}
