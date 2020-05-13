import React, {Component} from 'react';
import './projectset.scss';

class ProjectStatus extends Component {

  constructor() {
    super(...arguments);
    this.state = {
      state:'계획'
    }
  };

  onChangePointer = (e) => {
    this.setState({
      state:e.target.value
    })
  }
    render(){


    return (
            <div className="Important">
              <select className = 'imp-select' value={this.state.state} onChange = {this.onChangePointer}>
                <option value='계획'>계획 </option>
                <option value='진행'>진행 </option>
                <option value='완료'>완료 </option>
              </select>
            </div>
        );
    }
};

export default ProjectStatus;