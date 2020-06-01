import React from "react";

import DayPicker, { DateUtils } from "react-day-picker";
import "react-day-picker/lib/style.css";
import "./ModalCalendar.scss";
import moment, { now }  from 'moment';

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
      from: undefined,
      to: undefined
    };
  }

  handleDayClick(day) {
    const range = DateUtils.addDayToRange(day, this.state);
    this.setState(range);
  }

//   handleResetClick() {
//     this.setState(this.getInitialState());
//   }

  render() {
    const { from, to } = this.state;

    console.log("2 :"+this.state.from+' ~ '+this.state.to)
    
    console.log("1 :"+moment(this.state.from).format('YYYY-MM-DD hh:mm:ss') +' ~ '+moment(this.state.to).format('YYYY-MM-DD hh:mm:ss'))
    
    const modifiers = { start: from, end: to };
    return (
      <>
        <div
          className="container Range"
          style={this.props.open ? { display: "block" } : { display: "none" }}
        >
          <div className="calendar">
            <div className="calendar-header">
              <h6>업무 마감일 지정</h6>
              <button
                type="button"
                onClick={this.props.onClickCalendar}
                className="close"
              >
                &times;
              </button>
              <hr />
            </div>
            <div className="calendar-body">
            <p>
            {!from && !to && "날짜를 선택해 주세요"}
            {from && !to && `${from.toLocaleDateString()} ~`}
            {from && to && `${from.toLocaleDateString()} ~ ${to.toLocaleDateString()}`}
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
