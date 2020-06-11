import React, { Component } from 'react';
import './taskList.scss';

export default class TaskList extends Component {

    constructor() {
        super(...arguments)

        this.state = {
            taskListNumber: ""
        }
    }

    callbackTaskListClose() {
        this.props.taskList.close()
    }

    onSelectTaskList(tasklistNo, tasklistName) {
        let taskListNumber = tasklistNo
        
        this.props.taskList.tasklistNo(tasklistNo, tasklistName)

        this.setState({
            taskListNumber: taskListNumber
        })
    }

    render() {
        return (
            <div className="TaskList">
                <div className="container card-member" style={{position: "absolute", top: "38px", left: "25px", width: "385px", height: "253px" }}>
                    <div className="card">
                        <div className="card-header">
                            <i onClick={this.callbackTaskListClose.bind(this)} className="fas fa-chevron-left"></i>
                            <h6 style={{ marginLeft: "10px", display: "inline-block", fontSize: "14px", fontWeight: "bold" }}>업무 리스트 선택</h6>
                            <hr style={{ marginTop: "5px", marginBottom: "10px", borderColor: "#E3E3E3" }} />
                        </div>
                        <div className="card-body">
                            <input type="text" className="form-control find-member" placeholder="프로젝트 검색" />
                            <div className="invite-card-member-list" style={{overflow: "auto"}}>
                                {this.props.allTaskList && this.props.allTaskList.map(taskList => 
                                    <div className="tasklist-name" key={taskList.tasklistNo} onClick={this.onSelectTaskList.bind(this, taskList.tasklistNo, taskList.tasklistName)}>
                                        {taskList.tasklistName}
                                        {taskList.tasklistNo === this.state.taskListNumber ? <i className="fas fa-check"></i> : ""}
                                    </div>     
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
