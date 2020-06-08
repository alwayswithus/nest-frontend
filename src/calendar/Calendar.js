import React, { Component } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

import CalendarEvent from './CalendarEvent';
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
      projectNumber: [],
      projects: [],
      events: [],
      showProjectList: false,
      showTaskList: false,
      radioGroup: {
        myTask: false,
        allTask: true
      }
    }
  }

  onShowProjectList() {
    this.setState({
      showProjectList: !this.state.showProjectList
    })
  }

  onShowTaskList() {
    this.setState({
      showTaskList: !this.state.showTaskList
    })
  }

  onTaskChange(event) {
    let obj = {}
    obj[event.target.value] = event.target.checked
    this.setState({
      radioGroup: obj
    })
  }

  onCheckProject(event) {
    let projects = this.state.projects;
    let projectNumber = this.state.projectNumber;

    projects.forEach(project => {
      if(project.projectNo == event.target.value) {
        project.isChecked = event.target.checked
        if(project.isChecked === true) {
          if(projectNumber.includes(project.projectNo)) {
            const projectNumberIndex = projectNumber.findIndex(projectNumber => projectNumber === project.projectNo)
            projectNumber = projectNumber.splice(projectNumberIndex, 1)
          } else {
            projectNumber.push(project.projectNo)
          }
        }
        else {
          const projectNumberIndex = projectNumber.findIndex(projectNumber => projectNumber === project.projectNo)
          projectNumber.splice(projectNumberIndex, 1)
          
          if(projectNumber.length === 0) {
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

  render() {
    return (
      <div id="Calendar" style={{ backgroundImage: `url(${this.state.url})` }}>
        {/* 사이드바 */}
        <div className="sidebar">
          <Navigator callbackChangeBackground = {this.props.callbackChangeBackground}/>
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
                      <input type="checkbox" /> &nbsp; 나에게 배정된 업무
                      <input type="checkbox" /> &nbsp; 내가 작성한 업무
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
                                <input type="checkbox" checked={project.isChecked} onChange={this.onCheckProject.bind(this)} value={project.projectNo}/>
                                <p style={{display: "inline-block", marginBottom: "0px", marginLeft: "5px"}}>
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
                    <div className="show-task-list">
                      <div>
                        <div onClick={this.onShowTaskList.bind(this)}>
                          {this.state.showTaskList ?
                            <div style={{ display: "inline-block", width: "15px" }}>
                              <i className="fas fa-chevron-down"></i>
                            </div> :
                            <div style={{ display: "inline-block", width: "15px" }}>
                              <i className="fas fa-chevron-right"></i>
                            </div>}
                          <h6 style={{ display: "inline-block", marginLeft: "5px", fontSize: "16px", fontWeight: "bold" }}>
                            업무 리스트
                            </h6>
                        </div>
                        {this.state.showTaskList ?
                          <div style={{ paddingLeft: "20px", fontWeight: "bold" }}>
                            <input type="checkbox" /> &nbsp; 계획
                        </div> : ""}
                      </div>
                    </div>
                  </div>
                  <hr style={{ borderTop: "1px solid #CBCBCB" }} />
                </tr>
                <tr>
                  <div className="filter-cancel">
                    필터 전부 취소하기
                  </div>
                </tr>
              </table>
            </div>
            <div className="calendar-body-contents-calendar">
              <Calendar
                localizer={localizer}
                defaultDate={moment().toDate()}
                events={this.state.events.filter(event => 
                  this.state.projectNumber.indexOf(event.projectNo) !== -1 ? this.state.events : ""
                )}
                startAccessor="start"
                endAccessor="end"
                eventPropGetter={event => {
                  const eventData = this.state.events.find(ot => ot.id === event.id);
                  const backgroundColor = eventData && eventData.color;
                  return { style: { backgroundColor: backgroundColor } }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  componentDidMount() {
    ApiService.fetchCalendar()
      .then(response => {
        response.data.data.allTask.map(task => {
          task["start"] = new Date(task.start);
          task["end"] = new Date(task.end + 1)
        })
        this.setState({
          events: response.data.data.allTask
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
