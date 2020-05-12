import React, {Component} from 'react';
import moment from 'moment';
import {DatetimePicker} from 'rc-datetime-picker';
import './picker.css'

class ModalCalendarEnd extends Component {
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
      <div style={{display:'inline-block'}}>
        <DatetimePicker
          moment={this.state.moment}
          onChange={this.handleChange}
        />
        <input type='text' value={this.state.moment.format('YYYY-MM-DD HH:mm')} readOnly />
       

      </div>
    );
  }
}

export default ModalCalendarEnd;