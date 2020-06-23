import React, { Component } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from 'react-bootstrap/Button';
import ReactTooltip from 'react-tooltip';
import { Link } from 'react-router-dom'
import ProjectList from './ProjectList';
import TaskList from './TaskList';
import SockJsClient from "react-stomp";
import update from 'react-addons-update';
import Setting from '../project/kanban/tasksetting/setting/Setting'
import { Route } from "react-router-dom";

import Navigator from '../navigator/Navigator';
import './calendar.scss';
import ApiService from '../ApiService';
moment.locale("ko")
const localizer = momentLocalizer(moment);

const API_URL = "http://localhost:8080/nest";
const API_HEADERS = {
  'Content-Type': 'application/json'
}

class myCalendar extends Component {
  constructor() {
    super(...arguments);

    this.state = {
      userNumber: window.sessionStorage.getItem("authUserNo"),
      isDoChecked: false,
      isDoneChecked: false,
      taskState: [],
      taskNumber: [],

      isPointFive: false,
      isPointFour: false,
      isPointThree: false,
      isPointTwo: false,
      isPointOne: false,
      isPointZero: false,
      isPointNull: false,
      taskPoint: [],
      taskPointNumber: [],

      projectNumber: [],
      projects: [],
      events: [],
      showProjectList: false,
      showDate: false,
      showImportant: false,
      radioGroup: {
        myTask: false,
        allTask: true
      },

      eventStart: "",
      eventShowStart: "",
      newTaskContents: "",

      privateTask: false,
      pathChange: "",
      pathSelect: false,
      projectList: false,
      taskList: false,
      allTaskList: [],
      projectNo: "",
      projectTitle: "",
      tasklistNo: "",
      tasklistName: "",
      taskUniquePoint: [],
      link: "",


      taskList: [], // 프로젝트 업무
      authUserRole: "", //회원의 권한
      projectMembers: "", //프로젝트 멤버 

      taskTagNo: [], //task tag의 no만 모아둔 배열
      modalState: false,
      taskMemberState: false, //task memer modal 상태변수
      point: null, // 업무 중요도 상태변수
      tagModal: false, // 태그 모달 상태변수
    }
  }

  callbackProjectListClose() {
    this.setState({
      pathSelect: true,
      projectList: false
    })
  }

  callbackTaskListClose() {
    this.setState({
      pathSelect: true,
      taskList: false
    })
  }

  callbackProjectNo(projectNo, projectTitle) {
    this.setState({
      projectNo: projectNo,
      projectTitle: projectTitle
    })
  }

  callbackTaskListNo(tasklistNo, taskListName) {
    this.setState({
      tasklistNo: tasklistNo,
      tasklistName: taskListName
    })
  }

  onShowProjectList() {
    this.setState({
      showProjectList: !this.state.showProjectList
    })
  }

  onShowDate() {
    this.setState({
      showDate: !this.state.showDate
    })
  }

  onShowImportant() {
    this.setState({
      showImportant: !this.state.showImportant
    })
  }

  onTaskChange(event) {
    let obj = {}
    obj[event.target.value] = event.target.checked

    this.setState({
      radioGroup: obj
    })
  }

  onCheckFilter(event) {
    let isDoChecked = this.state.isDoChecked;
    let isDoneChecked = this.state.isDoneChecked;
    let taskState = this.state.taskState;
    let taskNumber = this.state.taskNumber;

    if (event.target.value === "do") {
      isDoChecked = event.target.checked
      if (isDoChecked === true) {
        taskState.forEach(task => {
          if (task.state === "done") {
            const index = taskNumber.findIndex(taskNumberIndex => taskNumberIndex === task.id)
            taskNumber.splice(index, 1)
          }
        })
      }
      else {
        taskState.forEach(task => {
          if (task.state === "do") {
            const index = taskNumber.findIndex(taskNumberIndex => taskNumberIndex === task.id)
            taskNumber.splice(index, 1)
          }
        })
      }
    }
    else if (event.target.value === "done") {
      isDoneChecked = event.target.checked
      if (isDoneChecked === true) {
        taskState.forEach(task => {
          if (task.state === "do") {
            const index = taskNumber.findIndex(taskNumberIndex => taskNumberIndex === task.id)
            taskNumber.splice(index, 1)
          }
        })
      }
      else {
        taskState.forEach(task => {
          if (task.state === "done") {
            const index = taskNumber.findIndex(taskNumberIndex => taskNumberIndex === task.id)
            taskNumber.splice(index, 1)
          }
        })
      }
    }

    if (isDoneChecked === false && isDoChecked === false) {
      taskState.forEach(task => {
        taskNumber.push(task.id)
      })
    }
    else if (isDoneChecked === true && isDoChecked === true) {
      taskState.forEach(task => {
        taskNumber.push(task.id)
      })
    }

    this.setState({
      isDoChecked: isDoChecked,
      isDoneChecked: isDoneChecked,
      taskNumber: taskNumber
    })
  }

  onCheckPoint(event) {
    let isPointFive = this.state.isPointFive
    let isPointFour = this.state.isPointFour
    let isPointThree = this.state.isPointThree
    let isPointTwo = this.state.isPointTwo
    let isPointOne = this.state.isPointOne
    let isPointZero = this.state.isPointZero
    let isPointNull = this.state.isPointNull
    let taskPoint = this.state.taskPoint
    let taskPointNumber = this.state.taskPointNumber

    if (event.target.value === "5") {
      isPointFive = event.target.checked
    }
    else if (event.target.value === "4") {
      isPointFour = event.target.checked
    }
    else if (event.target.value === "3") {
      isPointThree = event.target.checked
    }
    else if (event.target.value === "2") {
      isPointTwo = event.target.checked
    }
    else if (event.target.value === "1") {
      isPointOne = event.target.checked
    }
    else if (event.target.value === "0") {
      isPointZero = event.target.checked
    }
    else if (event.target.value + "" === "null") {
      isPointNull = event.target.checked
    }

    taskPoint.forEach(task => {
      if (task.point + "" === event.target.value) {
        task.isChecked = event.target.checked
        if (task.isChecked === true) {
          if (taskPointNumber.includes(task.id)) {
            const taskPointNumberIndex = taskPointNumber.findIndex(taskPointNumber => taskPointNumber === task.id)
            taskPointNumber = taskPointNumber.splice(taskPointNumberIndex, 1)
          }
          else {
            taskPointNumber.push(task.id)
          }
        }
        else {
          const taskPointNumberIndex = taskPointNumber.findIndex(taskPointNumber => taskPointNumber === task.id)
          taskPointNumber.splice(taskPointNumberIndex, 1)

          if (taskPointNumber.length === 0) {
            this.state.taskPoint.map(task => taskPointNumber.push(task.id))
          }
        }
      }
    })

    this.setState({
      isPointFive: isPointFive,
      isPointFour: isPointFour,
      isPointThree: isPointThree,
      isPointTwo: isPointTwo,
      isPointOne: isPointOne,
      isPointZero: isPointZero,
      isPointNull: isPointNull,
      taskPoint: taskPoint,
      taskPointNumber: taskPointNumber,

    })
  }

