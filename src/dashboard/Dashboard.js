import React from 'react';
import { AlertList } from "react-bs-notifier";
import moment from 'moment';
import SockJsClient from "react-stomp";

import Navigator from '../navigator/Navigator';
import DashboardTopbar from './dashboardtopbar/DashboardTopbar';
import './dashboard.scss';
import ProjectSetting from './projectsetting/ProjectSetting';
import update from 'react-addons-update';
import User from './User';
import { Link } from 'react-router-dom';
import ApiService from '../ApiService';
import ApiNotification from '../notification/ApiNotification';
import ApiHistory from '../project/topBar/ApiHistory'
const API_URL = "http://192.168.1.223:8080/nest";
const API_HEADERS = {
  'Content-Type': 'application/json'
}


export default class Dashboard extends React.Component {

  constructor() {
    super(...arguments);

    this.state = {
      projects: null,                                               // projects data
      users: null,                                                  // user data
      userProject: [],                                              // authUser projectNo and roleNo
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
      newMessage: "초대 메일이 성공적으로 발송되었습니다.",

      projectWriter: "",                                             // project writer
      projectKeyword: "",                                            // project search
      memberKeyword: "",                                             // member search

      modalState: false,
      loading: false
    }

    const { history } = this.props;
    // 세션 체크...
    if (!sessionStorage.getItem("authUserNo")) {
      history.push("/nest/");
      return;
    }
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
      userPhoto: userPhoto,
      projectNo: projectNo,
      roleNo: 3
    }

