import React from 'react';
import { AlertList } from "react-bs-notifier";
import moment from 'moment';

import Navigator from '../navigator/Navigator';
import DashboardTopbar from './dashboardtopbar/DashboardTopbar';
import './dashboard.scss';
import ProjectSetting from './projectsetting/ProjectSetting';
import userData from './userData.json'
import update from 'react-addons-update';
import User from './User';

import ApiService from '../ApiService';

const API_URL = "http://localhost:8080/nest";
const API_HEADERS = {
  'Content-Type': 'application/json'
}

export default class Dashboard extends React.Component {

  constructor() {

    // 세션 체크...
    if(!sessionStorage.getItem("authUserNo")){
      window.location.href = "/nest/";
      return;
    }

    super(...arguments);
    this.state = {
      projects: null,                                               // projects data
      users: null,                                                  // user data

      url: window.sessionStorage.getItem("authUserBg"),             // background image url
      project: [],                                                  // project
      members: [],                                                  // members in project
      message: null,

      details: true,                                                // arrow 
      addProjectUserButton: false,                                  // add project user button
      inviteMember: false,                                          // invite member open & close
      inviteMemberEmail: "",
      inviteMemberName: "",
      setOn: true,                                                  // project setting open & close button
      isMemberEmailValid: false,                                    // member email valid
      isProjectTitleValid: false,                                   // project title valid
      isNotEmptyValid: false, 

      position: "top-right",
			alerts: [],
			timeout: 2000,
			newMessage: "초대 메일이 성공적으로 발송되었습니다."
    }
  }

  // CallBack Background Image Setting 
  callbackChangeBackground(url) {

    let authUser = {
      userNo: window.sessionStorage.getItem("authUserNo"),
      userBg: url
    }

    fetch(`${API_URL}/api/user/backgroundChange`, {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify(authUser)
    })
    
    sessionStorage.setItem("authUserBg", url)
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
      member.userNo === userNo)

    const projectIndex = this.state.projects.findIndex(project =>
      project.projectNo === projectNo)

    let member = {
      userNo: userNo,
      userName: userName,
      userPhoto: userPhoto
    }

    let newProject;
    if (this.state.project.members[memberIndex] && this.state.project.members[memberIndex].userNo === userNo) {
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
      member.userNo === userNo)

    let member = {
      userNo: userNo,
      userName: userName,
      userPhoto: userPhoto
    }

    let members;