  onCheckProject(event) {
    let projects = this.state.projects;
    let projectNumber = this.state.projectNumber;

    projects.forEach(project => {
      if (project.projectNo === event.target.value) {
        project.isChecked = event.target.checked
        if (project.isChecked === true) {
          if (projectNumber.includes(project.projectNo)) {
            const projectNumberIndex = projectNumber.findIndex(projectNumber => projectNumber === project.projectNo)
            projectNumber = projectNumber.splice(projectNumberIndex, 1)
          } else {
            projectNumber.push(project.projectNo)
          }
        }
        else {
          const projectNumberIndex = projectNumber.findIndex(projectNumber => projectNumber === project.projectNo)
          projectNumber.splice(projectNumberIndex, 1)

          if (projectNumber.length === 0) {
            this.state.projects.map(project => projectNumber.push(project.projectNo))
          }
        }
      }
    })

    this.setState({
      projectNumber: projectNumber,
      projects: projects
    })
  }

  onFilterCancel() {
    let taskState = this.state.taskState;
    let taskNumber = [];

    taskState.forEach(task => {
      taskNumber.push(task.id)
    })

    let projects = this.state.projects;
    let projectNumber = []

    projects.forEach(project => {
      project["isChecked"] = false;
      projectNumber.push(project.projectNo);
    })

    let taskPoint = this.state.taskPoint;
    let taskPointNumber = []

    taskPoint.forEach(task => {
      taskPointNumber.push(task.id);
    })

    this.setState({
      isDoChecked: false,
      isDoneChecked: false,
      isPointFive: false,
      isPointFour: false,
      isPointThree: false,
      isPointTwo: false,
      isPointOne: false,
      isPointZero: false,
      isPointNull: false,
      radioGroup: {
        myTask: false,
        allTask: true
      },
      taskNumber: taskNumber,
      projects: projects,
      projectNumber: projectNumber,
      taskPointNumber: taskPointNumber
    })
  }

  onOpenDialog(event) {

    let eventShowStart = moment(event.start).format('M월 DD일 HH:mm');

    this.setState({
      eventShowStart: eventShowStart,
      newTaskContents: "",
      pathChange: "",
      eventStart: event.start,
      privateTask: true
    })
  }

  onTaskAdd() {
    const projectIndex = this.state.projects.findIndex(project => project.projectNo === this.state.projectNo);
    let taskCount = this.state.projects[projectIndex].taskCount + 1;
    let completedTask = this.state.projects[projectIndex].completedTask;

    let membersNo = []
    this.state.projects[projectIndex].members.map(member => {
      membersNo.push(member.userNo);
    })

    let newProject = update(this.state.projects, {
      [projectIndex]: {
        taskCount: { $set: taskCount }
      }
    })

    let newEvent = {
      taskNo: null,
      taskStart: moment(this.state.eventStart).format('YYYY-MM-DD HH:mm'),
      taskEnd: moment(this.state.eventStart).format('YYYY-MM-DD HH:mm'),
      taskPoint: null,
      taskLabel: "#DFDFDF",
      taskState: "do",
      taskContents: this.state.newTaskContents,
      taskOrder: null,
      projectNo: this.state.projectNo,
      taskListNo: this.state.tasklistNo,
      taskWriter: window.sessionStorage.getItem("authUserNo"),
      taskRegdate: moment(this.state.eventStart).format('YYYY-MM-DD HH:mm'),

    }

    fetch(`${API_URL}/api/task/insert`, {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify(newEvent)
    })
      .then(response => response.json())
      .then(json => {

        let responseNewEvent = {
          color: "#DFDFDF",
          end: this.state.eventStart,
          id: json.data.taskNo,
          projectNo: json.data.projectNo,
          start: this.state.eventStart,
          taskPoint: null,
          taskState: "do",
          tasklistNo: json.data.taskListNo,
          title: json.data.taskContents,
        }

        let events = update(this.state.events, {
          $push: [responseNewEvent]
        })

        let taskState = this.state.taskState;
        taskState.push({ id: responseNewEvent.id, state: newEvent.taskState })
        let taskNumber = this.state.taskNumber;
        taskNumber.push(responseNewEvent.id);

        let taskPoint = this.state.taskPoint;
        taskPoint.push({ id: responseNewEvent.id, point: newEvent.taskPoint, isChecked: false })
        let taskPointNumber = this.state.taskPointNumber;
        taskPointNumber.push(responseNewEvent.id);

        let dashboardSocketData = {
          projectNo: json.data.projectNo,
          membersNo: membersNo,
          taskCount: taskCount,
          socketType: "calendarTaskAdd"
        }

        let kanbanboardSocketData = {
          commentList: [],
          taskStart: json.data.taskStart,
          taskEnd: json.data.taskEnd,
          taskOrder: json.data.taskOrder,
          tagList: [],
          taskState: "do",
          memberList: [],
          taskContents: json.data.taskContents,
          taskNo: json.data.taskNo,
          checkList: [],
          taskPoint: json.data.taskPoint,
          taskLabel: json.data.taskLabel,
          fileList: [],
          taskWriter: json.data.taskWriter,
          userName: sessionStorage.getItem("authUserName"),
          socketType: "taskInsert",
          taskCount: taskCount,
          completedTask: completedTask,
          projectNo: json.data.projectNo,
          taskListNo: json.data.taskListNo,
          members: this.state.projects[projectIndex].members
        }

        this.clientRef.sendMessage("/app/dashboard/all", JSON.stringify(dashboardSocketData));
        this.clientRef.sendMessage("/app/all", JSON.stringify(kanbanboardSocketData));
        this.clientRef.sendMessage("/app/calendar/all", JSON.stringify(kanbanboardSocketData));
      })

  }

  onPrivateTaskClose() {
    this.setState({
      privateTask: false,
      pathSelect: false,
      projectList: false,
      taskList: false,
      projectNo: "",
      projectTitle: "",
      pathChange: "",
      newTaskContents: ""
    })
  }

  onNewTaskContentsChange(event) {
    this.setState({
      newTaskContents: event.target.value
    })
  }

  onPathSelect() {
    this.setState({
      pathSelect: true,
      projectList: false,
      taskList: false,
      projectTitle: "",
      tasklistName: ""
    })
  }

  onPathSelectClose() {
    this.setState({
      pathSelect: false
    })
  }

  onProjectList() {
    this.setState({
      projectList: !this.state.ProjectList,
    })
  }

  onTaskList() {
    if (this.state.projectTitle !== "") {

      fetch(`${API_URL}/api/calendar/${this.state.projectNo}`, {
        method: 'post',
        headers: API_HEADERS,
      })
        .then(response => response.json())
        .then(json => {
          this.setState({
            taskList: !this.state.taskList,
            allTaskList: json.data.allTaskList
          })
        })
    }
  }

  onPathChange() {
    let pathChange = this.state.pathChange

    pathChange = `${this.state.projectTitle} > ${this.state.tasklistName}`

    this.setState({
      pathSelect: false,
      pathChange: pathChange
    })
  }

