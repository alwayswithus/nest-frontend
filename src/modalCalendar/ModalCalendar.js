import React from 'react';

// Import Moment and React Dates
import moment from 'moment';
import { DateRangePicker } from 'react-dates';

import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

export default class ModalCalendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: null,
            endDate: null,
            focusedInput: null,
        };
    }

    onCalendarSubmit() {
        this.props.onSubmit(this.state.startDate)
    }
    render() {
        return (
            <div>
                <DateRangePicker
                    onSubmit={this.onCalendarSubmit.bind(this)}
                    startDateId="startDate"
                    endDateId="endDate"
                    startDate={this.state.startDate}
                    endDate={this.state.endDate}
                    onDatesChange={({ startDate, endDate }) => { this.setState({ startDate, endDate }) }}
                    focusedInput={this.state.focusedInput}
                    onFocusChange={(focusedInput) => { this.setState({ focusedInput }) }}
                />
            </div>
        );
    }
}
