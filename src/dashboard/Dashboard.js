import React from 'react';

import Navigator from '../navigator/Navigator';
import DashboardTopbar from './dashboardtopbar/DashboardTopbar';
import './dashboard.scss';
import ProjectSetting from './projectsetting/ProjectSetting';
import projectData from './projectData.json';
import userData from './userData.json';
import update from 'react-addons-update';

export default class Dashboard extends React.Component {

  constructor() {
    super(...arguments);
    this.state = {
      
      projects: projectData,          // 프로젝트 데이터
      users: userData,                // 사용자 데이터
      
      members: [],                    // 각 프로젝트마다 참여하는 사용자들 목록 변수
      url: "",                        // 배경화면 상태 변수
      
      details: true,                  // 내가 속한 프로젝트를 클릭할 때마다 변하는 화살표 상태 변수
      addProjectMemberButton: false,  // 프로젝트에 참여하길 원하는 사용자들을 추가하기 위한 버튼 클릭 상태 변수
      setOn: true                     // 프로젝트 설정을 보여주고 꺼주기 위한 상태 변수
    }
  }

  onConfigClick() {
    this.setState({
      setOn: !this.state.setOn
    })
    document.getElementById('projectSet').style.display = 'block'
  }

  callbackCloseProjectSetting(setOn) {
     this.setState({
      setOn: setOn
    })
    document.getElementById('projectSet').style.display = 'none'
  }

  // 배경화면 설정 함수
  callbackChangeBackground(url) {
    console.log(url)
    this.setState({
      url: url
    })
  }

  // 화살표 펼치기, 숨기기 함수
  showDetails() {
    this.setState({
      details: !this.state.details
    })
  }

  // ProjectMember 추가 버튼 이벤트 함수
  onAddProjectMember() {
    this.setState({
      addProjectMemberButton: !this.state.addProjectMemberButton
    })
  }

  // 새 프로젝트 추가 함수
  onAddProjectSubmit(event) {
    event.preventDefault();

    let project = {
      project_no: this.state.projects.length + 1,
      project_title: event.target.projectTitle.value,
      project_desc: event.target.projectDesc.value,
      project_start: Date.now(),
      project_end: "",
      project_status: "상태없음"
    };

    let newProjects = update(this.state.projects, {
      $push: [project]
    });

    this.setState({
      projects: newProjects
    })
  }

  // 프로젝트에 참여하길 원하는 멤버들을 클릭할 때 발생하는 이벤트 함수
  onCheckPoint(userNo, userName, userPhoto) {
    
    let member = {
      member_no: userNo,
      member_name: userName,
      member_photo: userPhoto
    }

    let newMember = update(this.state.members, {
        $push: [member] 
    })

    this.setState({
      members: newMember
    })    
  }

  // 프로젝트 멤버 삭제하는 함수
  onDelteMember(memberNo) {
    const memberIndex = this.state.members.findIndex(
      (member) => member.member_no == memberNo
    );
    console.log(memberIndex);

   let deleteMember = update(this.state.members, {
      $splice: [[memberIndex, 1]]
    })

    this.setState({
      members: deleteMember
    })
  }

  // 새 프로젝트 Modal 제출 후 닫기 함수
  onClose() {
    document.getElementById('add-project').style.display = 'none'
    window.jQuery(document.body).removeClass("modal-open");
    window.jQuery(".modal-backdrop").remove();
  }