  receiveCalendar(socketData) {
    if (socketData.socketType === "taskInsert") {
      const projectIndex = this.state.projects.findIndex(project => project.projectNo == socketData.projectNo);
      if (projectIndex !== -1) {
        let taskCount = socketData.taskCount;
        let completedTask = socketData.completedTask;

        let newProject = update(this.state.projects, {
          [projectIndex]: {
            taskCount: { $set: taskCount },
            completedTask: { $set: completedTask }
          }
        })

        let responseNewEvent = {
          color: socketData.taskLabel,
          end: new Date(socketData.taskEnd),
          id: Number(socketData.taskNo),
          projectNo: Number(socketData.projectNo),
          start: new Date(socketData.taskStart),
          taskPoint: null,
          taskState: "do",
          tasklistNo: Number(socketData.taskListNo),
          title: socketData.taskContents,
        }

        let events = update(this.state.events, {
          $push: [responseNewEvent]
        })

        let taskState = this.state.taskState;
        taskState.push({ id: responseNewEvent.id, state: responseNewEvent.taskState })
        let taskNumber = this.state.taskNumber;
        taskNumber.push(responseNewEvent.id);

        let taskPoint = this.state.taskPoint;
        taskPoint.push({ id: responseNewEvent.id, point: responseNewEvent.taskPoint, isChecked: false })
        let taskPointNumber = this.state.taskPointNumber;
        taskPointNumber.push(responseNewEvent.id);

        let set = []

        taskPoint.forEach(task => {
          if (task.point === null) {
            set.push({ point: -1 })
          }
          else {
            set.push({ point: task.point })
          }
        })

        let setProcess = Array.from(new Set(Object(set).map(set => set.point)));

        this.setState({
          projects: newProject,
          taskState: taskState,
          taskNumber: taskNumber,
          taskPoint: taskPoint,
          taskPointNumber: taskPointNumber,
          events: events,
          taskUniquePoint: setProcess.sort().reverse(),
          privateTask: false
        })
      }
    }
    // else if(socketData.socketType === "userDelete") {
    //   const projectIndex = this.state.projects.findIndex(project => project.projectNo === socketData.projectNo);
    //   if(projectIndex !== -1) {
    //     let newProject = update(this.state.projects, {
    //       $splice: [[projectIndex, 1]]
    //     })

    //     let events = [];
    //     this.state.events.map(event => {
    //       if(event.projectNo === socketData.projectNo) {

    //       }
    //       else {
    //         events.push(event)
    //       }
    //     })

    //     console.log(this.state.taskNumber);

    //     this.setState({
    //       projects: newProject,
    //       events: events
    //     })
    //   }
    // }

    else if (socketData.socketType === "taskDelete") {
      const projectIndex = this.state.projects.findIndex(project => project.projectNo == socketData.projectNo);
      if (projectIndex !== -1) {
        let taskCount = socketData.taskCount;
        let completedTask = socketData.completedTask;

        let newProject = update(this.state.projects, {
          [projectIndex]: {
            taskCount: { $set: taskCount },
            completedTask: { $set: completedTask }
          }
        })

        const eventIndex = this.state.events.findIndex(event => event.id === socketData.taskId)
        let events = update(this.state.events, {
          $splice: [[eventIndex, 1]]
        })

        let taskState = update(this.state.taskState, {
          $splice: [[eventIndex, 1]]
        })

        let taskNumber = update(this.state.taskNumber, {
          $splice: [[eventIndex, 1]]
        })

        let taskPoint = update(this.state.taskPoint, {
          $splice: [[eventIndex, 1]]
        })

        let taskPointNumber = update(this.state.taskPointNumber, {
          $splice: [[eventIndex, 1]]
        })

        let set = []
        taskPoint.forEach(task => {
          if (task.point === null) {
            set.push({ point: -1 })
          }
          else {
            set.push({ point: task.point })
          }
        })

        let setProcess = Array.from(new Set(Object(set).map(set => set.point)));

        this.setState({
          projects: newProject,
          taskState: taskState,
          taskNumber: taskNumber,
          //taskPoint: taskPoint,
          taskPointNumber: taskPointNumber,
          events: events,
          taskUniquePoint: setProcess.sort().reverse(),
          privateTask: false
        })
      }
    }
    else if (socketData.socketType === "taskCopy") {
      const projectIndex = this.state.projects.findIndex(project => project.projectNo == socketData.projectNo);
      if (projectIndex !== -1) {
        let taskCount = socketData.taskCount;
        let completedTask = socketData.completedTask;

        let newProject = update(this.state.projects, {
          [projectIndex]: {
            taskCount: { $set: taskCount },
            completedTask: { $set: completedTask }
          }
        })

        let responseNewEvent = {
          color: socketData.taskLabel,
          end: new Date(socketData.taskEnd),
          id: Number(socketData.taskNo),
          projectNo: Number(socketData.projectNo),
          start: new Date(socketData.taskStart),
          taskPoint: socketData.taskPoint,
          taskState: socketData.taskState,
          tasklistNo: Number(socketData.taskListNo),
          title: socketData.taskContents,
        }

        let events = update(this.state.events, {
          $push: [responseNewEvent]
        })

        let taskState = this.state.taskState;
        taskState.push({ id: responseNewEvent.id, state: responseNewEvent.taskState })
        let taskNumber = this.state.taskNumber;
        taskNumber.push(responseNewEvent.id);

        let taskPoint = this.state.taskPoint;
        taskPoint.push({ id: responseNewEvent.id, point: responseNewEvent.taskPoint, isChecked: false })
        let taskPointNumber = this.state.taskPointNumber;
        taskPointNumber.push(responseNewEvent.id);

        let set = []

        taskPoint.forEach(task => {
          if (task.point === null) {
            set.push({ point: -1 })
          }
          else {
            set.push({ point: task.point })
          }
        })

        let setProcess = Array.from(new Set(Object(set).map(set => set.point)));

        this.setState({
          projects: newProject,
          taskState: taskState,
          taskNumber: taskNumber,
          taskPoint: taskPoint,
          taskPointNumber: taskPointNumber,
          events: events,
          taskUniquePoint: setProcess.sort().reverse(),
          privateTask: false
        })
      }
    }
    else if (socketData.socketType === "taskCheck") {
      const projectIndex = this.state.projects.findIndex(project => project.projectNo == socketData.projectNo);
      if (projectIndex !== -1) {
        let taskCount = socketData.taskCount;
        let completedTask = socketData.completedTask;

        let newProject = update(this.state.projects, {
          [projectIndex]: {
            taskCount: { $set: taskCount },
            completedTask: { $set: completedTask }
          }
        })
        const eventIndex = this.state.events.findIndex(event => event.id == socketData.taskId)
        let events = update(this.state.events, {
          [eventIndex]: {
            taskState: { $set: socketData.taskState }
          }
        })

        let taskState = update(this.state.taskState, {
          [eventIndex]: {
            state: { $set: socketData.taskState }
          }
        })

        this.setState({
          projects: newProject,
          taskState: taskState,
          events: events,
          privateTask: false
        })
      }
    }
    else if (socketData.socketType === "taskListDelete") {
      const projectIndex = this.state.projects.findIndex(project => project.projectNo == socketData.projectNo);
      if (projectIndex !== -1) {
        let taskCount = socketData.taskCount;
        let completedTask = socketData.completedTask;

        let newProject = update(this.state.projects, {
          [projectIndex]: {
            taskCount: { $set: taskCount },
            completedTask: { $set: completedTask }
          }
        })

        let events = this.state.events;
        let eventId = [];
        events.map((event, index) => {
          if (event.tasklistNo == socketData.taskListNo) {
            eventId.push({ id: event.id });
            events.splice(index);
          }
        })

        let taskState = this.state.taskState;
        taskState.map((task, index) => {
          eventId.map(event => {
            if (event.id == task.id) {
              taskState.splice(index);
            }
          })
        })

        let taskNumber = this.state.taskNumber;
        taskNumber.map((task, index) => {
          eventId.map(event => {
            if (event.id == task) {
              taskNumber.splice(index)
            }
          })
        })

        let taskPoint = this.state.taskPoint;
        taskPoint.map((task, index) => {
          eventId.map(event => {
            if (event.id == task.id) {
              taskPoint.splice(index)
            }
          })
        })

        let taskPointNumber = this.state.taskPointNumber;
        taskPointNumber.map((task, index) => {
          eventId.map(event => {
            if (event.id == task) {
              taskPointNumber.splice(index);
            }
          })
        })

        let set = []

        taskPoint.forEach(task => {
          if (task.point === null) {
            set.push({ point: -1 })
          }
          else {
            set.push({ point: task.point })
          }
        })

        let setProcess = Array.from(new Set(Object(set).map(set => set.point)));

        this.setState({
          projects: newProject,
          events: events,
          taskState: taskState,
          taskNumber: taskNumber,
          taskPoint: taskPoint,
          taskPointNumber: taskPointNumber,
          taskUniquePoint: setProcess.sort().reverse(),
          privateTask: false
        })
      }
    }
  }