    if (this.state.members[memberIndex] && this.state.members[memberIndex].userNo === userNo) {
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
      (member) => member.userNo === memberNo
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

  // CallBack Change State Function
  callbackChangeState(projectNo, state) {
    const projectIndex = this.state.projects.findIndex(project => project.projectNo === projectNo);

    let newProject = update(this.state.projects, {
      [projectIndex]: {
        projectState: { $set: state }
      }
    })

    this.setState({
      projects: newProject,
      project: newProject[projectIndex]
    })
  }

  // CallBack Change Title Function
  callbackProjectTitleChange(projectNo, title) {
    const projectIndex = this.state.projects.findIndex(project => project.projectNo === projectNo);

    let newProject = update(this.state.projects, {
      [projectIndex]: {
        projectTitle: { $set: title }
      }
    })

    this.setState({
      projects: newProject,
      project: newProject[projectIndex]
    })
  }

  // CallBack Chnage Desc Function
  callbackProjectDescChange(projectNo, desc) {
    const projectIndex = this.state.projects.findIndex(project => project.projectNo === projectNo);

    let newProject = update(this.state.projects, {
      [projectIndex]: {
        projectDesc: { $set: desc }
      }
    })

    this.setState({
      projects: newProject,
      project: newProject[projectIndex]
    })
  }

  // CallBack Invite Member Function
  callbackInviteMember(projectNo, memberEmail, memberName) {
    const projectIndex = this.state.projects.findIndex(project => project.projectNo === projectNo);

    let member = {
      userNo: this.state.users.length + 1,
      userName: memberName !== "" ? memberName : memberEmail,
      userPhoto: "assets/images/unnamed.jpg"
    }

    let newProject = update(this.state.projects, {
      [projectIndex]: {
        members: {
          $push: [member]
        }
      }
    })

    this.setState({
      projects: newProject,
      project: newProject[projectIndex]
    })
  }

  // State Change Function
  onStateChange(projectNo, state) {
    const projectIndex = this.state.projects.findIndex(project => project.projectNo === projectNo);

    let newProject = update(this.state.projects, {
      [projectIndex]: {
        projectState: { $set: state }
      }
    })

    this.setState({
      projects: newProject,
      project: newProject[projectIndex]
    })
  }

  // Project Setting button Click Function
  onProjectSetting(projectNo) {
    const projectIndex = this.state.projects.findIndex(project => project.projectNo === projectNo);

    this.setState({
      setOn: !this.state.setOn,
      project: this.state.projects[projectIndex]
    })
    document.getElementById('projectSet').style.display = 'block'
  }

  // Add new Project Function
  onAddProjectSubmit(event) {
    event.preventDefault();


    let projectTitle = event.target.projectTitle.value;
    let projectDesc = event.target.projectDesc.value;
    let startDate = moment(new Date()).format('YYYY-MM-DD h:mm');
    let members = this.state.members;

    let project = {
      projectNo: null,
      projectTitle: projectTitle,
      projectDesc: projectDesc,
      projectStart: startDate,
      projectEnd: null,
      projectState: "상태없음",
      members: members
    };

    fetch(`${API_URL}/api/dashboard/add/${window.sessionStorage.getItem("authUserNo")}`, {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify(project)
    })
    .then(response => response.json())
    .then(json => {
      let newProjects = update(this.state.projects, {
        $push: [json.data]
      });
  
      this.setState({
        projects: newProjects
      })
    })
   
    

    document.getElementById('add-project').style.display = 'none'
    window.jQuery(document.body).removeClass("modal-open");
    window.jQuery(".modal-backdrop").remove();
  }

  // Invite Member Input Email Function
  onInputInviteMemberEmail(event) {

    const emailRegExp = /^[\w-]+(\.[\w-]+)*@([a-z0-9-]+(\.[a-z0-9-]+)*?\.[a-z]{2,6}|(\d{1,3}\.){3}\d{1,3})(:\d{4})?$/;

    if(event.target.value.match(emailRegExp)) {
      this.setState({
        isMemberEmailValid: true,
        inviteMemberEmail: event.target.value,
        isNotEmptyValid: false
      })
    }
    else {
      this.setState({
        isMemberEmailValid: false,
        inviteMemberEmail: event.target.value,
        isNotEmptyValid: true
      })
    }
  }

  // Invite Member Input Name Function
  onInputInviteMemberName(event) {
    this.setState({
      inviteMemberName: event.target.value
    })
  }

  // Invite Member Function
  onInviteMemberButton(memberEmail, memberName) {
    
    let member = {
      userNo: this.state.users.length + 1,
      userName: memberName !== "" ? memberName : memberEmail,
      userEmail: memberEmail,
      userPhoto: "assets/images/arrowloding.jpg"
    }

    const newAlert ={
			id: (new Date()).getTime(),
			type: "success",
			message: this.state.newMessage
		};

    fetch(`${API_URL}/api/user/invite/`, {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify(member)
    })
    .then(response => response.json())
    .then(json => {
      let members = update(this.state.members, {
        $push: [json.data]
      })

      let users = update(this.state.users, {
        $push: [json.data]
      })
      this.setState({
        members: members,
        users: users,
        alerts: [...this.state.alerts, newAlert]
      })
    })
  }

  // New Project Title Validation Function
  onValidateProjectTitle(event) {
    const blank_pattern = /[\s]/g;

    if(event.target.value.length > 0 && blank_pattern.test(event.target.value) === false) {
      this.setState({
        isProjectTitleValid: true,
        isNotEmptyValid: false
      })
    }
    else {
      this.setState({
        isProjectTitleValid: false,
        isNotEmptyValid: true
      })
    }
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
      (member) => member.userNo === memberNo
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
      addProjectUserButton: !this.state.addProjectUserButton,
      inviteMember: false,
      inviteMemberEmail: "",
      inviteMemberName: "",
    })
  }

  // Invite Member Open and Close Function
  onInviteMember() {
    this.setState({
      addProjectUserButton: !this.state.addProjectUserButton,
      inviteMember: !this.state.inviteMember,
      inviteMemberEmail: "",
      inviteMemberName: "",
    })
  }

  // New Project Form Reset Function
  onStartNewProject() {
    document.getElementById("add-project-submit").reset();

    this.setState({
      members: [],
      addProjectUserButton: false,
      inviteMember: false
    })
  }

  // Invite Member Alert Function
  onAlertDismissed(alert) {
		const alerts = this.state.alerts;

		// find the index of the alert that was dismissed
		const idx = alerts.indexOf(alert);

		if (idx >= 0) {
			this.setState({
				// remove the alert from the array
				alerts: [...alerts.slice(0, idx), ...alerts.slice(idx + 1)]
			});
		}
	}

  render() {
    return (
      <div className="Dashboard">
        <AlertList
					position={this.state.position}
					alerts={this.state.alerts}
					timeout={this.state.timeout}
					dismissTitle="cancel"
					onDismiss={this.onAlertDismissed.bind(this)}
			  />
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
                deleteMember: this.callbackDeleteMember.bind(this),
                changeState: this.callbackChangeState.bind(this),
                changeTitle: this.callbackProjectTitleChange.bind(this),
                changeDesc: this.callbackProjectDescChange.bind(this),
                inviteMember: this.callbackInviteMember.bind(this)
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
                          <button type="button" className="btn btn-primary dropdown-toggle btn-xs project-state-change"
                            data-toggle="dropdown"
                            style={project.projectState === "상태없음" ?
                              { backgroundColor: "#C7C7C7" } : project.projectState === "계획됨" ?
                                { backgroundColor: "orange" } : project.projectState === "진행중" ?
                                  { backgroundColor: "#5CB85C" } : project.projectState === "완료됨" ?
                                    { backgroundColor: "#337AB7" } : ""}>
                            &nbsp;&nbsp;{project.projectState}
                            <span className="caret"></span>
                          </button>
                          <div className="dropdown-menu" role="menu">
                            <div className="dropdown-list">
                              <div className="dropdown-list-contents" onClick={this.onStateChange.bind(this, project.projectNo, "계획됨")}>
                                <span className="status-name">
                                  계획됨
                                </span>
                                <div className="status-color">
                                  <i className="fas fa-circle fa-xs" style={{ color: "orange" }}></i>
                                </div>
                              </div>
                              <div className="dropdown-list-contents" onClick={this.onStateChange.bind(this, project.projectNo, "진행중")}>
                                <span className="status-name">
                                  진행중
                                </span>
                                <div className="status-color">
                                  <i className="fas fa-circle fa-xs" style={{ color: "#5CB85C" }}></i>
                                </div>
                              </div>
                              <div className="dropdown-list-contents" onClick={this.onStateChange.bind(this, project.projectNo, "완료됨")}>
                                <span className="status-name">
                                  완료됨
                                </span>
                                <div className="status-color">
                                  <i className="fas fa-circle fa-xs" style={{ color: "#337AB7" }}></i>
                                </div>
                              </div>
                              <div className="dropdown-list-contents" onClick={this.onStateChange.bind(this, project.projectNo, "상태없음")}>
                                <span className="status-name">
                                  상태없음
                                </span>
                                <div className="status-color">
                                  <i className="fas fa-circle fa-xs" style={{ color: "#C7C7C7" }}></i>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </a>

                      {/* Project Setting Click */}
                      <a href="#">
                        <i className="fas fa-cog fa-lg" onClick={this.onProjectSetting.bind(this, project.projectNo)} ></i>
                      </a>
                    </div>
                    <div className="panel-footer">
                      <span className="update-task" style={{width: "100%"}}><h6>7/16개 업무</h6></span>
                      <span className="update-date" style={{width: "100%"}}><h6>{project.projectStart} ~ {project.projectEnd}</h6></span><br></br>
                      <div className="progress">
                        {project.projectState === "완료됨" ?
                          <div className="progress-bar progress-bar" role="progressbar" aria-valuenow="70"
                            aria-valuemin="0" aria-valuemax="100" style={{ width: 100 + "%" }}>100%</div> :
                          project.projectState === "진행중" ?
                            <div className="progress-bar progress-bar-success" role="progressbar" aria-valuenow="70"
                              aria-valuemin="0" aria-valuemax="100" style={{ width: 50 + "%" }}>50%</div> :
                            project.projectState === "계획됨" ?
                              <div className="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="70"
                                aria-valuemin="0" aria-valuemax="100" style={{ width: 10 + "%" }}>10%</div> :
                              ""}
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
                            <input type="text" name="projectTitle" onChange={this.onValidateProjectTitle.bind(this)}className="form-control modal-body-title" placeholder="예)웹사이트, 웹디자인" />
                              {this.state.isNotEmptyValid ? <i className="fas fa-exclamation fa-xs" style={{margin: "10px", color: "#D5493B"}}>  공백은 허용되지 않습니다.</i> : ""}<br />
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
                                  <div className="Member" key={member.userNo}>
                                    <img src={member.userPhoto} className="img-circle" alt={member.userPhoto} />
                                    <span>{member.userName}</span>
                                    <span className="delete-member" onClick={this.onDelteMember.bind(this, member.userNo)}>
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
                                      {this.state.users && this.state.users.map(user =>
                                        <User key={user.userNo} user={user} members={this.state.members}
                                          callbackUser={{ joinExitMember: this.callbackJoinExitMember.bind(this) }} />)
                                      }
                                      <div className="invite-member" onClick={this.onInviteMember.bind(this)}>
                                        <i className="fas fa-user-plus fa-2x"></i>
                                        <span>멤버 초대하기</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div> : ""}

                            {/* Add Project Member Invite */}
                            {this.state.inviteMember ?
                              <div className="container card-member">
                                <div className="card">
                                  <div className="card-header">
                                    <div className="back-select-user-button" onClick={this.onInviteMember.bind(this)}>
                                      <i className="fas fa-chevron-left"></i>
                                    </div>
                                    <h6 style={{ display: "inline-block", fontSize: "14px", fontWeight: "bold" }}>멤버 초대하기</h6>
                                    <hr style={{ marginTop: "5px", marginBottom: "10px", borderColor: "#E3E3E3" }} />
                                  </div>
                                  <div className="card-body">
                                    <h6 style={{ fontSize: "14px", fontWeight: "bold" }}>이메일</h6>
                                    <input type="text" className="form-control find-member" name="userEmail"
                                      onChange={this.onInputInviteMemberEmail.bind(this)}
                                      value={this.state.inviteMemberEmail} placeholder="yong80211@gmail.com" />
                                    <h6 style={{ fontSize: "14px", fontWeight: "bold" }}>이름 (선택사항)</h6>
                                    <input type="text" name="userName" className="form-control find-member"
                                      onChange={this.onInputInviteMemberName.bind(this)}
                                      value={this.state.inviteMemberName} />
                                    <h6>
                                      nest에 가입할 수 있는 초대 메일이 발송됩니다. 또 해당 사용자는 프로젝트에 자동으로 초대됩니다.
                                      </h6>
                                  </div>
                                  <div className="card-footer">
                                    <hr />
                                    {this.state.isMemberEmailValid ? <input type="button" id="add-member-invite"
                                      className="btn btn-outline-primary btn-rounded"
                                      onClick={this.onInviteMemberButton.bind(this, this.state.inviteMemberEmail, this.state.inviteMemberName)}
                                      value="멤버 초대하기" /> : 
                                      <input type="button" id="add-member-invite"
                                      className="btn btn-outline-primary btn-rounded"
                                      onClick={this.onInviteMemberButton.bind(this, this.state.inviteMemberEmail, this.state.inviteMemberName)}
                                      value="멤버 초대하기" disabled/>}
                                  </div>
                                </div>
                              </div> : ""}
                            
                          </div>
                        </div>

                        {/* Add Project Modal footer */}
                        <div className="modal-footer add-project-footer">
                          {this.state.isProjectTitleValid ? <input type="submit" id="add-project-submit" className="btn btn-outline-primary btn-rounded" value="OK" /> : 
                          <input type="submit" id="add-project-submit" className="btn btn-outline-primary btn-rounded" value="OK" disabled />}
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
          projects: response.data.data.allProject
        })
      });
    ApiService.fetchUser()
      .then(response => {
        this.setState({
          users: response.data.data.allUser
        })
      });
  }
}