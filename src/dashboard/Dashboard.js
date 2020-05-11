import React, { useState, useEffect, useRef } from 'react';

import Navigator from './navigator/Navigator';
import DashboardTopbar from './dashboardtopbar/DashboardTopbar';
import './dashboard.scss';

const Dashboard = () => {
  const [panelGroup, setPanelGroup] = useState("");
  const [arrow, setArrow] = useState(<i className="fas fa-arrow-right"></i>);
  const [details, setDetails] = useState(true);
  const showDetails = () => {
    setDetails(!details);
    if (details) {
      setArrow(<i className="fas fa-arrow-down"></i>);
      setPanelGroup(
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
                <a href="#"><i className="fas fa-cog fa-2x"></i></a>
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
      );
    }
    else {
      setArrow(<i className="fas fa-arrow-right"></i>);
      setPanelGroup("");
    }
  }

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

          <div className="col-sm-24 project-list" onClick={showDetails}>
            {arrow}
            <h3>내가 속한 프로젝트 (1)</h3>
          </div>

          {panelGroup}

          {/* 새 프로젝트 */}
          <div className="panel-group" >
            <div className="panel panel-default new-project" data-toggle="modal" data-target="#add-project" data-backdrop="static">
              <div className="panel-body new-project-body">
                <i className="fas fa-plus fa-2x"></i><br />
                <div className="new-project-name">새 프로젝트</div>
              </div>
            </div>
            
            {/* Add Project Modal */}
            <div className="modal fade" id="add-project" role="dialog">
              <div className="modal-dialog">

                {/* Add Project Modal content */}
                <div className="modal-content">
                  <form action="">

                    {/* Add Project Modal header */}
                    <div className="modal-header add-project-header">
                      <button type="button" className="close" aria-hidden="true" data-dismiss="modal">&times;</button>
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
                        <div className="modal-body-member">
                          <a data-toggle="modal" href="#add-project-member" className="btn btn-info btn-lg">
                            <i className="fas fa-plus fa-sm"></i>
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Add Project Modal footer */}
                    <div className="modal-footer add-project-footer">
                      <input type="submit" id="add-project-submit" className="btn btn-default" value="완료" />
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Add Project Member Modal */}
            <div className="modal fade" id="add-project-member" role="dialog">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;
