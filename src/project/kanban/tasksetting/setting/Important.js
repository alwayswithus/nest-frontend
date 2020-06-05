import React, {Component} from 'react';
import './Setting.scss';
import NavbarCollapse from 'react-bootstrap/NavbarCollapse';

class Important extends Component {

  onChangePointer = (e) => {
    this.setState({
      star:e.target.value
    })
  }

    onClickSelectPoint(event) {
      this.props.taskCallbacks.updateTaskPoint(Number(event.target.id), this.props.params.taskListNo, this.props.params.taskNo)
    }
    render(){
      const fullIcon = <i style={{color: '#f6b6b4', transform: 'scale(0.7)'}} className="fas fa-circle"></i>;
      const emptyIcon = <i style={{color: '#f6b6b4', transform: 'scale(0.7)'}} className="far fa-circle"></i>;
      return (
        
            <div className="Important">
              <div className="container">
                <div className="dropdown">
                  <button
                    disabled={this.props.authUserRole === 3 ? true : false} 
                    className="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" style={{backgroundColor:'white'}}>
                    {this.props.taskItem.taskPoint == null ? "평가되지않음" : this.props.taskItem.taskPoint+"  "}
                    {this.props.taskItem.taskPoint != null ? 
                      <>{this.props.taskItem.taskPoint > 0 ? fullIcon : emptyIcon}
                      {this.props.taskItem.taskPoint > 1 ? fullIcon : emptyIcon}
                      {this.props.taskItem.taskPoint > 2 ? fullIcon : emptyIcon}
                      {this.props.taskItem.taskPoint > 3 ? fullIcon : emptyIcon}
                      {this.props.taskItem.taskPoint > 4 ? fullIcon : emptyIcon}</> : null}
                    <span className="caret"></span>
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <div id="null" onClick={this.onClickSelectPoint.bind(this)} className= "point-select">&nbsp;평가되지않음
                      </div>
                    </li>
                    <li>
                      <div onClick={this.onClickSelectPoint.bind(this)} id="0" className= "point-select">&nbsp;0&nbsp;&nbsp;&nbsp;
                        <i className="far fa-circle" id="0"></i>
                        <i className="far fa-circle" id="0"></i>
                        <i className="far fa-circle" id="0"></i>
                        <i className="far fa-circle" id="0"></i>
                        <i className="far fa-circle" id="0"></i>
                      </div>
                    </li>
                    <li>
                      <div id="1" onClick={this.onClickSelectPoint.bind(this)} className= "point-select">&nbsp;1&nbsp;&nbsp;&nbsp;
                        <i className="fas fa-circle" id="1"></i>
                        <i className="far fa-circle" id="1"></i>
                        <i className="far fa-circle" id="1"></i>
                        <i className="far fa-circle" id="1"></i>
                        <i className="far fa-circle" id="1"></i>
                      </div>
                    </li>
                    <li>
                      <div id="2" onClick={this.onClickSelectPoint.bind(this)} className= "point-select">&nbsp;2&nbsp;&nbsp;&nbsp;
                        <i className="fas fa-circle" id="2"></i>
                        <i className="fas fa-circle" id="2"></i>
                        <i className="far fa-circle" id="2"></i>
                        <i className="far fa-circle" id="2"></i>
                        <i className="far fa-circle" id="2"></i>
                      </div>
                    </li>
                    <li>
                      <div id="3" onClick={this.onClickSelectPoint.bind(this)} className= "point-select">&nbsp;3&nbsp;&nbsp;&nbsp;
                        <i className="fas fa-circle" id="3"></i>
                        <i className="fas fa-circle" id="3"></i>
                        <i className="fas fa-circle" id="3"></i>
                        <i className="far fa-circle" id="3"></i>
                        <i className="far fa-circle" id="3"></i>
                      </div>
                    </li>
                    <li>
                      <div id="4" onClick={this.onClickSelectPoint.bind(this)} className= "point-select">&nbsp;4&nbsp;&nbsp;&nbsp;
                        <i className="fas fa-circle" id="4"></i>
                        <i className="fas fa-circle" id="4"></i>
                        <i className="fas fa-circle" id="4"></i>
                        <i className="fas fa-circle" id="4"></i>
                        <i className="far fa-circle" id="4"></i>
                      </div>
                    </li>
                    <li>
                      <div id="5" onClick={this.onClickSelectPoint.bind(this)} className= "point-select">&nbsp;5&nbsp;&nbsp;&nbsp;
                        <i className="fas fa-circle" id="5"></i>
                        <i className="fas fa-circle" id="5"></i>
                        <i className="fas fa-circle" id="5"></i>
                        <i className="fas fa-circle" id="5"></i>
                        <i className="fas fa-circle" id="5"></i>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
        );
    }
};

export default Important;
