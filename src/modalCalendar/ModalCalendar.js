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
    console.log("modalCalendar:" + this.state.moment)
  }

  render() {
    return (
      <div>
        <ModalCalendarStart />
        <div style={{display:'inline-block', padding:'10px'}}/>
        <ModalCalendarEnd onSubmit={this.props.onSubmit}/>
      </div>
    );
  }
}

export default ModalCalendar;