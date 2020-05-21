import React from 'react';

import Navigator from '../navigator/Navigator';
import DashboardTopbar from './dashboardtopbar/DashboardTopbar';
import './dashboard.scss';
import ProjectSetting from './projectsetting/ProjectSetting';
import userData from './userData.json'
import update from 'react-addons-update';
import User from './User';

import ApiService from '../ApiService';

export default class Dashboard extends React.Component {

  constructor() {
    super(...arguments);
    this.state = {
      projects: null,                  // projects data
      users: userData,                 // user data

      url: "",                         // background image url
      project: [],                     // project
      members: [],                     // members in project
      message: null,

      details: true,                   // arrow 
      addProjectUserButton: false,     // add project user button
      setOn: true,                     // project setting open & close button
    }
  }

  // CallBack Background Image Setting 
  callbackChangeBackground(url) {
    this.setState({
      url: url
    })
  }

  // CallBack Project Setting Close Button 
  callbackCloseProjectSetting(setOn) {
    this.setState({
      setOn: setOn
    })
    document.getElementById('projectSet').style.display = 'none'
  }

  // CallBack Add Delete Member Function
  callbackAddDeleteMember(userNo, userName, userPhoto, projectNo) {
    const memberIndex = this.state.project.members.findIndex(member =>
      member.memberNo === userNo)

    const projectIndex = this.state.projects.findIndex(project =>
      project.projectNo === projectNo)

    let member = {
      memberNo: userNo,
      memberName: userName,
      memberPhoto: userPhoto
    }

    let newProject;
    if(this.state.project.members[memberIndex] && this.state.project.members[memberIndex].memberNo === userNo) {
      newProject = update(this.state.projects, {
        [projectIndex]: {
          members: {
            $splice: [[memberIndex, 1]]
          }
        }
      })
    }
    else {
      newProject = update(this.state.projects, {
        [projectIndex]: {
          members: {
            $push: [member]
          }
        }
      })
    }
    this.setState({
      projects: newProject,
      project: newProject[projectIndex]
    })
  }

  // Join And Exit Member in Project Function
  callbackJoinExitMember(userNo, userName, userPhoto) {
    const memberIndex = this.state.members.findIndex(member =>
      member.memberNo === userNo)

    let member = {
      memberNo: userNo,
      memberName: userName,
      memberPhoto: userPhoto
    }

    let members;

    if(this.state.members[memberIndex] && this.state.members[memberIndex].memberNo === userNo) {
      members = update(this.state.members, {
        $splice: [[memberIndex, 1]]
      })
    }
    else {
      members = update(this.state.members, {
        $push: [member]
      })
    }

    this.setState({
      members: members
    })
  }

  // CallBack Delete Member Function
  callbackDeleteMember(memberNo, projectNo) {
    const projectIndex = this.state.projects.findIndex(project =>
      project.projectNo === projectNo)

    const memberIndex = this.state.project.members.findIndex(
      (member) => member.memberNo === memberNo
    );

    let deleteMemberProject = update(this.state.projects, {
      [projectIndex]: {
        members: {
          $splice: [[memberIndex, 1]]
        }
      }
    })

    this.setState({
      projects: deleteMemberProject,
      project: deleteMemberProject[projectIndex]
    })
  }

  // Project Setting button Click Function
  onProjectSetting(projectNo) {
    const projectIndex = this.state.projects.findIndex(project => project.projectNo == projectNo);

    this.setState({
      setOn: !this.state.setOn,
      project: this.state.projects[projectIndex]
    })
    document.getElementById('projectSet').style.display = 'block'
  }

  // Add new Project Function
  onAddProjectSubmit(event) {
    event.preventDefault();

    let project = {
      projectNo: this.state.projects.length + 1,
      projectTitle: event.target.projectTitle.value,
      projectDesc: event.target.projectDesc.value,
      projectStart: Date.now(),
      projectEnd: "",
      projectState: "상태없음",
      members: this.state.members
    };

    let newProjects = update(this.state.projects, {
      $push: [project]
    });

    this.setState({
      projects: newProjects
    })

    document.getElementById('add-project').style.display = 'none'
    window.jQuery(document.body).removeClass("modal-open");
    window.jQuery(".modal-backdrop").remove();
  }

  // Projects hide and show Function
  showDetails() {
    this.setState({
      details: !this.state.details,
    })
  }

  // Delete Member in Porject Function
  onDelteMember(memberNo) {

    const memberIndex = this.state.members.findIndex(
      (member) => member.memberNo === memberNo
    );

    let deleteMember = update(this.state.members, {
      $splice: [[memberIndex, 1]]
    })

    this.setState({
      members: deleteMember
    })
  }

  // New Project Add Member Open Close Function
  onOpenCloseUser() {
    this.setState({
      addProjectUserButton: !this.state.addProjectUserButton
    })
  }

  // New Project Form Reset Function
  onStartNewProject() {
    document.getElementById("add-project-submit").reset();

    this.setState({
      members: [],
      addProjectUserButton: false
    })
  }

