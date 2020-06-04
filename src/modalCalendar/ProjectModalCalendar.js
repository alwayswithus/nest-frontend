import React from "react";
import DayPicker, { DateUtils } from "react-day-picker";
import "react-day-picker/lib/style.css";
import "./ProjectModalCalendar.scss";
import moment, { now } from "moment";

export default class ModalCalendar extends React.Component {
  static defaultProps = {
    numberOfMonths: 2,
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
    this.props.callbackProjectSetting.modalStateUpdate();
    this.props.onClickConfirm(
      this.state.from,
      this.state.to,
      this.props.project.projectNo
    );
  }

  render() {
    const { from, to } = this.state;
    const modifiers = { start: from, end: to };
    return (
      <> 
        <div className="container projectRange ">
          <div className="calendar">
            <div className="calendar-header">
              <h6>프로젝트 마감일 지정</h6>

              <button
                type="button"
                className="close"
                onClick={this.props.callbackProjectSetting.modalStateUpdate}
              >
                &times;
              </button>
              <hr />
            </div>
            <div className="calendar-body">
            <b>
                {from && `${from.toLocaleDateString()}`}
                {!from && "시작일 미정"}&nbsp;~&nbsp;
              </b>

              <b>
                {!to && "마감일 미정"}
                {to && `${to.toLocaleDateString()}`}
              </b>
              
              <button
                type="button"
                onClick={this.onClickConfirm.bind(this)}
                className="confirm btn btn-info"
              >
                적용
              </button>
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