  onSelectEvent(event) {
    // CustomEvent.customEventService(event)
    let link = (
      <div className="test" style={{top:`${this.y}px`, left:`${this.x}px`}}>
        <Link to={`/nest/calendar/${event.projectNo}/task/${event.id}`}>
          <i className="fas fa-bullhorn"></i>
        </Link>
      </div>
    )
      this.setState({
        link: link,
      })
  }

  onClickSetting(event, projectIndex){
    console.log("onClickSetting")
    console.log(this.state.taskList[projectIndex].allTaskList)

    this.setState({
      taskList:this.state.taskList[projectIndex].allTaskList
    })

  }

  tagModalStateUpdate() {
    this.setState({
      tagModal: !this.state.tagModal
    })
  }
  //checkList 추가하기
  callbackAddCheckList(contents, taskNo, taskListNo) {
    const taskListIndex = this.state.taskList.findIndex((taskList) => taskList.taskListNo === taskListNo);

    const taskIndex = this.state.taskList[taskListIndex].tasks.findIndex((task) => task.taskNo === taskNo);

    const taskName = this.state.taskList[taskListIndex].tasks[taskIndex].taskContents

    let newCheckList = {
      checklistNo: null,
      checklistContents: contents,
      checklistState: "do",
      taskNo: taskNo,
    };

    fetch(`${API_URL}/api/tasksetting/checklist/add`, {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify(newCheckList)
    })
      .then(response => response.json())
      .then(json => {
        let newTaskList = update(this.state.taskList, {
          [taskListIndex]: {
            tasks: {
              [taskIndex]: {
                checkList: {
                  $push: [json.data],
                },
              },
            },
          },
        });
        const checklistIndex = newTaskList[taskListIndex].tasks[taskIndex].checkList.findIndex(checklist => checklist.checklistNo == json.data.checklistNo)
        newTaskList = update(newTaskList, {
          [taskListIndex]: {
            tasks: {
              [taskIndex]: {
                checkList: {
                  [checklistIndex]: {
                    socketType: { $set: "checkListAdd" },
                    taskListIndex: { $set: taskListIndex },
                    taskIndex: { $set: taskIndex },
                    authUserNo: { $set: sessionStorage.getItem("authUserNo") },
                    projectNo: { $set: this.props.match.params.projectNo },
                    members: { $set: this.state.projectMembers }
                  }
                },
              },
            },
          },
        });
        this.setState({
          taskList: newTaskList
        })

      })
  }

  //task에 tag 추가하기
  callbackAddTag(tagNo, tagName, taskListNo, taskNo, tagColor) {
    const taskListIndex = this.state.taskList.findIndex(
      (taskList) => taskList.taskListNo === taskListNo
    );
    const taskIndex = this.state.taskList[taskListIndex].tasks.findIndex(
      (task) => task.taskNo === taskNo
    );

    let newTag = {
      tagNo: tagNo,
      tagName: tagName,
      tagColor: tagColor,
      taskNo: taskNo
    };

    fetch(`${API_URL}/api/tag/add`, {
      method: "post",
      headers: API_HEADERS,
      body: JSON.stringify(newTag),
    })
      .then((response) => response.json())
      .then((json) => {
        let newTagData = update(this.state.taskList, {
          [taskListIndex]: {
            tasks: {
              [taskIndex]: {
                tagList: {
                  $push: [json.data],
                },
              },
            },
          },
        });

        const tagIndex = newTagData[taskListIndex].tasks[taskIndex].tagList.findIndex((tag) => tag.tagNo === json.data.tagNo);
        newTagData = update(newTagData, {
          [taskListIndex]: {
            tasks: {
              [taskIndex]: {
                tagList: {
                  [tagIndex]: {
                    tagName: { $set: tagName },
                    tagColor: { $set: tagColor },
                    socketType: { $set: "taskTagAdd" },
                    taskListIndex: { $set: taskListIndex },
                    taskIndex: { $set: taskIndex },
                    authUserNo: { $set: sessionStorage.getItem("authUserNo") },
                    projectNo: { $set: this.props.match.params.projectNo },
                    members: { $set: this.state.projectMembers }
                  }
                },
              },
            },
          },
        })
        this.onSetStateTaskTagNo(newTagData[taskListIndex].tasks[taskIndex])
        this.setState({
          taskList: newTagData
        })

      })

  }

  //task에 tag 삭제하기
  callbackDeleteTag(tagNo, taskListNo, taskNo) {
    const taskListIndex = this.state.taskList.findIndex(
      (taskList) => taskList.taskListNo === taskListNo
    );
    const taskIndex = this.state.taskList[taskListIndex].tasks.findIndex(
      (task) => task.taskNo === taskNo
    );
    const tagIndex = this.state.taskList[taskListIndex].tasks[
      taskIndex
    ].tagList.findIndex((tag) => tag.tagNo === tagNo);

    let data = {
      taskNo: taskNo,
      tagNo: tagNo,
      taskListIndex: taskListIndex,
      taskIndex: taskIndex,
      tagIndex: tagIndex,
      socketType: "taskTagDelete",
      userNo: sessionStorage.getItem("authUserNo"),
      projectNo: this.props.match.params.projectNo,
      members: this.state.projectMembers
    }

    fetch(`${API_URL}/api/tag/delete/${taskNo}/${tagNo}`, {
      method: "delete"
    })
      .then(response => response.json())
      .then(json => {
        let newTaskList = update(this.state.taskList, {
          [taskListIndex]: {
            tasks: {
              [taskIndex]: {
                tagList: {
                  $splice: [[tagIndex, 1]],
                },
              },
            },
          },
        });
        this.onSetStateTaskTagNo(newTaskList[taskListIndex].tasks[taskIndex])
        this.setState({
          taskList: newTaskList,
        });
      })

  }