    let newProject;
    if (this.state.project.members[memberIndex] && this.state.project.members[memberIndex].userNo === userNo) {
      fetch(`${API_URL}/api/user/delete/`, {
        method: 'post',
        headers: API_HEADERS,
        body: JSON.stringify(member)
      })

      newProject = update(this.state.projects, {
        [projectIndex]: {
          members: {
            $splice: [[memberIndex, 1]]
          }
        }
      })

    let membersNo = []
    this.state.projects[projectIndex].members.map(member => {
      membersNo.push(member.userNo);
    })

      let socketData = {
        projectNo: projectNo,
        member: member,
        socketType: "userDelete",
        newProject: newProject[projectIndex],
        membersNo: membersNo
      }

      // let calendarSocketData = {
      //   projectNo: projectNo,
      //   members: [member],
      //   socketType: "userDelete"
      // }

      this.clientRef.sendMessage("/app/dashboard/all", JSON.stringify(socketData));
      // this.clientRef.sendMessage("/app/calendar/all", JSON.stringify(calendarSocketData));
    }
    else {
      let memberArray = [
        member
      ]

      ApiNotification.fetchInsertNotice(
        sessionStorage.getItem("authUserNo"),
        sessionStorage.getItem("authUserName"),
        memberArray,
        "projectJoin",
        null,
        projectNo
      )

      fetch(`${API_URL}/api/user/add/`, {
        method: 'post',
        headers: API_HEADERS,
        body: JSON.stringify(member)
      })

      newProject = update(this.state.projects, {
        [projectIndex]: {
          members: {
            $push: [member]
          }
        }
      })

      let membersNo = []
      newProject[projectIndex].members.map(member => {
        membersNo.push(member.userNo);
      })

      let socketData = {
        projectNo: projectNo,
        member: member,
        socketType: "userAdd",
        newProject: newProject[projectIndex],
        membersNo: membersNo
      }

      ApiHistory.fetchInsertHistory(
        sessionStorage.getItem("authUserNo"),
        sessionStorage.getItem("authUserName"),
        this.state.project.members, 
        "projectMemberJoin", 
        userName, 
        projectNo,
        this.clientRef)

      this.clientRef.sendMessage("/app/dashboard/all", JSON.stringify(socketData));
      // this.clientRef.sendMessage("/app/calendar/all", JSON.stringify(calendarSocketData));
    }
  }

  // Join And Exit Member in Project Function
  callbackJoinExitMember(userNo, userName, userPhoto) {
    const memberIndex = this.state.members.findIndex(member =>
      member.userNo === userNo)

    let member = {
      userNo: userNo,
      userName: userName,
      userPhoto: userPhoto,
      roleNo: 3
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

    let userProject = {
      projectNo: projectNo,
      userNo: memberNo
    }

    const projectIndex = this.state.projects.findIndex(project =>
      project.projectNo === projectNo)

    const memberIndex = this.state.project.members.findIndex(
      (member) => member.userNo === memberNo
    );

    fetch(`${API_URL}/api/user/delete`, {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify(userProject)
    })

    let membersNo = []
    this.state.projects[projectIndex].members.map(member => {
      membersNo.push(member.userNo);
    })

    let socketData = {
      projectNo: projectNo,
      userNo: memberNo,
      socketType: "memberDelete",
      membersNo: membersNo
    }

    this.clientRef.sendMessage("/app/dashboard/all", JSON.stringify(socketData))
  }

  // CallBack Change State Function
  callbackChangeState(projectNo, state) {
    const projectIndex = this.state.projects.findIndex(project => project.projectNo === projectNo);

    let project = {
      projectNo: projectNo,
      projectState: state
    }

    let membersNo = []
    this.state.projects[projectIndex].members.map(member => {
      membersNo.push(member.userNo);
    })

    fetch(`${API_URL}/api/projectsetting/state`, {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify(project)
    })
      .then(response => response.json())
      .then(json => {

        let socketData = {
          projectNo: projectNo,
          projectState: json.data.projectState,
          membersNo: membersNo,
          socketType: "stateChange"
        }

        this.clientRef.sendMessage("/app/dashboard/all", JSON.stringify(socketData))
      })
  }

  // CallBack Change Title Function
  callbackProjectTitleChange(projectNo, title) {
    
    let project = {
      projectNo: projectNo,
      projectTitle: title
    }

    const projectIndex = this.state.projects.findIndex(project => project.projectNo === projectNo)
    let membersNo = []
    this.state.projects[projectIndex].members.map(member => {
      membersNo.push(member.userNo);
    })


    fetch(`${API_URL}/api/projectsetting/title`, {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify(project)
    })
      .then(response => response.json())
      .then(json => {
        
        let socketData = {
          projectNo: projectNo,
          projectTitle: json.data.projectTitle,
          socketType: "titleChange",
          membersNo: membersNo
        }

        this.clientRef.sendMessage("/app/dashboard/all", JSON.stringify(socketData))
      })
  }

  // CallBack Chnage Desc Function
  callbackProjectDescChange(projectNo, desc) {
    
    let project = {
      projectNo: projectNo,
      projectDesc: desc
    }

    const projectIndex = this.state.projects.findIndex(project => project.projectNo === projectNo)
    let membersNo = []
    this.state.projects[projectIndex].members.map(member => {
      membersNo.push(member.userNo);
    })

    fetch(`${API_URL}/api/projectsetting/desc`, {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify(project)
    })
      .then(response => response.json())
      .then(json => {
        
        let socketData = {
          projectNo: projectNo,
          projectDesc: json.data.projectDesc,
          socketType: "descChange",
          membersNo: membersNo
        }

        this.clientRef.sendMessage("/app/dashboard/all", JSON.stringify(socketData))
      })
  }

  // CallBack Invite Member Function
  callbackInviteMember(projectNo, memberEmail, memberName) {

    const projectIndex = this.state.projects.findIndex(project => project.projectNo === projectNo);

    let member = {
      userNo: this.state.users.length + 1,
      userName: memberName !== "" ? memberName : memberEmail,
      userEmail: memberEmail,
      userPhoto: "/nest/assets/images/arrowloding.jpg",
      projectNo: projectNo,
      roleNo: 3
    }

    const newAlert = {
      id: (new Date()).getTime(),
      type: "success",
      message: this.state.newMessage
    };

    let membersNo = []
    this.state.projects[projectIndex].members.map(member => {
      membersNo.push(member.userNo);
    })

    ApiHistory.fetchInsertHistory(
      sessionStorage.getItem("authUserNo"),
      sessionStorage.getItem("authUserName"),
      this.state.project.members, 
      "projectMemberInvite", 
      memberName, 
      projectNo,
      this.clientRef)

    fetch(`${API_URL}/api/settinguser/invite`, {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify(member)
    }, setTimeout(() => {
      this.setState({
        loading: true
      })
    }))
      .then(response => response.json())
      .then(json => {

        let socketData = {
          projectNo: projectNo,
          data: json.data,
          alerts: [...this.state.alerts, newAlert],
          socketType: "inviteUser",
          membersNo: membersNo
        }

        this.clientRef.sendMessage("/app/dashboard/all", JSON.stringify(socketData));

        this.setState({
          alerts: [...this.state.alerts, newAlert],
          loading: false
        })
      })
  }

  // CallBack Member Role Change Function
  callbackRoleChange(projectNo, userNo, roleNo) {
    const projectIndex = this.state.projects.findIndex(project => project.projectNo === projectNo);

    const memberIndex = this.state.project.members.findIndex(member =>
      member.userNo === userNo)

    let userProject = {
      projectNo: projectNo,
      userNo: userNo,
      roleNo: roleNo
    }

    let membersNo = []
    this.state.projects[projectIndex].members.map(member => {
      membersNo.push(member.userNo);
    })

    fetch(`${API_URL}/api/userproject/rolechange`, {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify(userProject)
    })
      .then(response => response.json())
      .then(json => {
        let socketData = {
          projectNo: projectNo,
          userNo: userNo,
          roleNo: json.data.roleNo,
          socketType: "roleChange",
          membersNo: membersNo
        }

        this.clientRef.sendMessage("/app/dashboard/all", JSON.stringify(socketData))
      })
  }

  // CallBack Project Delete Function
  callbackProjectDelete(projectNo, userNo) {

    const projectIndex = this.state.projects.findIndex(project => project.projectNo === projectNo);

    let project = {
      projectNo: projectNo,
      userNo: userNo,
      sessionUserNo: window.sessionStorage.getItem("authUserNo")
    }

    let membersNo = []
    this.state.projects[projectIndex].members.map(member => {
      membersNo.push(member.userNo)
    })

    fetch(`${API_URL}/api/dashboard/delete`, {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify(project)
    })
      .then(response => response.json())
      .then(json => {

        
        let socketData = {
          projectNo: projectNo,
          userNo: userNo,
          sessionUserNo: window.sessionStorage.getItem("authUserNo"),
          socketType: "projectDelete",
          membersNo: membersNo
        }

        this.clientRef.sendMessage("/app/dashboard/all", JSON.stringify(socketData))
      })
  }

  // CallBack Not Transfer Role Project Delete Function
  callbackProjectNotTransferDelete(projectNo) {

    const projectIndex = this.state.projects.findIndex(project => project.projectNo === projectNo);

    let project = {
      projectNo: projectNo,
      sessionUserNo: window.sessionStorage.getItem("authUserNo")
    }

    let membersNo = []
    this.state.projects[projectIndex].members.map(member => {
      membersNo.push(member.userNo)
    })

    fetch(`${API_URL}/api/dashboard/notTransferDelete`, {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify(project)
    })
      .then(response => response.json())
      .then(json => {

        let socketData = {
          projectNo: projectNo,
          userNo: sessionStorage.getItem("authUserNo"),
          socketType: "projectNotTransferDelete",
          membersNo: membersNo
        }

        this.clientRef.sendMessage("/app/dashboard/all", JSON.stringify(socketData))
      })
  }

  // CallBack Project Forever Delete Function
  callbackProjectForeverDelete(projectNo) {

    let project = {
      projectNo: projectNo
    }

    const projectIndex = this.state.projects.findIndex(project => project.projectNo === projectNo);
    let membersNo = []
    this.state.projects[projectIndex].members.map(member => {
      membersNo.push(member.userNo)
    })

    fetch(`${API_URL}/api/dashboard/foreverdelete`, {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify(project)
    })
      .then(response => response.json())
      .then(json => {
        let socketData = {
          projectNo: projectNo,
          socketType: "foreverDelete",
          membersNo: membersNo
        }

        this.clientRef.sendMessage("/app/dashboard/all", JSON.stringify(socketData))
      })
  }

  // State Change Function
  onStateChange(projectNo, state) {
    const projectIndex = this.state.projects.findIndex(project => project.projectNo === projectNo);

    let project = {
      projectNo: projectNo,
      projectState: state
    }

    let membersNo = []
    this.state.projects[projectIndex].members.map(member => {
      membersNo.push(member.userNo);
    })

    fetch(`${API_URL}/api/projectsetting/state`, {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify(project)
    })
      .then(response => response.json())
      .then(json => {
        let socketData = {
          projectNo: projectNo,
          projectState: json.data.projectState,
          membersNo: membersNo,
          socketType: "stateChange"
        }

        this.clientRef.sendMessage("/app/dashboard/all", JSON.stringify(socketData))
      })
  }

  // Project Setting button Click Function
  onProjectSetting(projectNo) {

    this.modalStateFalse();

    const projectIndex = this.state.projects.findIndex(project => project.projectNo === projectNo);

    let userProject = {
      projectNo: projectNo,
      userNo: window.sessionStorage.getItem("authUserNo")
    }

    fetch(`${API_URL}/api/userproject`, {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify(userProject)
    })
      .then(response => response.json())
      .then(json => {
        this.setState({
          userProject: json.data,
          setOn: !this.state.setOn,
          project: this.state.projects[projectIndex]
        })
      })
    document.getElementById('projectSet').style.display = 'block'
  }

  // Add new Project Function
  onAddProjectSubmit(event) {
    event.preventDefault();

    let projectTitle = event.target.projectTitle.value;
    let projectDesc = event.target.projectDesc.value;
    let startDate = moment(new Date()).format('YYYY-MM-DD');
    let regDate = moment(new Date()).format('YYYY-MM-DD');
    let projectWriter = window.sessionStorage.getItem("authUserNo");
    let projectWriterName = window.sessionStorage.getItem("authUserName");
    let members = [
      ...this.state.members,
        {
          roleNo: 1,
          userName: sessionStorage.getItem("authUserName"),
          userNo: sessionStorage.getItem("authUserNo"),
          userPhoto: sessionStorage.getItem("authUserPhoto")
        }
    ];

    let project = {
      projectNo: null,
      projectTitle: projectTitle,
      projectDesc: projectDesc,
      projectStart: startDate,
      projectEnd: null,
      projectState: "상태없음",
      projectRegDate: regDate,
      projectWriter: projectWriter,
      projectWriterName: projectWriterName,
      roleNo: 1,
      members: members
    };

    let membersNo = []
    project.members.map(member => {
      membersNo.push(Number(member.userNo));
    })

    fetch(`${API_URL}/api/dashboard/add/${window.sessionStorage.getItem("authUserNo")}`, {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify(project)
    })
      .then(response => response.json())
      .then(json => {
        
        let socketData = {
          newProject: json.data,
          socketType: "projectAdd",
          membersNo: membersNo
        }

        this.clientRef.sendMessage("/app/dashboard/all", JSON.stringify(socketData))
      })

    document.getElementById('add-project').style.display = 'none'
    window.jQuery(document.body).removeClass("modal-open");
    window.jQuery(".modal-backdrop").remove();
  }

  // Invite Member Input Email Function
  onInputInviteMemberEmail(event) {

    const emailRegExp = /^[\w-]+(\.[\w-]+)*@([a-z0-9-]+(\.[a-z0-9-]+)*?\.[a-z]{2,6}|(\d{1,3}\.){3}\d{1,3})(:\d{4})?$/;

    if (event.target.value.match(emailRegExp)) {
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
      userPhoto: "/nest/assets/images/arrowloding.jpg",
      roleNo: 3
    }

    const newAlert = {
      id: (new Date()).getTime(),
      type: "success",
      message: this.state.newMessage
    };

    fetch(`${API_URL}/api/user/invite/`, {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify(member)
    }, setTimeout(() => {
      this.setState({
        loading: true
      })
    }))
      .then(response => response.json())
      .then(json => {

        let members = update(this.state.members, {
          $push: [json.data]
        })

        let users = update(this.state.users, {
          $push: [json.data]
        })
        this.setState({
          inviteMemberEmail: "",
          inviteMemberName: "",
          members: members,
          users: users,
          alerts: [...this.state.alerts, newAlert],
          loading: false
        })
      })
  }

  // New Project Title Validation Function
  onValidateProjectTitle(event) {
    const blank_pattern = /[\s]/g;

    if (event.target.value.length > 0 && blank_pattern.test(event.target.value) === false) {
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

  // Project Search Function
  onNotifyProjectKeywordChange(keyword) {
    console.log(keyword)
    this.setState({
      projectKeyword: keyword
    })
  }

  // Find Member Search Function
  onFindMemberSearch(event) {
    this.setState({
      memberKeyword: event.target.value
    })
  }

  // Projects hide and show Function
  onShowDetails() {
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
      memberKeyword: ""
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

  // 설정 화면 중 다른 프로젝트 클릭 시
  modalStateFalse() {
    this.setState({
      modalState: false,
    })
  }

  // 모달 상태 변경
  modalStateUpdate() {
    this.setState({
      modalState: !this.state.modalState
    })
  }

  callbackProjectDateUpdate(from, to, projectNo) {

    ApiNotification.fetchInsertNotice(
      sessionStorage.getItem("authUserNo"),
      sessionStorage.getItem("authUserName"),
      this.state.project.members,
      "projectDateChange",
      null,
      projectNo
    )
    const projectTitle = this.state.project.projectTitle
    ApiHistory.fetchInsertHistory(
      sessionStorage.getItem("authUserNo"),
      sessionStorage.getItem("authUserName"),
      this.state.project.members, 
      "projectDateUpdate", 
      projectTitle, 
      projectNo,
      this.clientRef)

    if (from === 'Invalid date') {
      from = undefined;
    }
    if (to === 'Invalid date') {
      to = undefined;
    }

    const projectIndex = this.state.projects.findIndex(project =>
      project.projectNo === projectNo)

    let newProject = update(this.state.projects, {
      [projectIndex]: {
        projectStart: {
          $set: from
        },
        projectEnd: {
          $set: to
        }
      }
    })

    let membersNo = []
    this.state.projects[projectIndex].members.map(member => {
      membersNo.push(member.userNo);
    })

    let socketData = {
      from: from,
      to: to,
      membersNo: membersNo,
      projectNo: projectNo,
      socketType: "dateChange"
    }

    fetch(`${API_URL}/api/projectsetting/calendar`, {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify(newProject[projectIndex])
    })

    this.clientRef.sendMessage("/app/dashboard/all", JSON.stringify(socketData))
  }

  receiveDashBoard(socketData) {
    if (socketData.socketType === "stateChange") {
      const projectIndex = this.state.projects.findIndex(project => project.projectNo === socketData.projectNo);

      if(projectIndex !== -1) {
        let newProject = update(this.state.projects, {
          [projectIndex]: {
            projectState: { $set: socketData.projectState }
          }
        })

        if(this.state.project.projectNo !== newProject[projectIndex].projectNo) {
          this.setState({
            projects: newProject
          })
        }
        else if(this.state.project.projectNo === newProject[projectIndex].projectNo) {
          this.setState({
            projects: newProject,
            project: newProject[projectIndex]
          })
        }
        else {
          this.setState({
            projects: newProject,
            project: newProject[projectIndex]
          })
        }
      }
    }
    else if (socketData.socketType === "dateChange") {
      const projectIndex = this.state.projects.findIndex(project =>
        project.projectNo === socketData.projectNo)

      if(projectIndex !== -1) {
        let newProject = update(this.state.projects, {
          [projectIndex]: {
            projectStart: {
              $set: socketData.from
            },
            projectEnd: {
              $set: socketData.to
            }
          }
        })

        if(this.state.project.projectNo !== newProject[projectIndex].projectNo) {
          this.setState({
            projects: newProject
          })
        }
        else if(this.state.project.projectNo === newProject[projectIndex].projectNo) {
          this.setState({
            projects: newProject,
            project: newProject[projectIndex]
          })
        }
        else {
          this.setState({
            projects: newProject,
            project: newProject[projectIndex]
          })
        }
      }
    }
    else if (socketData.socketType === "inviteUser") {

      const projectIndex = this.state.projects.findIndex(project => project.projectNo === socketData.projectNo);

      if(projectIndex !== -1) {
        let newProject = update(this.state.projects, {
          [projectIndex]: {
            members: {
              $push: [socketData.data]
            }
          }
        })
  
        let users = update(this.state.users, {
          $push: [socketData.data]
        })

        if(this.state.project.projectNo !== newProject[projectIndex].projectNo) {
          this.setState({
            users: users,
            projects: newProject
          })
        }
        else if(this.state.project.projectNo === newProject[projectIndex].projectNo) {
          this.setState({
            users: users,
            projects: newProject,
            project: newProject[projectIndex]
          })
        }
        else {
          this.setState({
            users: users,
            projects: newProject,
            project: newProject[projectIndex]
          })
        }
      }
    }
    else if (socketData.socketType === "userDelete") {
      if (sessionStorage.getItem("authUserNo") == socketData.member.userNo) {
        const projectIndex = this.state.projects.findIndex(project => project.projectNo === socketData.projectNo);
        
        if(projectIndex !== -1) {
          if(this.state.project.projectNo !== this.state.projects[projectIndex].projectNo) {
            
            let newProject = update(this.state.projects, {
              $splice: [[projectIndex, 1]]
            })

            this.setState({
              projects: newProject
            })
          }
          else if(this.state.project.projectNo === this.state.projects[projectIndex].projectNo) {
            let newProject = update(this.state.projects, {
              $splice: [[projectIndex, 1]]
            })

            this.setState({
              projects: newProject
            }) 
            document.getElementById('projectSet').style.display = 'none'
          }
        }
      }
      else {
        const projectIndex = this.state.projects.findIndex(project => project.projectNo === socketData.projectNo);
      
        if(projectIndex !== -1) {
          const memberIndex = this.state.projects[projectIndex].members.findIndex(member => member.userNo == socketData.member.userNo);
        
          let newProject = update(this.state.projects, {
            [projectIndex]: {
              members: {
                $splice: [[memberIndex, 1]]
              }
            }
          })
          
          if(this.state.project.projectNo !== newProject[projectIndex].projectNo) {
            this.setState({
              projects: newProject
            })
          }
          else if(this.state.project.projectNo === newProject[projectIndex].projectNo) {
            this.setState({
              projects: newProject,
              project: newProject[projectIndex]
            })
          }
          else {
            this.setState({
              projects: newProject,
              project: newProject[projectIndex]
            })
          }
        }
      }
    }

    else if (socketData.socketType === "userAdd") {
      if (sessionStorage.getItem("authUserNo") == socketData.member.userNo) {
        let newProject = update(this.state.projects, {
          $push: [socketData.newProject]
        })
        this.setState({
          projects: newProject
        })
      }
      else {
        const projectIndex = this.state.projects.findIndex(project => project.projectNo === socketData.projectNo)
        
        if(projectIndex !== -1) {
          let newProject = update(this.state.projects, {
            [projectIndex]: {
              members: {
                $push: [socketData.member]
              }
            }
          })
          
          if(this.state.project.projectNo !== newProject[projectIndex].projectNo) {
            this.setState({
              projects: newProject
            })
          }
          else if(this.state.project.projectNo === newProject[projectIndex].projectNo) {
            this.setState({
              projects: newProject,
              project: newProject[projectIndex]
            })
          }
          else {
            this.setState({
              projects: newProject,
              project: newProject[projectIndex]
            })
          }
        } 
      }
    }

    else if (socketData.socketType === "memberDelete") {

      if (sessionStorage.getItem("authUserNo") == socketData.userNo) {
        const projectIndex = this.state.projects.findIndex(project => project.projectNo === socketData.projectNo)

        if(projectIndex !== -1) {
          if(this.state.project.projectNo !== this.state.projects[projectIndex].projectNo) {
            
            let newProject = update(this.state.projects, {
              $splice: [[projectIndex, 1]]
            })

            this.setState({
              projects: newProject
            })
          }
          else if(this.state.project.projectNo === this.state.projects[projectIndex].projectNo) {
            let newProject = update(this.state.projects, {
              $splice: [[projectIndex, 1]]
            })

            this.setState({
              projects: newProject
            }) 
            document.getElementById('projectSet').style.display = 'none'
          }
        }  
      }
      else {
        const projectIndex = this.state.projects.findIndex(project => project.projectNo === socketData.projectNo)
         
        if(projectIndex !== -1) {
          const memberIndex = this.state.projects[projectIndex].members.findIndex(member => member.userNo === socketData.userNo)
        
          let deleteMemberProject = update(this.state.projects, {
            [projectIndex]: {
              members: {
                $splice: [[memberIndex, 1]]
              }
            }
          })
  
          if(this.state.project.projectNo !== deleteMemberProject[projectIndex].projectNo) {
            this.setState({
              projects: deleteMemberProject
            })
          }
          else if(this.state.project.projectNo === deleteMemberProject[projectIndex].projectNo) {
            this.setState({
              projects: deleteMemberProject,
              project: deleteMemberProject[projectIndex]
            })
          }
          else {
            this.setState({
              projects: deleteMemberProject,
              project: deleteMemberProject[projectIndex]
            })
          }
        }
      }
    }
    else if (socketData.socketType === "roleChange") {

      if (sessionStorage.getItem("authUserNo") == socketData.userNo) {
        const projectIndex = this.state.projects.findIndex(project => project.projectNo === socketData.projectNo);
        
        if(projectIndex !== -1) {
          const memberIndex = this.state.projects[projectIndex].members.findIndex(member => member.userNo === socketData.userNo)

          let newProject = update(this.state.projects, {
            [projectIndex]: {
              members: {
                [memberIndex]: {
                  roleNo: { $set: socketData.roleNo }
                }
              },
              roleNo: { $set: socketData.roleNo }
            }
          })
  
          let userProject = {
            projectNo: newProject[projectIndex].projectNo,
            userNo: socketData.userNo,
            roleNo: socketData.roleNo
          }

          if(this.state.project.projectNo !== newProject[projectIndex].projectNo) {
            this.setState({
              projects: newProject
            })
          }
          else if(this.state.project.projectNo === newProject[projectIndex].projectNo) {
            this.setState({
              userProject: userProject,
              projects: newProject,
              project: newProject[projectIndex]
            })
          }
          else {
            this.setState({
              userProject: userProject,
              projects: newProject,
              project: newProject[projectIndex]
            })
          }
        }
      }
      else {
        const projectIndex = this.state.projects.findIndex(project => project.projectNo === socketData.projectNo);
        
        if(projectIndex !== -1) {
          const memberIndex = this.state.projects[projectIndex].members.findIndex(member => member.userNo === socketData.userNo)

          let newProject = update(this.state.projects, {
            [projectIndex]: {
              members: {
                [memberIndex]: {
                  roleNo: { $set: socketData.roleNo }
                }
              },
            }
          })

          if(this.state.project.projectNo !== newProject[projectIndex].projectNo) {
            this.setState({
              projects: newProject
            })
          }
          else if(this.state.project.projectNo === newProject[projectIndex].projectNo) {
            this.setState({
              projects: newProject,
              project: newProject[projectIndex]
            })
          }
          else {
            this.setState({
              projects: newProject,
              project: newProject[projectIndex]
            })
          }
        }
      }
    }

    else if (socketData.socketType === "projectDelete") {
      
      if (sessionStorage.getItem("authUserNo") === socketData.sessionUserNo) {
        const projectIndex = this.state.projects.findIndex(project => project.projectNo === socketData.projectNo);

        if(projectIndex !== -1) {
          let deleteProject = update(this.state.projects, {
            $splice: [[projectIndex, 1]]
          })
  
          this.setState({
            projects: deleteProject
          })
        }  
      }
      else {
        const projectIndex = this.state.projects.findIndex(project => project.projectNo == socketData.projectNo);
        

        if(projectIndex !== -1) {
          const memberIndex = this.state.projects[projectIndex].members.findIndex(member => member.userNo == socketData.userNo);
          const sessionMemberIndex = this.state.projects[projectIndex].members.findIndex(member => member.userNo == socketData.sessionUserNo)

          let deleteProject = update(this.state.projects, {
            [projectIndex]: {
              members: {
                [memberIndex]: {
                  roleNo: { $set: 1 }
                },
                $splice: [[sessionMemberIndex, 1]]
              }
            }
          })

          let userProject = {
            projectNo: socketData.projectNo,
            userNo: socketData.userNo,
            roleNo: deleteProject[projectIndex].members[memberIndex].roleNo
          }
  
          if(this.state.project.projectNo !== deleteProject[projectIndex].projectNo) {
            this.setState({
              projects: deleteProject
            })
          }
          else if(this.state.project.projectNo === deleteProject[projectIndex].projectNo) {
            this.setState({
              projects: deleteProject,
              project: deleteProject[projectIndex],
              userProject: userProject
            })
          }
          else {
            this.setState({
              projects: deleteProject,
              project: deleteProject[projectIndex],
              userProject: userProject
            })
          }
        }
      }
    }

    else if (socketData.socketType === "projectNotTransferDelete") {
      if (sessionStorage.getItem("authUserNo") === socketData.userNo) {
        const projectIndex = this.state.projects.findIndex(project => project.projectNo === socketData.projectNo)
        let deleteProject = update(this.state.projects, {
          $splice: [[projectIndex, 1]]
        })

        this.setState({
          projects: deleteProject
        })
      }
      else {
        const projectIndex = this.state.projects.findIndex(project => project.projectNo === socketData.projectNo)
        
        if(projectIndex !== -1) {
          const memberIndex = this.state.projects[projectIndex].members.findIndex(member => member.userNo == socketData.userNo)

          let deleteProject = update(this.state.projects, {
            [projectIndex]: {
              members: {
                $splice: [[memberIndex, 1]]
              }
            }
          })

          if(this.state.project.projectNo !== deleteProject[projectIndex].projectNo) {
            this.setState({
              projects: deleteProject
            })
          }
          else if(this.state.project.projectNo === deleteProject[projectIndex].projectNo) {
            this.setState({
              projects: deleteProject,
              project: deleteProject[projectIndex]
            })
          }
          else {
            this.setState({
              projects: deleteProject,
              project: deleteProject[projectIndex]
            })
          }
        }
      }
    }

    else if(socketData.socketType === "foreverDelete") {

      const projectIndex = this.state.projects.findIndex(project => project.projectNo === socketData.projectNo)

      if(projectIndex !== -1) {
        
        if(this.state.project.projectNo !== this.state.projects[projectIndex].projectNo) {
          let deleteProject = update(this.state.projects, {
            $splice: [[projectIndex, 1]]
          })
          
          this.setState({
            projects: deleteProject
          })
        }
        else if(this.state.project.projectNo === this.state.projects[projectIndex].projectNo) {
          let deleteProject = update(this.state.projects, {
            $splice: [[projectIndex, 1]]
          })
          
          this.setState({
            projects: deleteProject
          })

          document.getElementById('projectSet').style.display = 'none'
        }
        else {
          let deleteProject = update(this.state.projects, {
            $splice: [[projectIndex, 1]]
          })
          
          this.setState({
            projects: deleteProject,
            project: deleteProject[projectIndex]
          })
        
          document.getElementById('projectSet').style.display = 'none'
        }
      }
    }

    else if(socketData.socketType === "projectAdd") {
      let memberIndex = socketData.newProject.members.findIndex(member => member.userNo == sessionStorage.getItem("authUserNo"))
  
      if(memberIndex !== -1) {
        if(socketData.newProject.projectWriter == sessionStorage.getItem("authUserNo")) {
          let newProjects = update(this.state.projects, {
            $push: [socketData.newProject]
          });
    
          this.setState({
            projects: newProjects
          })
        }
        else {
          let newProject = update(socketData.newProject, {
            roleNo: { $set: 3}
          })

          let newProjects = update(this.state.projects, {
            $push: [newProject]
          })

          this.setState({
            projects: newProjects
          })
        }
      }
    }

    else if(socketData.socketType === "titleChange") {
      const projectIndex = this.state.projects.findIndex(project => project.projectNo === socketData.projectNo);

      if(projectIndex !== -1) {
        let newProject = update(this.state.projects, {
          [projectIndex]: {
            projectTitle: { $set: socketData.projectTitle }
          }
        })
  
        if(this.state.project.projectNo !== newProject[projectIndex].projectNo) {
          this.setState({
            projects: newProject
          })
        }
        else if(this.state.project.projectNo === newProject[projectIndex].projectNo) {
          this.setState({
            projects: newProject,
            project: newProject[projectIndex]
          })
        }
        else {
          this.setState({
            projects: newProject,
            project: newProject[projectIndex]
          })
        }
      }
    }

    else if(socketData.socketType === "descChange") {
      const projectIndex = this.state.projects.findIndex(project => project.projectNo === socketData.projectNo);

      if(projectIndex !== -1) {
        let newProject = update(this.state.projects, {
          [projectIndex]: {
            projectDesc: { $set: socketData.projectDesc }
          }
        })

        if(this.state.project.projectNo !== newProject[projectIndex].projectNo) {
          this.setState({
            projects: newProject
          })
        }
        else if(this.state.project.projectNo === newProject[projectIndex].projectNo) {
          this.setState({
            projects: newProject,
            project: newProject[projectIndex]
          })
        }
        else {
          this.setState({
            projects: newProject,
            project: newProject[projectIndex]
          })
        }
      } 
    }
    
    else if(socketData.socketType === "taskInsert" ||
    socketData.socketType === "taskDelete" ||
    socketData.socketType === "taskCopy"|| 
    socketData.socketType === "taskCheck" ||
    socketData.socketType === "taskListDelete") {
      const projectIndex = this.state.projects.findIndex(project => project.projectNo == socketData.projectNo)

      if(projectIndex !== -1) {
        let newProject = update(this.state.projects, {
          [projectIndex]: {
            completedTask: { $set: socketData.completedTask },
            taskCount: { $set: socketData.taskCount }
          }
        })
        
        this.setState({
          projects: newProject
        })
      }
    }

    else if(socketData.socketType === "calendarTaskAdd") {
      const projectIndex = this.state.projects.findIndex(project => project.projectNo == socketData.projectNo);

      if(projectIndex != -1) {
        let newProject = update(this.state.projects, {
          [projectIndex]: {
            taskCount: { $set: socketData.taskCount }
          }
        })
        this.setState({
          projects: newProject
        })
      }
    }
  }

  render() {

    return (
      <div className="Dashboard">
        <SockJsClient
          url={`${API_URL}/socket`}
          topics={[`/topic/dashboard/all/${sessionStorage.getItem("authUserNo")}`]}
          onMessage={this.receiveDashBoard.bind(this)}
          ref={(client) => {
            this.clientRef = client
          }}
        />

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
            <Navigator callbackChangeBackground={this.props.callbackChangeBackground} />
          </div>

          {/* Top Bar */}
          <DashboardTopbar projectKeyword={this.state.projectKeyword} notifyProjectKeywordChange={this.onNotifyProjectKeywordChange.bind(this)} />

          {/* Main Area */}
          <div id="projectSet" style={{ display: 'none' }}>
            <ProjectSetting
              modalState={this.state.modalState}
              users={this.state.users}
              project={this.state.project}
              userProject={this.state.userProject}
              loading={this.state.loading}
              callbackProjectSetting={{
                close: this.callbackCloseProjectSetting.bind(this),
                addDeleteMember: this.callbackAddDeleteMember.bind(this),
                deleteMember: this.callbackDeleteMember.bind(this),
                changeState: this.callbackChangeState.bind(this),
                changeTitle: this.callbackProjectTitleChange.bind(this),
                changeDesc: this.callbackProjectDescChange.bind(this),
                inviteMember: this.callbackInviteMember.bind(this),
                changeRole: this.callbackRoleChange.bind(this),
                modalStateUpdate: this.modalStateUpdate.bind(this),
                updateProjectDate: this.callbackProjectDateUpdate.bind(this), // 업무 날짜 수정
                projectDelete: this.callbackProjectDelete.bind(this),
                projectNotTransferDelete: this.callbackProjectNotTransferDelete.bind(this),
                projectForeverDelete: this.callbackProjectForeverDelete.bind(this)
              }} />
          </div>
          <div className="mainArea" >
            <div className="col-sm-24 project-list" onClick={this.onShowDetails.bind(this)}>
              {this.state.details ? <i className="fas fa-arrow-down"></i> : <i className="fas fa-arrow-right"></i>}
              <h3>내가 속한 프로젝트 ({this.state.projects && this.state.projects.length})</h3>
            </div>

            {/* Projects */}
            <div className="panel-group">
              {this.state.details ? this.state.projects && this.state.projects
                .filter(project => project.projectTitle.indexOf(this.state.projectKeyword) !== -1 ||
                  project.projectState.indexOf(this.state.projectKeyword) !== -1 ||
                  project.projectStart.indexOf(this.state.projectKeyword) !== -1 ||
                  (project.projectEnd && project.projectEnd.indexOf(this.state.projectKeyword) !== -1))
                .map(project =>
                  <div key={project.projectNo} className="panel panel-default projects">
                    <Link to={`/nest/dashboard/${project.projectNo}/kanbanboard`} style={{textDecoration: "none"}}>
                      <div className="panel-header">
                        <span className="project-title">
                          {project.projectTitle}
                        </span>
                        <div style={{marginLeft: "15px", color: "black"}}>
                          <span className="update-date" style={{ width: "100%" }}>
                            <h6 style={{fontSize: "10px"}}>
                              {!project.projectStart && !project.projectEnd && "프로젝트 일정 미정"}
                              {project.projectStart && !project.projectEnd && `${project.projectStart} ~ 마감일 미정`}
                              {project.projectStart && project.projectEnd && `${project.projectStart} ~ ${project.projectEnd}`}
                            </h6>
                          </span>
                        </div>
                      </div>
                      <div className="panel-body">
                        <Link to="#">
                          <div className="btn-group">
                            {project.roleNo === 1 ?
                              <button type="button" className="btn btn-primary dropdown-toggle btn-xs project-state-change"
                                data-toggle="dropdown"
                                style={project.projectState === "상태없음" ?
                                  { backgroundColor: "#D9534F" } : project.projectState === "계획됨" ?
                                    { backgroundColor: "orange" } : project.projectState === "진행중" ?
                                      { backgroundColor: "#5CB85C" } : project.projectState === "완료됨" ?
                                        { backgroundColor: "#337AB7" } : ""}>
                                &nbsp;&nbsp;{project.projectState}
                                <span className="caret"></span>
                              </button> :
                              <button type="button" className="btn btn-primary dropdown-toggle btn-xs project-state-change"
                                data-toggle="dropdown"
                                style={project.projectState === "상태없음" ?
                                  { backgroundColor: "#D9534F" } : project.projectState === "계획됨" ?
                                    { backgroundColor: "orange" } : project.projectState === "진행중" ?
                                      { backgroundColor: "#5CB85C" } : project.projectState === "완료됨" ?
                                        { backgroundColor: "#337AB7" } : ""} disabled>
                                &nbsp;&nbsp;{project.projectState}
                                <span className="caret"></span>
                              </button>}
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
                                    <i className="fas fa-circle fa-xs" style={{ color: "#D9534F" }}></i>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>

                        {/* Project Setting Click */}
                        <Link to="#">
                          <i className="fas fa-cog fa-lg" onClick={this.onProjectSetting.bind(this, project.projectNo)} ></i>
                        </Link>
                      </div>
                      <div className="panel-footer" style={{backgroundColor: "#FFFFFF"}}>     
                        <div>                
                          <div className="update-task">
                            <h6 style={{float: "left", fontSize: "10px", marginBottom: "10px", color: "darkgray"}}>{Math.ceil((project.completedTask / project.taskCount) * 100)}%</h6>
                            <h6 style={{float: "right", fontSize: "10px", marginRight: "8px", color: "darkgray"}}>{project.completedTask} / {project.taskCount} 업무</h6>
                          </div>
                        </div>
                        <div className="progress">
                          {project.projectState === "완료됨" ?
                            <div className="progress-bar progress-bar" role="progressbar" aria-valuenow="100"
                              aria-valuemin="0" aria-valuemax="100" style={{ width: `${(project.completedTask / project.taskCount) * 100}%` }}></div> :
                            project.projectState === "진행중" ?
                              <div className="progress-bar progress-bar-success" role="progressbar" aria-valuenow="100"
                                aria-valuemin="0" aria-valuemax="100" style={{ width: `${(project.completedTask / project.taskCount) * 100}%` }}></div> :
                              project.projectState === "계획됨" ?
                                <div className="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="100"
                                  aria-valuemin="0" aria-valuemax="100" style={{ width: `${(project.completedTask / project.taskCount) * 100}%` }}></div> :
                                project.projectState === "상태없음" ?
                                  <div className="progress-bar progress-bar-danger" role="progressbar" aria-valuenow="100"
                                    aria-valuemin="0" aria-valuemax="100" style={{ width: `${(project.completedTask / project.taskCount) * 100}%` }}></div> :
                                  ""}
                        </div>
                      </div>
                    </Link>
                  </div>) : ""}
            </div>

            {/* 새 프로젝트 */}
            <div className="panel-group" >
              <div className="panel panel-default new-project" onClick={this.onStartNewProject.bind(this)} data-toggle="modal" data-target="#add-project">
                <div className="panel-body new-project-body" style={{paddingTop: "51px"}}>
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
                            <input type="text" name="projectTitle" onChange={this.onValidateProjectTitle.bind(this)} className="form-control modal-body-title" placeholder="예)웹사이트, 웹디자인" />
                            {this.state.isNotEmptyValid ? <i className="fas fa-exclamation fa-xs" style={{ margin: "10px", color: "#D5493B" }}>  공백은 허용되지 않습니다.</i> : ""}<br />
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
                                    <input type="text" className="form-control find-member" onChange={this.onFindMemberSearch.bind(this)} placeholder="이름 혹은 이메일로 찾기" />

                                    {/* All Users */}
                                    <div className="invite-card-member-list">
                                      {this.state.users && this.state.users
                                        .filter(user => user.userName.indexOf(this.state.memberKeyword) !== -1 ||
                                          user.userEmail.indexOf(this.state.memberKeyword) !== -1)
                                        .map(user =>
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
                                    <input type="text" id="userEmail" className="form-control find-member" name="userEmail"
                                      onChange={this.onInputInviteMemberEmail.bind(this)}
                                      value={this.state.inviteMemberEmail} placeholder="yong80211@gmail.com" />
                                    <h6 style={{ fontSize: "14px", fontWeight: "bold" }}>이름 (선택사항)</h6>
                                    <input type="text" id="userName" name="userName" className="form-control find-member"
                                      onChange={this.onInputInviteMemberName.bind(this)}
                                      value={this.state.inviteMemberName} />
                                    <h6>
                                      nest에 가입할 수 있는 초대 메일이 발송됩니다. 또 해당 사용자는 프로젝트에 자동으로 초대됩니다.
                                      </h6>
                                  </div>
                                  <div className="card-footer">
                                    <hr />
                                    {this.state.isMemberEmailValid ?

                                      this.state.loading ?
                                        <div style={{ textAlign: "center" }}><img style={{ height: "25px" }} src="../assets/images/ajax-loader.gif" /></div> :
                                        <span>
                                          <input type="button" id="add-member-invite"
                                            className="btn btn-outline-primary btn-rounded"
                                            onClick={this.onInviteMemberButton.bind(this, this.state.inviteMemberEmail, this.state.inviteMemberName)}
                                            value="멤버 초대하기" />
                                        </span>
                                      :
                                      <span>
                                        <input type="button" id="add-member-invite"
                                          className="btn btn-outline-primary btn-rounded"
                                          onClick={this.onInviteMemberButton.bind(this, this.state.inviteMemberEmail, this.state.inviteMemberName)}
                                          value="멤버 초대하기" disabled />
                                      </span>}
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