import React from 'react';
import { CirclePicker } from 'react-color';

class ColorPicker extends React.Component {
    handleChange(color,event) { 
        console.log(color.hex + ' !!!!!!!! ');
    }
  render() {
    return <CirclePicker onChange = {this.handleChange.bind(this)}/>;
  }
}

export default ColorPicker;