import React, { Component } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from 'react-bootstrap/Button';

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
      privateTask: false
    }
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

  onSelectSlot(start, end) {
    console.log(start, end)

    this.setState({
      privateTask: true
    })
  }

  onPrivateTaskClose() {
    this.setState({
      privateTask: false
    })
  }

  render() {
    return (
      <div id="Calendar" style={{ backgroundImage: `url(${this.state.url})` }}>
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
                                <p style={{ display: "inline-block", marginBottom: "0px", marginLeft: "5px" }}>
                                  {project.projectTitle}
                                </p>
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
                onSelectSlot={this.onSelectSlot.bind(this)}
              />
            </div>
            <Dialog open={this.state.privateTask} onClose={this.onPrivateTaskClose.bind(this)}>
              <DialogTitle style={{ paddingBottom: "0" }}>
                <h2><b>개인 일정 추가</b></h2>
              </DialogTitle>
                <DialogContent>
                  정말 삭제하시겠습니까? 
                </DialogContent>
              <DialogActions>
                <Button variant="outlined" style={{ backgroundColor: '#E6E8EC', color: '#696F7A' }}>아니오</Button>
                <Button variant="outlined" style={{ backgroundColor: '#E95E51', color: 'white' }}>네</Button>
              </DialogActions>
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
          task["end"] = new Date(task.end + 1)
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