  //모든 task 에서 해당 tag 삭제하기
  callbackDeleteAllTag(tagNo) {

    let data = {
      tagNo: tagNo,
      socketType: "allTagDelete"
    }

  }
  //task tag 수정하기
  callbackUpdateTag(tagName, tagColor, tagNo) {

    let data = {
      tagName: tagName,
      tagColor: tagColor,
      tagNo: tagNo,
      socketType: "allTagUpdate"
    }
  }
  //task checkList check 업데이트
  callbackCheckListStateUpdate(taskListNo, taskNo, checklistNo, checklistState) {

    const TaskListIndex = this.state.taskList.findIndex(
      (taskList) => taskList.taskListNo === taskListNo
    );
    const taskIndex = this.state.taskList[TaskListIndex].tasks.findIndex(
      (task) => task.taskNo === taskNo
    );

    const taskName = this.state.taskList[TaskListIndex].tasks[taskIndex].taskContents

    let newCheckList = {
      checklistNo: checklistNo,
      checklistContents: null,
      checklistState: checklistState === "done" ? "do" : "done",
      taskNo: taskNo,
    };

    fetch(`${API_URL}/api/tasksetting/checklist/update`, {
      method: "post",
      headers: API_HEADERS,
      body: JSON.stringify(newCheckList),
    })
      .then(response => response.json())
      .then(json => {

        const socketData = {
          taskListNo: taskListNo,
          taskNo: taskNo,
          checklistNo: checklistNo,
          checklistState: checklistState,
          socketType: "taskCheckListUpdate",
          projectNo: this.state.taskList[TaskListIndex].projectNo,
          members: this.state.projectMembers

        }

      })
  }

  //task checkList text 업데이트
  callbackCheckListContentsUpdate(
    taskListNo,
    taskNo,
    checklistNo,
    checklistContents
  ) {
    const taskListIndex = this.state.taskList.findIndex(
      (taskList) => taskList.taskListNo === taskListNo
    );

    const taskIndex = this.state.taskList[taskListIndex].tasks.findIndex(
      (task) => task.taskNo === taskNo
    );
    const checkListIndex = this.state.taskList[taskListIndex].tasks[
      taskIndex
    ].checkList.findIndex((checkList) => checkList.checklistNo === checklistNo);

    let newCheckList = {
      checklistNo: checklistNo,
      checklistContents: checklistContents,
      checklistState: null,
      taskNo: taskNo,
    };

    fetch(`${API_URL}/api/tasksetting/checklist/update`, {
      method: "post",
      headers: API_HEADERS,
      body: JSON.stringify(newCheckList),
    })
      .then((response) => response.json())
      .then((json) => {
        let newTaskList = update(this.state.taskList, {
          [taskListIndex]: {
            tasks: {
              [taskIndex]: {
                checkList: {
                  [checkListIndex]: {
                    checklistContents: {
                      $set: checklistContents,
                    },
                  },
                },
              },
            },
          },
        });

        this.setState({
          taskList: newTaskList,
        });
      })
  }

  //checklist delete
  callbackDeleteCheckList(checklistNo, taskListNo, taskNo) {

    const taskListIndex = this.state.taskList.findIndex((taskList) => taskList.taskListNo === taskListNo);
    const taskIndex = this.state.taskList[taskListIndex].tasks.findIndex((task) => task.taskNo === taskNo);
    const checkListIndex = this.state.taskList[taskListIndex].tasks[taskIndex].checkList.findIndex(checklist => checklist.checklistNo === checklistNo)

    let data = {
      checklistNo: checklistNo,
      taskListIndex: taskListIndex,
      taskIndex: taskIndex,
      checkListIndex: checkListIndex,
      socketType: "checkListDelete",
      userNo: sessionStorage.getItem("authUserNo"),
      projectNo: this.props.match.params.projectNo,
      members: this.state.projectMembers
    }

    fetch(`${API_URL}/api/tasksetting/checklist/${checklistNo}`, {
      method: 'delete'
    })
      .then(response => response.json())
      .then(json => {
        let newTaskList = update(this.state.taskList, {
          [taskListIndex]: {
            tasks: {
              [taskIndex]: {
                checkList: {
                  $splice: [[checkListIndex, 1]]
                }
              }
            }
          }
        })

        this.setState({
          taskList: newTaskList
        })
      })



  }

  // 태그가 추가 될 때마다 taskTagNo를 set 해줌.
  onSetStateTaskTagNo(newTaskList) {
    let array = []
    array = array.concat(newTaskList.tagList.map(tag => tag.tagNo))
    this.setState({
      taskTagNo: array
    })
  }

  // 업무 날짜 수정
  callbackTaskDateUpdate(from, to, taskListIndex, taskIndex) {

    const taskName = this.state.taskList[taskListIndex].tasks[taskIndex].taskContents
    const data = {
      from: from,
      to: to,
      taskListIndex: taskListIndex,
      taskIndex: taskIndex,
      socketType: "dateUpdate",
      projectNo: this.props.match.params.projectNo,
      members: this.state.projectMembers
    }

    if (from === 'Invalid date') {
      from = undefined;
    }
    if (to === 'Invalid date') {
      to = undefined;
    }

    let newTaskList = update(this.state.taskList, {
      [taskListIndex]: {
        tasks: {
          [taskIndex]: {
            taskStart: {
              $set: moment(from).format("YYYY-MM-DD HH:mm"),
            },
            taskEnd: {
              $set: moment(to).format("YYYY-MM-DD HH:mm"),
            },
          },
        },
      },
    });
    this.setState({
      taskList: newTaskList
    })

    const task = newTaskList[taskListIndex].tasks[taskIndex]

    fetch(`${API_URL}/api/tasksetting/calendar/update`, {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify(task)
    })

  }

  // 모달 상태 변경
  modalStateUpdate() {
    this.setState({
      modalState: !this.state.modalState
    })
  }

  taskMemberState() {
    this.setState({
      taskMemberState: !this.state.taskMemberState
    })
  }

  //업무 멤버 추가 & 삭제
  addDeleteMember(userNo, projectMembers, taskListNo, taskNo) {
    const taskListIndex = this.state.taskList.findIndex(taskList => taskList.taskListNo === taskListNo);
    const taskIndex = this.state.taskList[taskListIndex].tasks.findIndex(task => task.taskNo === taskNo);
    const taskItem = this.state.taskList[taskListIndex].tasks[taskIndex]
    const memberIndex = taskItem.memberList.findIndex(member => member.userNo === userNo)

    const projectMemberIndex = projectMembers.findIndex(projectMember => projectMember.userNo === userNo);
    const taskName = taskItem.taskContents

    let member = {
      userNo: userNo,
      taskNo: taskNo
    }

    if (memberIndex === -1) {

      let newMember = {
        userTitle: null,
        userPhoto: projectMembers[projectMemberIndex].userPhoto,
        userDept: null,
        userNo: userNo,
        userEmail: projectMembers[projectMemberIndex].userEmail,
        userRegdate: projectMembers[projectMemberIndex].userRegdate,
        userBirth: projectMembers[projectMemberIndex].userBirth,
        userName: projectMembers[projectMemberIndex].userName,
        userNumber: null,
        socketType: "taskMemberAdd",
        taskListIndex: taskListIndex,
        taskIndex: taskIndex,
        authUserNo: sessionStorage.getItem("authUserNo"),
        projectNo: this.props.match.params.projectNo,
        members: this.state.projectMembers
      }

      fetch(`${API_URL}/api/task/member/add`, {
        method: 'post',
        headers: API_HEADERS,
        body: JSON.stringify(member)
      })
        .then(response => response.json())
        .then(json => {
          let newTaskList = update(this.state.taskList, {
            [taskListIndex]: {
              tasks: {
                [taskIndex]: {
                  memberList: {
                    $push: [newMember]
                  }
                }
              }
            }
          })
          this.setState({
            taskList: newTaskList
          })
        })
    } else {

      let newMember = {
        userTitle: null,
        userPhoto: projectMembers[projectMemberIndex].userPhoto,
        userDept: null,
        userNo: userNo,
        userEmail: projectMembers[projectMemberIndex].userEmail,
        userRegdate: projectMembers[projectMemberIndex].userRegdate,
        userBirth: projectMembers[projectMemberIndex].userBirth,
        userName: projectMembers[projectMemberIndex].userName,
        userNumber: null,
        socketType: "taskMemberDelete",
        taskListIndex: taskListIndex,
        taskIndex: taskIndex,
        memberIndex: memberIndex,
        authUserNo: sessionStorage.getItem("authUserNo"),
        projectNo: this.props.match.params.projectNo,
        members: this.state.projectMembers
      }

      fetch(`${API_URL}/api/task/member/${userNo}/${taskNo}`, {
        method: 'delete'
      })
        .then(response => response.json())
        .then(json => {
          let newTaskList = update(this.state.taskList, {
            [taskListIndex]: {
              tasks: {
                [taskIndex]: {
                  memberList: {
                    $splice: [[memberIndex, 1]]
                  }
                }
              }
            }
          })
          this.setState({
            taskList: newTaskList
          })
        })


    }
  }

