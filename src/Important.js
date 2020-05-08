import React, {Component} from 'react';
import './Main.scss';

class Important extends Component {

  constructor() {
    super(...arguments);
    this.state = {
      star:'별0개'
    }
  };

  onChangePointer = (e) => {
    this.setState({
      star:e.target.value
    })
  }
    render(){


    return (
            <div className="Important">
              <select className = 'imp-select'value={this.state.birthYear} onChange = {this.onChangePointer}>
                <option value='별0개'>별0개 </option>
                <option value='별1개'>별1개 </option>
                <option value='별2개'>별2개 </option>
                <option value='별3개'>별3개 </option>
                <option value='별4개'>별4개 </option>
                <option value='별5개'>별5개 </option>
              </select>
            </div>
        );
    }
};

export default Important;
