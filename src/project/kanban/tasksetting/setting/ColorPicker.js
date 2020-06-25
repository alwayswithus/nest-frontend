import React from 'react';
import { CirclePicker } from 'react-color';

class ColorPicker extends React.Component {
    constructor(){
      super(...arguments)
      this.state = {
        color:'',
        circleSize:'28px'
      }
    }
    handleChange(color) { 
        this.props.taskCallbacks.updateTaskLabel(color.hex, this.props.taskListNo, this.props.taskNo)
    }
  render() {
    return (
      <>
      {this.props.authUserRole === 3 ?
        <CirclePicker color={this.props.taskItem.taskLabel} /> : 
        <CirclePicker
            color={this.props.taskItem.taskLabel}
            onChange = {this.handleChange.bind(this)}/>
      }
      </>
    )
  }
}

export default ColorPicker;