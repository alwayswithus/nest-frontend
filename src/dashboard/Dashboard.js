import React from 'react';

import Navigator from './navigator/Navigator';
import DashboardTopbar from './dashboardtopbar/DashboardTopbar';
import './dashboard.scss';

const Dashboard = () => {
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
          <div className="col-sm-24 project-list">
            <i className="fas fa-arrow-down"></i>
            <h3>내가 속한 프로젝트 (1)</h3>
          </div>

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
                <a href="/"><i className="fas fa-cog fa-2x"></i></a>
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

          {/* 새 프로젝트 */}
          <div className="panel-group">
            <div className="panel panel-default new-project">
              <div className="panel-body new-project-body">
                <i className="fas fa-plus fa-2x"></i><br />
                <div className="new-project-name">새 프로젝트</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
