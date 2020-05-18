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
  
  EndDate(event) {
    console.log(document.getElementById("test").value)
    this.props.onSubmit(this.state.moment);  
    
  }

  render() {
    return (
      <div style={{display:'inline-block'}}>
        <DatetimePicker
          moment={this.state.moment}
          onChange={this.handleChange}
        />
        <input id="test" onSubmit={this.EndDate.bind(this)} type='text' value={this.state.moment.format('YYYY-MM-DD HH:mm')}/>
       
      </div>
    );
  }
}

export default ModalCalendarEnd;