import React, { Component } from 'react';
import './projectset.scss';

class ProjectStatus extends Component {

  callbackChangeState(event) {
    this.props.callbackProjectSetting.changeState(this.props.project.projectNo, event.target.value);
  }

  render() {
    return (
      <div className="Important">
        <select className="imp-select" onChange={this.callbackChangeState.bind(this)}>
          {this.props.project.projectState === "계획됨" ? <option selected="selected" value="계획됨">계획됨</option> : <option value="계획됨">계획됨</option>}
          {this.props.project.projectState === "진행중" ? <option selected="selected" value="진행중">진행중</option> : <option value="진행중">진행중</option>}
          {this.props.project.projectState === "완료됨" ? <option selected="selected" value="완료됨">완료됨</option> : <option value="완료됨">완료됨</option>}
          {this.props.project.projectState === "상태없음" ? <option selected="selected" value="상태없음">상태없음</option> : <option value="상태없음">상태없음</option>}
        </select>
      </div>
    );
  }
};

export default ProjectStatus;
