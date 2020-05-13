import React, { useState, useEffect, useRef } from 'react';

import Navigator from './navigator/Navigator';
import DashboardTopbar from './dashboardtopbar/DashboardTopbar';
import './dashboard.scss';
import ProjectSetting from '../projectsetting/ProjectSetting';

export default class Dashboard extends React.Component {

  constructor() {
    super(...arguments);
    this.state = {
      panelGroup: "",
      arrow: <i className="fas fa-arrow-right"></i>,
      details: true,
      setOn:true
    }
  }

  onConfigClick() {
    this.setState({
      setOn:!this.state.setOn
    })
    if(this.state.setOn){
      document.getElementById('projectSet').style.display='block'
    } else{
      document.getElementById('projectSet').style.display='none'
    }
  }

  showDetails() {
    this.setState({
      details: !this.state.details
    })
    if (this.state.details) {
      this.setState({
        arrow: <i className="fas fa-arrow-down"></i>,
        panelGroup:
          <div className="panel-group">
            <div className="panel panel-default projects">
              <a href="/kanbanMain">
                <div className="panel-header">
                  <span className="project-title">
                    myiste 프로젝트
              </span>
                </div>
                <div className="panel-body">
                  <div className="btn-group">
                    <button type="button" className="btn btn-primary btn-xs">상태없음</button>
                    <button type="button" className="btn btn-primary dropdown-toggle btn-xs" data-toggle="dropdown">
                      <span className="caret"></span>
                    </button>
                    <ul className="dropdown-menu" role="menu">
                      <li><a href="#">계획됨</a></li>
                      <li><a href="#">진행중</a></li>
                      <li><a href="#">완료됨</a></li>
                      <li><a href="#">상태없음</a></li>
                    </ul>
                  </div>
                  <a href="#"><i onClick={this.onConfigClick.bind(this)} className="fas fa-cog fa-2x"></i></a>
                </div>
                <div className="panel-footer">
                  <span className="update-date"><h6>최초 업데이트 : 5월 27일 14:00</h6></span>
                  <span className="update-task"><h6>7/16개 업무</h6></span>
                  <div className="progress">
                    <div className="progress-bar progress-bar-danger" role="progressbar" aria-valuenow="70"
                      aria-valuemin="0" aria-valuemax="100" style={{ width: 100 + "%" }}>
                      100% Complete (danger)
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
      })
    }
    else {
      this.setState({
        arrow: <i className="fas fa-arrow-right"></i>,
        panelGroup: "",
        details: !this.state.details
      })
    }
  }

  render() {
    return (
      <div className="Dashboard">
        <div className="container-fluid">
          {/* 사이드바 */}
          <div className="sidebar">
            <Navigator />
          </div>

          {/* 탑바 */}
          <DashboardTopbar />

          {/* 메인 영역 */}
          <div className="mainArea">
            <div id="projectSet" style={{display:'none'}}>
              <ProjectSetting setOn={this.state.setOn}/>
            </div>
            <div className="col-sm-24 project-list" onClick={this.showDetails.bind(this)}>
              {this.state.arrow}
              <h3>내가 속한 프로젝트 (1)</h3>
            </div>

            {this.state.panelGroup}

            {/* 새 프로젝트 */}
            <div className="panel-group" >
              <div className="panel panel-default new-project" data-toggle="modal" data-target="#add-project" data-backdrop="static">
                <div className="panel-body new-project-body">
                  <i className="fas fa-plus fa-2x"></i><br />
                  <div className="new-project-name">새 프로젝트</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Project Modal */}
        <div className="modal fade" id="add-project" role="dialog" aria-labelledby="exampleModalCenterTitle">
          <div className="modal-dialog modal-dialog-centered">

            {/* Add Project Modal content */}
            <div className="modal-content">
              <form action="">

                {/* Add Project Modal header */}
                <div className="modal-header add-project-header">
                  <button type="button" className="close" data-dismiss="modal">&times;</button>
                  <h4 className="modal-title add-project-title">새 프로젝트</h4>
                </div>

                {/* Add Project Modal body */}
                <div className="modal-body add-project-body">
                  <div className="form-group">
                    <h5>제목</h5>
                    <input type="text" className="form-control modal-body-title" placeholder="예)웹사이트, 웹디자인" /><br />

                    <h5 style={{ display: "inline" }}>설명</h5> <h6 style={{ display: "inline" }}>(선택사항)</h6>
                    <input type="text" className="form-control modal-body-description" /><br />

                    <h5 style={{ display: "inline" }}>프로젝트 멤버</h5> <h6 style={{ display: "inline" }}>(선택사항)</h6>
                    <div className="add-project-member-list">
                      <div className="add-project-member-plus">
                        <button type="button" className="form-control add-project-member-button"><i className="fas fa-plus"></i></button>
                      </div>
                      <div className="add-project-member-profile">
                        <div className="join-project-member">
                          <span><i className="fas fa-user-circle fa-2x"></i></span>
                          <h4 style={{ display: "inline-block", marginTop: "0", marginLeft: "5px" }}>nest</h4>
                          <span className="join-project-member-close" style={{ marginLeft: "5px" }}><i className="fas fa-times fa-lg"></i></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Add Project Modal footer */}
                <div className="modal-footer add-project-footer">
                  <input type="submit" id="add-project-submit" className="btn btn-outline-primary btn-rounded" value="완료" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