  //업무 중요도 업데이트
  callbackUpdateTaskPoint(point, taskListNo, taskNo) {
    const taskListIndex = this.state.taskList.findIndex(taskList => taskList.taskListNo === taskListNo);
    const taskIndex = this.state.taskList[taskListIndex].tasks.findIndex(task => task.taskNo === taskNo);

    let newPoint = {
      taskNo: taskNo,
      taskPoint: point
    }
    fetch(`${API_URL}/api/tasksetting/point/update`, {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify(newPoint)
    })
      .then(response => response.json())
      .then(json => {
        // console.log(json.data.taskPoint)
        let newTaskList = update(this.state.taskList, {
          [taskListIndex]: {
            tasks: {
              [taskIndex]: {
                taskPoint: {
                  $set: json.data.taskPoint
                }
              }
            }
          }
        })
        this.setState({
          taskList: newTaskList
        })
      })
  }

  //업무 내용 수정하기
  callbackUpdateTaskContents(taskContents, taskListNo, taskNo) {
    const taskListIndex = this.state.taskList.findIndex(taskList => taskList.taskListNo === taskListNo);
    const taskIndex = this.state.taskList[taskListIndex].tasks.findIndex(task => task.taskNo === taskNo);

    let newTaskList = update(this.state.taskList, {
      [taskListIndex]: {
        tasks: {
          [taskIndex]: {
            taskContents: {
              $set: taskContents
            }
          }
        }
      }
    })
    this.setState({
      taskList: newTaskList
    })

    fetch(`${API_URL}/api/tasksetting/task/${taskNo}`, {
      method: 'post',
      headers: API_HEADERS,
      body: taskContents
    })
      .then(response => response.json())

  }
  // 라벨 색 수정하기
  callbackUpdateTaskLabel(color, taskListNo, taskNo) {
    const taskListIndex = this.state.taskList.findIndex(taskList => taskList.taskListNo === taskListNo);
    const taskIndex = this.state.taskList[taskListIndex].tasks.findIndex(task => task.taskNo === taskNo);


    let data = {
      color: color,
      taskListIndex: taskListIndex,
      taskIndex: taskIndex,
      taskNo: taskNo,
      socketType: "labelUpdate",
      projectNo: this.props.match.params.projectNo,
      members: this.state.projectMembers
    }

    let newTaskList = update(this.state.taskList, {
      [taskListIndex]: {
        tasks: {
          [taskIndex]: {
            taskLabel: { $set: color }
          }
        }
      }
    })

    const eventIndex = this.state.events.findIndex(event => event.id === taskNo);
    let events = update(this.state.events, {
      [eventIndex]: {
        color: { $set: color }
      }
    })

    this.setState({
      taskList: newTaskList,
      events: newTaskList
    })

    fetch(`${API_URL}/api/tasksetting/tasklabel/${taskNo}`, {
      method: 'post',
      headers: API_HEADERS,
      body: color
    })
    this.clientRef.sendMessage("/app/all", JSON.stringify(data));
  }