  render() {
    return (
      <div className="Dashboard">
        <div className="container-fluid">
          {/* 사이드바 */}
          <div className="sidebar">
            <Navigator callbackChangeBackground={{ change: this.callbackChangeBackground.bind(this) }} />
          </div>

          {/* 탑바 */}
          <DashboardTopbar />

          {/* 메인 영역 */}
          <div id="projectSet" style={{ display: 'none' }}>
            <ProjectSetting callbackCloseProjectSetting={ {close: this.callbackCloseProjectSetting.bind(this)} } />
          </div>
          <div className="mainArea" style={{ backgroundImage: `url(${this.state.url})` }}>
            <div className="col-sm-24 project-list" onClick={this.showDetails.bind(this)}>
              {this.state.details ? <i className="fas fa-arrow-down"></i> : <i className="fas fa-arrow-right"></i>}
              <h3>내가 속한 프로젝트 ({this.state.projects.length})</h3>
            </div>

            {/* Projects */}
            <div className="panel-group">
              {this.state.details ? this.state.projects.map((project) =>
                <div key={project.project_no} className="panel panel-default projects">
                  <a href="/kanbanMain">
                    <div className="panel-header">
                      <span className="project-title">
                        {project.project_title}
                      </span>
                    </div>
                    <div className="panel-body">
                      <a href="#">
                        <div className="btn-group">
                          <button type="button" className="btn btn-primary dropdown-toggle btn-xs project-state-change" data-toggle="dropdown">
                            &nbsp;&nbsp;{project.project_status}
                            <span className="caret"></span>
                          </button>
                          <ul className="dropdown-menu" role="menu">
                            <li>계획됨</li>
                            <li>진행중</li>
                            <li>완료됨</li>
                            <li>상태없음</li>
                          </ul>
                        </div>
                      </a>

                      {/* Project Setting Click */}
                      <a href="#">
                        <i className="fas fa-cog fa-lg" onClick={this.onConfigClick.bind(this)}></i>
                      </a>
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
                </div>) : ""
              }
            </div>

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
        <div className="modal fade" id="add-project" role="dialog" aria-labelledby="exampleModalCenterTitle" style={{ display: 'none' }}>
          <div className="modal-dialog modal-dialog-centered">

            {/* Add Project Modal content */}
            <div className="modal-content">
              <form onSubmit={this.onAddProjectSubmit.bind(this)}>
                <div className="form group">
                  {/* Add Project Modal header */}
                  <div className="modal-header add-project-header">
                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                    <h4 className="modal-title add-project-title" >새 프로젝트</h4>
                  </div>

                  {/* Add Project Modal body */}
                  <div className="modal-body add-project-body">

                    <div className="form-group">
                      <h5>제목</h5>
                      <input type="text" name="projectTitle" className="form-control modal-body-title" placeholder="예)웹사이트, 웹디자인" /><br />

                      <h5 style={{ display: "inline" }}>설명</h5> <h6 style={{ display: "inline" }}>(선택사항)</h6>
                      <input type="text" name="projectDesc" className="form-control modal-body-description" /><br />

                      <h5 style={{ display: "inline" }}>프로젝트 멤버</h5> <h6 style={{ display: "inline" }}>(선택사항)</h6>
                      <div className="add-project-member-list">
                        <div className="add-project-member-plus">
                          <button onClick={this.onAddProjectMember.bind(this)} type="button" className="form-control add-project-member-button"><i className="fas fa-plus"></i></button>
                        </div>
                        {/* 프로젝트 참여 멤버 */}
                        <div className="join-project-member">
                          { this.state.members.map(member => 
                          <div className="Member" key={ member.member_no }>                        
                            <img src={ member.member_photo } className="img-circle" alt={ member.member_photo } />
                            <span>{ member.member_name }</span>
                            <span className="delete-member" onClick={ this.onDelteMember.bind(this, member.member_no) }>
                              <i className="fas fa-times"></i>
                            </span>
                          </div>) }            
                        </div>
                      </div>

                      {/* Add Project Member select */}
                      {this.state.addProjectMemberButton ?
                        <div className="container card-member">
                          <div className="card">
                            <div className="card-header">
                              <h6 style={{ display: "inline-block", fontSize: "14px", fontWeight: "bold" }}>멤버</h6>
                              <button type="button" className="close" style={{ lineHeight: "35px" }} onClick={this.onAddProjectMember.bind(this)} >&times;</button>
                              <hr style={{ marginTop: "5px", marginBottom: "10px", borderColor: "#E3E3E3" }} />
                            </div>
                            <div className="card-body">
                              <input type="text" className="form-control find-member" placeholder="이름 혹은 이메일로 찾기" />
                              <div className="invite-card-member-list">
                                
                                { this.state.users.map(user => 
                                <div className="invite-card-member" key={ user.user_no }
                                  id={ user.user_no } onClick={ this.onCheckPoint.bind(this, user.user_no, user.user_name, user.user_photo) }>
                                  <img src={ user.user_photo } className="img-circle" alt={ user.user_photo }/>
                                  <span>{ user.user_name }</span>
                                </div>) }
                                
                                <div className="invite-member">
                                  <i className="fas fa-user-plus fa-2x"></i>
                                  <span>멤버 초대하기</span>
                                </div> 
                              </div>
                            </div>
                          </div>
                        </div> : ""}
                    </div>
                  </div>

                  {/* Add Project Modal footer */}
                  <div className="modal-footer add-project-footer">
                    <input type="submit" id="add-project-submit" onClick={this.onClose.bind(this)} className="btn btn-outline-primary btn-rounded" value="OK" />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}