  render() {
    return (
      <div className="Dashboard">
        <div className="container-fluid">
          {/* Side Bar */}
          <div className="sidebar">
            <Navigator callbackChangeBackground={{ change: this.callbackChangeBackground.bind(this) }} />
          </div>

          {/* Top Bar */}
          <DashboardTopbar />

          {/* Main Area */}
          <div id="projectSet" style={{ display: 'none' }}>
            <ProjectSetting
              users={this.state.users}
              project={this.state.project}
              callbackProjectSetting={{
                close: this.callbackCloseProjectSetting.bind(this),
                addDeleteMember: this.callbackAddDeleteMember.bind(this),
                deleteMember: this.callbackDeleteMember.bind(this)
              }} />
          </div>
          <div className="mainArea" style={{ backgroundImage: `url(${this.state.url})` }}>
            <div className="col-sm-24 project-list" onClick={this.showDetails.bind(this)}>
              {this.state.details ? <i className="fas fa-arrow-down"></i> : <i className="fas fa-arrow-right"></i>}
              <h3>내가 속한 프로젝트 ({this.state.projects && this.state.projects.length})</h3>
            </div>

            {/* Projects */}
            <div className="panel-group">
              {this.state.details ? this.state.projects && this.state.projects.map(project =>
                <div key={project.projectNo} className="panel panel-default projects">
                  <a href="/nest/kanbanMain">
                    <div className="panel-header">
                      <span className="project-title">
                        {project.projectTitle}
                      </span>
                    </div>
                    <div className="panel-body">
                      <a href="#">
                        <div className="btn-group">
                          <button type="button" className="btn btn-primary dropdown-toggle btn-xs project-state-change" data-toggle="dropdown">
                            &nbsp;&nbsp;{project.projectState}
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
                        <i className="fas fa-cog fa-lg" onClick={this.onProjectSetting.bind(this, project.projectNo)} ></i>
                      </a>
                    </div>
                    <div className="panel-footer">
                      <span className="update-date"><h6>{project.projectStart} ~ {project.projectEnd}</h6></span><br></br>
                      <span className="update-task"><h6>7/16개 업무</h6></span>
                      <div className="progress">
                        <div className="progress-bar progress-bar-danger" role="progressbar" aria-valuenow="70"
                          aria-valuemin="0" aria-valuemax="100" style={{ width: 100 + "%" }}>
                          100% Complete (danger)
                        </div>
                      </div>
                    </div>
                  </a>
                </div>) : ""}
            </div>

            {/* 새 프로젝트 */}
            <div className="panel-group" >
              <div className="panel panel-default new-project" onClick={this.onStartNewProject.bind(this)} data-toggle="modal" data-target="#add-project">
                <div className="panel-body new-project-body">
                  <i className="fas fa-plus fa-2x"></i><br />
                  <div className="new-project-name">새 프로젝트</div>
                </div>
              </div>

              {/* Add Project Modal */}
              <div className="modal fade" id="add-project" role="dialog" aria-labelledby="exampleModalCenterTitle">
                <div className="modal-dialog modal-dialog-centered">

                  {/* Add Project Modal content */}
                  <div className="modal-content">
                    <form id="add-project-submit" onSubmit={this.onAddProjectSubmit.bind(this)}>
                      <div className="form group">
                        {/* Add Project Modal header */}
                        <div className="modal-header add-project-header">
                          <button type="button" className="close" data-dismiss="modal" aria-label="Close">&times;</button>
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

                            {/* Open and Close User List Button */}
                            <div className="add-project-member-list">
                              <div className="add-project-member-plus">
                                <button onClick={this.onOpenCloseUser.bind(this)} type="button" className="form-control add-project-member-button"><i className="fas fa-plus"></i></button>
                              </div>

                              {/* Member List */}
                              <div className="join-project-member">
                                {this.state.members && this.state.members.map(member =>
                                  <div className="Member" key={member.memberNo}>
                                    <img src={member.memberPhoto} className="img-circle" alt={member.memberPhoto} />
                                    <span>{member.memberName}</span>
                                    <span className="delete-member" onClick={this.onDelteMember.bind(this, member.memberNo)}>
                                      <i className="fas fa-times"></i>
                                    </span>
                                  </div>)}
                              </div>
                            </div>

                            {/* Add Project Member select */}
                            {this.state.addProjectUserButton ?
                              <div className="container card-member">
                                <div className="card">
                                  <div className="card-header">
                                    <h6 style={{ display: "inline-block", fontSize: "14px", fontWeight: "bold" }}>멤버</h6>
                                    <button type="button" onClick={this.onOpenCloseUser.bind(this)} className="close" style={{ lineHeight: "35px" }}>&times;</button>
                                    <hr style={{ marginTop: "5px", marginBottom: "10px", borderColor: "#E3E3E3" }} />
                                  </div>
                                  <div className="card-body">
                                    <input type="text" className="form-control find-member" placeholder="이름 혹은 이메일로 찾기" />

                                    {/* All Users */}
                                    <div className="invite-card-member-list">
                                      { this.state.users.map(user =>
                                        <User key={ user.userNo } user={ user } members={ this.state.members } 
                                        callbackUser={{ joinExitMember: this.callbackJoinExitMember.bind(this) }} />) 
                                      }
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
                          <input type="submit" id="add-project-submit" className="btn btn-outline-primary btn-rounded" value="OK" />
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    ApiService.fetchDashboard()
      .then(response => {
        this.setState({
          projects: response.data.data
        })
      })
  }
}