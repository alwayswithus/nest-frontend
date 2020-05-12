import React, {Component} from 'react';
import moment from 'moment';
import {DatetimePicker} from 'rc-datetime-picker';
import './picker.css'
import ModalCalendarStart from './ModalCalendarStart';
import ModalCalendarEnd from './ModalCalendarEnd';

class ModalCalendar extends Component {
  constructor() {
    super();
    this.state = {
      moment: moment(),
      start: moment(this.moment)
    };
  }

  handleChange = (moment) => {
    this.setState({
      moment
    });
  }

  render() {
    return (
      <div>
        <ModalCalendarStart />
        <ModalCalendarEnd />
      </div>
    );
  }
}

export default ModalCalendar;