  render() {

    return (
      <div id="Calendar">
        
        <SockJsClient
          url={`${API_URL}/socket`}
          topics={[`/topic/calendar/all/${sessionStorage.getItem("authUserNo")}`]}
          onMessage={this.receiveCalendar.bind(this)}
          ref={(client) => {
            this.clientRef = client
          }}
        />
        <Route
          path="/nest/calendar/:projectNo/task/:taskNo"
          exact
          render={(match) => (
            <>
              <Setting
                {...match}
                authUserRole={this.state.authUserRole}
                modalState={this.state.modalState}
                tagModal={this.state.tagModal} // 태그 모달 띄우는 상태변수
                taskMemberState={this.state.taskMemberState}
                projectNo={this.props.match.params.projectNo}
                task={this.state.taskList}
                taskTagNo={this.state.taskTagNo} //업무 태그 번호만 모아둔 상태배열
                taskCallbacks={{
                  checklistStateUpdate: this.callbackCheckListStateUpdate.bind(this), // checklist state 업데이트
                  checklistContentsUpdate: this.callbackCheckListContentsUpdate.bind(this), // checklist contents 업데이트
                  addCheckList: this.callbackAddCheckList.bind(this), //업무에 checklist 추가하기
                  deleteCheckList: this.callbackDeleteCheckList.bind(this), //업무에 checklist 삭제하기
                  updateTag: this.callbackUpdateTag.bind(this), //업무 태그 수정하기
                  deletetag: this.callbackDeleteTag.bind(this), //업무에 tag 삭제하기
                  addtag: this.callbackAddTag.bind(this), // 업무에 tag 추가하기,
                  deleteAlltag: this.callbackDeleteAllTag.bind(this), // 모든 업무에서 해당 tag삭제하기
                  updateTaskTag: this.onSetStateTaskTagNo.bind(this),
                  updateTaskDate: this.callbackTaskDateUpdate.bind(this), // 업무 날짜 수정
                  modalStateUpdate: this.modalStateUpdate.bind(this),
                  tagModalStateUpdate: this.tagModalStateUpdate.bind(this), //태그 모달 상태 업데이트
                  taskMemberState: this.taskMemberState.bind(this),
                  addDeleteMember: this.addDeleteMember.bind(this), // 업무에 멤버 추가 & 삭제
                  updateTaskPoint: this.callbackUpdateTaskPoint.bind(this), // 업무 포인트 업뎃
                  updateTaskContents: this.callbackUpdateTaskContents.bind(this), //업무 내용 수정
                  updateTaskLabel: this.callbackUpdateTaskLabel.bind(this), // 업무 라벨 수정
                }}
              />
            </>
          )}
        />


        {/* 사이드바 */}
        <div className="sidebar">
          <Navigator callbackChangeBackground={this.props.callbackChangeBackground} />
        </div>
        <div className="calendar-contents">
          <div className="calendar-body-contents">
            <div className="calendar-body-contents-filter">
              <table className="filterList">
                <tr>
                  <div style={{ width: "100%", paddingTop: "26px", fontWeight: "bold" }}>
                    <input onChange={this.onTaskChange.bind(this)} type="radio" checked={this.state.radioGroup["myTask"]} value="myTask" name="radioGroup" /> &nbsp; 내 업무 <br />
                    <input onChange={this.onTaskChange.bind(this)} type="radio" checked={this.state.radioGroup["allTask"]} value="allTask" name="radioGroup" /> &nbsp; 전체 업무
                    <hr style={{ borderTop: "1px solid #CBCBCB" }} />
                  </div>
                </tr>
                <tr>
                  <div style={{ width: "100%" }}>
                    <h4 style={{ marginTop: "0px", fontWeight: "bold" }}>빠른 필터</h4>
                    <div style={{ fontWeight: "bold" }}>
                      <input type="checkbox" checked={this.state.isDoChecked} value="do" onChange={this.onCheckFilter.bind(this)} /> &nbsp; 현재 진행중인 업무 <br />
                      <input type="checkbox" checked={this.state.isDoneChecked} value="done" onChange={this.onCheckFilter.bind(this)} /> &nbsp; 현재 완료된 업무
                      <hr style={{ borderTop: "1px solid #CBCBCB" }} />
                    </div>
                  </div>
                </tr>
                <tr>
                  <div style={{ width: "100%" }}>
                    <div className="show-project-list">
                      <div>
                        <div onClick={this.onShowProjectList.bind(this)}>
                          {this.state.showProjectList ?
                            <div style={{ display: "inline-block", width: "15px" }}>
                              <i className="fas fa-chevron-down"></i>
                            </div> :
                            <div style={{ display: "inline-block", width: "15px" }}>
                              <i className="fas fa-chevron-right"></i>
                            </div>}
                          <h6 style={{ display: "inline-block", marginLeft: "5px", fontSize: "16px", fontWeight: "bold" }}>
                            프로젝트
                            </h6>
                        </div>
                        {this.state.showProjectList ?
                          <div style={{ paddingLeft: "20px", fontWeight: "bold" }}>
                            {this.state.projects && this.state.projects.map(project =>
                              <div key={project.projectNo}>
                                <span><input type="checkbox" checked={project.isChecked} onChange={this.onCheckProject.bind(this)} value={project.projectNo} /></span>
                                <Link to={`/nest/dashboard/${project.projectNo}/kanbanboard`}>
                                  <p data-tip={`${project.projectTitle} 바로가기`} data-place="right" style={{ display: "inline-block", color: "black", marginBottom: "0px", marginLeft: "5px" }}>
                                    {project.projectTitle}
                                  </p>
                                </Link>
                                <ReactTooltip />
                              </div>
                            )}
                          </div> : ""}
                      </div>
                    </div>
                  </div>
                  <hr style={{ borderTop: "1px solid #CBCBCB" }} />
                </tr>
                <tr>
                  <div style={{ width: "100%" }}>
                    <div className="show-important">
                      <div>
                        <div onClick={this.onShowImportant.bind(this)}>
                          {this.state.showImportant ?
                            <div style={{ display: "inline-block", width: "15px" }}>
                              <i className="fas fa-chevron-down"></i>
                            </div> :
                            <div style={{ display: "inline-block", width: "15px" }}>
                              <i className="fas fa-chevron-right"></i>
                            </div>}
                          <h6 style={{ display: "inline-block", marginLeft: "5px", fontSize: "16px", fontWeight: "bold" }}>
                            중요도
                            </h6>
                        </div>
                        {this.state.showImportant ?
                          <div style={{ paddingLeft: "20px", fontWeight: "bold" }}>
                            {this.state.taskUniquePoint.map(task => {
                              switch (task) {
                                case 5:
                                  return (<span><input type="checkbox" checked={this.state.isPointFive} value="5" onChange={this.onCheckPoint.bind(this)} /> &nbsp; 중요도 5 <br /></span>)
                                case 4:
                                  return (<span><input type="checkbox" checked={this.state.isPointFour} value="4" onChange={this.onCheckPoint.bind(this)} /> &nbsp; 중요도 4 <br /></span>)
                                case 3:
                                  return (<span><input type="checkbox" checked={this.state.isPointThree} value="3" onChange={this.onCheckPoint.bind(this)} /> &nbsp; 중요도 3 <br /></span>)
                                case 2:
                                  return (<span><input type="checkbox" checked={this.state.isPointTwo} value="2" onChange={this.onCheckPoint.bind(this)} /> &nbsp; 중요도 2 <br /></span>)
                                case 1:
                                  return (<span><input type="checkbox" checked={this.state.isPointOne} value="1" onChange={this.onCheckPoint.bind(this)} /> &nbsp; 중요도 1 <br /></span>)
                                case 0:
                                  return (<span><input type="checkbox" checked={this.state.isPointZero} value="0" onChange={this.onCheckPoint.bind(this)} /> &nbsp; 중요도 0 <br /></span>)
                                case -1:
                                  return (<span><input type="checkbox" checked={this.state.isPointNull} value="null" onChange={this.onCheckPoint.bind(this)} /> &nbsp; 평가되지 않음 <br /></span>)
                              }
                            })}
                          </div> : ""}
                      </div>
                    </div>
                  </div>
                  <hr style={{ borderTop: "1px solid #CBCBCB" }} />
                </tr>
                <tr>
                  <div className="filter-cancel" onClick={this.onFilterCancel.bind(this)}>
                    필터 전부 취소하기
                  </div>
                </tr>
              </table>
            </div>
            <div>

            </div>

            <div className="calendar-body-contents-calendar" onMouseOver={(e) => {this.x = e.clientX-50; this.y = e.clientY-50}}>

              <Calendar
                selectable
                localizer={localizer}
                defaultDate={moment().toDate()}
                events={this.state.events.filter(event =>
                  this.state.radioGroup["allTask"] === true ?
                    (this.state.taskNumber.indexOf(event.id) !== -1 ?
                      (this.state.projectNumber.indexOf(event.projectNo) !== -1 ?
                        (this.state.taskPointNumber.indexOf(event.id) !== -1 ? this.state.events : "") : "") : "") :
                    (this.state.userNumber == event.userNo ?
                      (this.state.taskNumber.indexOf(event.id) !== -1 ?
                        (this.state.projectNumber.indexOf(event.projectNo) !== -1 ?
                          (this.state.taskPointNumber.indexOf(event.id) !== -1 ? this.state.events : "") : "") : "") : "")
                )}
                startAccessor="start"
                endAccessor="end"
                eventPropGetter={event => {
                  const eventData = this.state.events.find(ot => ot.id === event.id);
                  const backgroundColor = eventData && eventData.color;
                  return { style: { backgroundColor: backgroundColor } }
                }}
                onSelectEvent={this.onSelectEvent.bind(this)}
                onSelectSlot={this.onOpenDialog.bind(this)}
                // components={{event:this.state.link}}
              />
              
            </div>
            <Dialog open={this.state.privateTask} onClose={this.onPrivateTaskClose.bind(this)}>
              <DialogTitle style={{ textAlign: "center", padding: "10px 10px", paddingBottom: "0" }}>
                <div style={{ height: "5px" }}>
                  <button className="close"
                    onClick={this.onPrivateTaskClose.bind(this)}>
                    <i className="fas fa-times fa-1x"></i>
                  </button>
                </div>
                <h2><b>새 업무</b></h2>
              </DialogTitle>
              <DialogContent>
                <div>
                  <div className="task-location-select" onClick={this.onPathSelect.bind(this)}>
                    {this.state.pathChange === "" ? "위치 선택" : this.state.pathChange}
                  </div>
                  {this.state.pathSelect ?
                    <div className="container card-member" style={{ position: "absolute", top: "38px", left: "25px", width: "385px", height: "253px" }}>
                      <div className="card">
                        <div className="card-header">
                          <h6 style={{ display: "inline-block", fontSize: "14px", marginTop: "15px", marginRight: "199px", fontWeight: "bold", color: "black" }}>위치 선택</h6>
                          <button type="button" onClick={this.onPathSelectClose.bind(this)} className="close" style={{ lineHeight: "35px" }}>&times;</button>
                          <hr style={{ marginTop: "5px", marginBottom: "10px", borderColor: "#E3E3E3" }} />
                        </div>
                        <div className="card-body">
                          <div className="select-project" onClick={this.onProjectList.bind(this)} style={{ marginBottom: "10px", border: "1px solid #d4d6db" }}>
                            <div style={{ padding: "10px", display: "inline-block" }}>
                              <div style={{ paddingBottom: "5px", color: "#696f7a", fontSize: "14px" }}>
                                프로젝트
                            </div>
                              {this.state.projectTitle === "" ?
                                <div style={{ color: "#27B6BA", fontWeight: "bold" }}>
                                  프로젝트를 선택해주세요
                            </div> :
                                <div style={{ color: "#27B6BA", fontWeight: "bold" }}>
                                  {this.state.projectTitle}
                                </div>}
                            </div>
                            <div style={{ color: "grey", paddingRight: "15px", paddingTop: "20px", display: "inline-block", float: "right" }}>
                              <i className="fas fa-chevron-right fa-1x"></i>
                            </div>
                          </div>
                          <div onClick={this.onTaskList.bind(this)} className="select-project" style={{ border: "1px solid #d4d6db" }}>
                            <div style={{ padding: "10px", display: "inline-block" }}>
                              <div style={{ paddingBottom: "5px", color: "#696f7a", fontSize: "14px" }}>
                                업무 리스트
                            </div>
                              {this.state.projectTitle === "" ?
                                <div style={{ color: "#27B6BA", fontWeight: "bold" }}>
                                  프로젝트를 먼저 선택해주세요
                            </div> : this.state.tasklistName === "" ?
                                  <div style={{ color: "#27B6BA", fontWeight: "bold" }}>
                                    업무 리스트를 선택해주세요
                            </div> :
                                  <div style={{ color: "#27B6BA", fontWeight: "bold" }}>
                                    {this.state.tasklistName}
                                  </div>}
                            </div>
                            <div style={{ color: "grey", paddingRight: "15px", paddingTop: "20px", display: "inline-block", float: "right" }}>
                              <i className="fas fa-chevron-right fa-1x"></i>
                            </div>
                          </div>
                          <div>
                            {this.state.projectTitle !== "" ? (this.state.tasklistName !== "" ?
                              <Button onClick={this.onPathChange.bind(this)} style={{ outline: "none", borderColor: "#27B6BA", backgroundColor: "#27B6BA", width: "100%", marginTop: "10px" }} >위치 변경</Button> :
                              <Button onClick={this.onPathChange.bind(this)} style={{ outline: "none", borderColor: "#27B6BA", backgroundColor: "#27B6BA", width: "100%", marginTop: "10px" }} disabled>위치 변경</Button>) :
                              <Button onClick={this.onPathChange.bind(this)} style={{ outline: "none", borderColor: "#27B6BA", backgroundColor: "#27B6BA", width: "100%", marginTop: "10px" }} disabled>위치 변경</Button>}
                          </div>
                        </div>
                      </div>
                    </div> : ""}
                </div>
                <div style={{ border: "1px solid #d4d6db", marginTop: "5px" }}>
                  <div>
                    <textarea placeholder="새 업무는 무엇인가요?"
                      value={this.state.newTaskContents}
                      onChange={this.onNewTaskContentsChange.bind(this)} cols="50"
                      style={{ outline: "none", padding: "10px", overflow: "auto", border: "none", resize: "none" }}>
                    </textarea>
                  </div>
                  <div>
                    <div className="event-start-date" style={{ display: "inline-block", padding: "10px" }}>
                      <i className="far fa-calendar-alt" style={{ marginRight: "5px" }}></i>
                      {this.state.eventShowStart}
                    </div>
                  </div>
                </div>
              </DialogContent>
              <DialogActions style={{ display: "block", textAlign: "center" }}>
                {this.state.pathChange !== "" ?
                  (this.state.newTaskContents !== "" ?
                    <Button onClick={this.onTaskAdd.bind(this)} variant="outlined" style={{ outline: "none", backgroundColor: '#27B6BA', color: 'white', fontWeight: "bold" }}>업무 작성</Button> :
                    <Button onClick={this.onTaskAdd.bind(this)} variant="outlined" style={{ outline: "none", backgroundColor: '#27B6BA', color: 'white', fontWeight: "bold" }} disabled>업무 작성</Button>) :
                  <Button onClick={this.onTaskAdd.bind(this)} variant="outlined" style={{ outline: "none", backgroundColor: '#27B6BA', color: 'white', fontWeight: "bold" }} disabled>업무 작성</Button>}
              </DialogActions>
              {this.state.projectList ?
                <div>
                  <ProjectList
                    projectList={{
                      close: this.callbackProjectListClose.bind(this),
                      projectNo: this.callbackProjectNo.bind(this)
                    }}
                    projects={this.state.projects} />
                </div> : ""}
              {this.state.taskList ?
                <div>
                  <TaskList
                    taskList={{
                      close: this.callbackTaskListClose.bind(this),
                      tasklistNo: this.callbackTaskListNo.bind(this)
                    }}
                    allTaskList={this.state.allTaskList} />
                </div> : ""}
            </Dialog>
          </div>
        </div>
      </div>
    )
  }

