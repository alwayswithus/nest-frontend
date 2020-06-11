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
      tasklistName: ""
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

    if (event.target.value == "5") {
      isPointFive = event.target.checked
    }
    else if (event.target.value == "4") {
      isPointFour = event.target.checked
    }
    else if (event.target.value == "3") {
      isPointThree = event.target.checked
    }
    else if (event.target.value == "2") {
      isPointTwo = event.target.checked
    }
    else if (event.target.value == "1") {
      isPointOne = event.target.checked
    }
    else if (event.target.value == "0") {
      isPointZero = event.target.checked
    }
    else if (event.target.value + "" === "null") {
      isPointNull = event.target.checked
    }

    taskPoint.forEach(task => {
      if (task.point + "" == event.target.value) {
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
      if (project.projectNo == event.target.value) {
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

  onSelectEvent(event) {
    alert(event.title)
  }

  onOpenDialog(event) {

    let eventShowStart = moment(event.start).format('M월 DD일 HH:mm');

    this.setState({
      eventShowStart: eventShowStart,
      eventStart: event.start,
      privateTask: true
    })
  }

  onTaskAdd() {
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

    fetch(`${API_URL}/api/calendar/taskadd`, {
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

      let events = [
        ...this.state.events,
        responseNewEvent
      ]
  
      let taskState = this.state.taskState;
      taskState.push({ id: responseNewEvent.id, state: newEvent.taskState })
      let taskNumber = this.state.taskNumber;
      taskNumber.push(responseNewEvent.id);
  
      let taskPoint = this.state.taskPoint;
      taskPoint.push({ id: responseNewEvent.id, point: newEvent.taskPoint, isChecked: false })
      let taskPointNumber = this.state.taskPointNumber;
      taskPointNumber.push(responseNewEvent.id);
  
      this.setState({
        taskState: taskState,
        taskNumber: taskNumber,
        taskPoint: taskPoint,
        taskPointNumber: taskPointNumber,
        events: events,
        privateTask: false
      })
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
    if(this.state.projectTitle !== "") {
      
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

  render() {
    return (
      <div id="Calendar">
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
                                <input type="checkbox" checked={project.isChecked} onChange={this.onCheckProject.bind(this)} value={project.projectNo} />
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
                            <input type="checkbox" checked={this.state.isPointFive} value="5" onChange={this.onCheckPoint.bind(this)} /> &nbsp; 중요도 5 <br />
                            <input type="checkbox" checked={this.state.isPointFour} value="4" onChange={this.onCheckPoint.bind(this)} /> &nbsp; 중요도 4 <br />
                            <input type="checkbox" checked={this.state.isPointThree} value="3" onChange={this.onCheckPoint.bind(this)} /> &nbsp; 중요도 3 <br />
                            <input type="checkbox" checked={this.state.isPointTwo} value="2" onChange={this.onCheckPoint.bind(this)} /> &nbsp; 중요도 2 <br />
                            <input type="checkbox" checked={this.state.isPointOne} value="1" onChange={this.onCheckPoint.bind(this)} /> &nbsp; 중요도 1 <br />
                            <input type="checkbox" checked={this.state.isPointZero} value="0" onChange={this.onCheckPoint.bind(this)} /> &nbsp; 중요도 0 <br />
                            <input type="checkbox" checked={this.state.isPointNull} value="null" onChange={this.onCheckPoint.bind(this)} /> &nbsp; 평가되지 않음 <br />
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
            <div className="calendar-body-contents-calendar">
              <Calendar
                selectable
                localizer={localizer}
                defaultDate={moment().toDate()}
                events={this.state.events.filter(event =>
                  this.state.radioGroup["allTask"] === true ?
                    (this.state.taskNumber.indexOf(event.id) !== -1 ? (this.state.projectNumber.indexOf(event.projectNo) !== -1 ? (this.state.taskPointNumber.indexOf(event.id) !== -1 ? this.state.events : "") : "") : "") :
                    (this.state.userNumber == event.userNo ? (this.state.taskNumber.indexOf(event.id) !== -1 ? (this.state.projectNumber.indexOf(event.projectNo) !== -1 ? (this.state.taskPointNumber.indexOf(event.id) !== -1 ? this.state.events : "") : "") : "") : "")
                )}
                startAccessor="start"
                endAccessor="end"
                eventPropGetter={event => {
                  const eventData = this.state.events.find(ot => ot.id === event.id);
                  const backgroundColor = eventData && eventData.color;
                  return { style: { backgroundColor: backgroundColor } }
                }}
                onSelectEvent={event => this.onSelectEvent(event)}
                onSelectSlot={this.onOpenDialog.bind(this)}
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
                  <div className="container card-member" style={{position: "absolute", top: "38px", left: "25px", width: "385px", height: "253px"}}>
                    <div className="card">
                      <div className="card-header">
                        <h6 style={{ display: "inline-block", fontSize: "14px", marginTop: "15px", marginRight: "199px", fontWeight: "bold", color: "black" }}>위치 선택</h6>
                        <button type="button" onClick={this.onPathSelectClose.bind(this)} className="close" style={{ lineHeight: "35px" }}>&times;</button>
                        <hr style={{ marginTop: "5px", marginBottom: "10px", borderColor: "#E3E3E3" }} />
                      </div>
                      <div className="card-body">
                        <div className="select-project" onClick={this.onProjectList.bind(this)} style={{ marginBottom: "10px", border: "1px solid #d4d6db" }}>
                          <div style={{ padding: "10px", display: "inline-block" }}>
                            <div style={{paddingBottom: "5px", color: "#696f7a", fontSize: "14px"}}>
                              프로젝트
                            </div>
                            {this.state.projectTitle === "" ? 
                            <div style={{color: "#27B6BA", fontWeight: "bold"}}>
                              프로젝트를 선택해주세요
                            </div> : 
                            <div style={{color: "#27B6BA", fontWeight: "bold"}}>
                              {this.state.projectTitle}
                            </div>}
                          </div>
                          <div style={{color: "grey", paddingRight: "15px", paddingTop: "20px", display: "inline-block", float: "right"}}>
                            <i className="fas fa-chevron-right fa-1x"></i>
                          </div>
                        </div>
                        <div onClick={this.onTaskList.bind(this)} className="select-project" style={{ border: "1px solid #d4d6db" }}>
                          <div style={{ padding: "10px", display: "inline-block" }}>
                            <div style={{paddingBottom: "5px", color: "#696f7a", fontSize: "14px"}}>
                              업무 리스트
                            </div>
                            {this.state.projectTitle === "" ? 
                            <div style={{color: "#27B6BA", fontWeight: "bold"}}>
                              프로젝트를 먼저 선택해주세요
                            </div> : this.state.tasklistName === "" ?
                            <div style={{color: "#27B6BA", fontWeight: "bold"}}>
                              업무 리스트를 선택해주세요
                            </div> : 
                            <div style={{color: "#27B6BA", fontWeight: "bold"}}>
                              {this.state.tasklistName}
                            </div>}
                          </div>
                          <div style={{color: "grey", paddingRight: "15px", paddingTop: "20px", display: "inline-block", float: "right"}}>
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

        this.setState({
          events: response.data.data.allTask,
          taskState: taskState,
          taskNumber: taskNumber,
          taskPoint: taskPoint,
          taskPointNumber: taskPointNumber
        })
      })
    ApiService.fetchDashboard()
      .then(response => {
        let projectNumber = [];
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
  }
}
export default myCalendar;
