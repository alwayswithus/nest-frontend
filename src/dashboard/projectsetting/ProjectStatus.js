import React, { Component } from 'react';
import './ProjectStatus.scss';

class ProjectStatus extends Component {

  callbackChangeState(event) {
    this.props.callbackProjectSetting.changeState(this.props.project.projectNo, event.target.value);
  }

  render() {

    return (
      <div className="Important">
        <div className="dropdown">
          <button 
            className="btn btn-primary dropdown-toggle" 
            type="button" 
            data-toggle="dropdown"
            style={this.props.project.projectState === "상태없음" ?
            { backgroundColor: "#D9534F" } : this.props.project.projectState === "계획됨" ?
              { backgroundColor: "orange" } : this.props.project.projectState === "진행중" ?
                { backgroundColor: "#5CB85C" } : this.props.project.projectState === "완료됨" ?
                  { backgroundColor: "#337AB7" } : null}>
            {this.props.project.projectState}
            <span className="caret"></span></button>
          <ul className="dropdown-menu">
            <div className="dropdown-list-contents">
              <span className="status-name">계획됨</span>
              <div className="status-color">
                <i className="fas fa-circle fa-xs" style={{ color: "orange" }}></i>
              </div>
            </div>
            <div className="dropdown-list-contents">
              <span className="status-name">진행중</span>
              <div className="status-color">
                <i className="fas fa-circle fa-xs" style={{ color: "#5CB85C" }}></i>
              </div>
            </div>
            <div className="dropdown-list-contents">
              <span className="status-name">완료됨</span>
              <div className="status-color">
                <i className="fas fa-circle fa-xs" style={{ color: "#337AB7" }}></i>
              </div>
            </div>
            <div className="dropdown-list-contents">
              <span className="status-name">상태없음</span>
              <div className="status-color">
                <i className="fas fa-circle fa-xs" style={{ color: "#D9534F" }}></i>
              </div>
            </div>
          </ul>
        </div>
      </div>
    );
  }
};

export default ProjectStatus;