  componentDidMount() {
    ApiService.fetchCalendar()
      .then(response => {
        let taskState = [];
        let taskNumber = [];
        let taskPoint = [];
        let taskPointNumber = [];

        response.data.data.allTask.map(task => {
          task["start"] = new Date(task.start);
          task["end"] = new Date(task.end + 1);
        })

        response.data.data.allTask.map(task => {
          taskState.push({ id: task.id, state: task.taskState })
          taskNumber.push(task.id)
          taskPoint.push({ id: task.id, point: task.taskPoint, isChecked: false })
          taskPointNumber.push(task.id)
        })

        let set = []

        taskPoint.forEach(task => {
          if (task.point === null) {
            set.push({ point: -1 })
          }
          else {
            set.push({ point: task.point })
          }
        })

        let setProcess = Array.from(new Set(Object(set).map(set => set.point)));

        this.setState({
          events: response.data.data.allTask,
          taskState: taskState,
          taskNumber: taskNumber,
          taskPoint: taskPoint,
          taskPointNumber: taskPointNumber,
          taskUniquePoint: setProcess.sort().reverse()
        })
      })
    let projectNumber = [];
    ApiService.fetchDashboard()
      .then(response => {
        response.data.data.allProject.map(project => {
          project["isChecked"] = false
        })
        response.data.data.allProject.map(project => {
          projectNumber.push(project.projectNo);
        })
        this.setState({
          projects: response.data.data.allProject,
          projectNumber: projectNumber
        })
      })

    ApiService.fetchCalendarAllTask(sessionStorage.getItem("authUserNo"))
      .then((response) => {

        this.setState({
          taskList: response.data.data.allProjects,
          authUserRole: response.data.data.authUserRole,
        });
      }

      );

    ApiService.fetchProjectMember(1)
      .then(response =>
        this.setState({
          projectMembers: response.data.data
        })
      )
  }
}
export default myCalendar;
