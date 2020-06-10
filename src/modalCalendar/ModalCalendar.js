import React from "react";
import moment from "moment";
import DateTime from "react-datetime";
import "./ModalCalendar.scss";
import "./react-datetime.css";

export default class ModalCalendar extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {
      from: null,
      to: null,
    };
  }

  // 날짜 지정 확인
  onClickConfirm() {
    const start = moment(this.state.from).format("YYYY-MM-DD HH:mm");
    const end = moment(this.state.to).format("YYYY-MM-DD HH:mm");
    if (start > end) {
      alert("마감날짜가 더 빠릅니다.");
      return;
    }
    this.props.taskCallbacks.modalStateUpdate();
    this.props.onClickConfirm(
      this.state.from,
      this.state.to,
      this.props.taskListIndex,
      this.props.taskIndex
    );
  }
  setFromDate(from) {
    this.setState({
      from: from._d,
    });
  }
  setToDate(to) {
    this.setState({
      to: to._d,
    });
  }

  render() {
    const from = {
      viewMode: "days",
      dateFormat: "YYYY-MM-DD",
      timeFormat: "HH:mm A",
      input: true,
      utc: false,
      closeOnSelect: false,
      closeOnTab: true,
    };

    const to = {
      viewMode: "days",
      dateFormat: "YYYY-MM-DD",
      timeFormat: "HH:mm A",
      input: true,
      utc: false,
      closeOnSelect: false,
      closeOnTab: true,
    };
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
              <button
                type="button"
                onClick={this.onClickConfirm.bind(this)}
                className="confirm btn btn-info"
              >
                적용
              </button>
              <hr />
              <div className="text">
                <div>
                  <b>시작일</b>
                </div>
                <div>
                  <b>마감일</b>
                </div>
              </div>
            </div>
            <div className="calendar-body">
              <div className="dateChoose">
                <DateTime
                  defaultValue={moment(this.props.from).format(
                    "YYYY-MM-DD HH:mm A"
                  )}
                  onChange={this.setFromDate.bind(this)}
                  open
                  {...from}
                />
              </div>

              <div className="dateChoose">
                <DateTime
                  defaultValue={moment(this.props.to).format(
                    "YYYY-MM-DD HH:mm A"
                  )}
                  onChange={this.setToDate.bind(this)}
                  open
                  {...to}
                />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  componentDidMount() {
    this.setState({
      from: this.props.from,
      to: this.props.to,
    });
  }
}
