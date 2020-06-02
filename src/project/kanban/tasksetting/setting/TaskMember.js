import React, { Component } from 'react'
import './TaskMember.scss';
import TaskMembers from './TaskMembers';

class TaskMember extends Component {

    // CallBack Open Invite Member Function
    callbackOpenInviteMember() {
        this.props.callbackOpenInviteMember.open(true)
    }

    render() {
        return (
            <>
            {this.props.closeProjectMembers ? <div className="TaskMemberAdd">
            {/* Add Task Member select */}
            <div style={{display:'block'}} className="container card-member">
                <div className="card">
                    <div className="card-header">
                        <h6 style={{ display: "inline-block", fontSize: "14px", fontWeight: "bold" }}>멤버</h6>
                        <button type="button" className="close" style={{ lineHeight: "35px" }} onClick={this.props.onClickTaskMember} >&times;</button>
                        <hr style={{ marginTop: "5px", marginBottom: "10px", borderColor: "#E3E3E3" }} />
                    </div>
                    <div className="card-body">
                        <input type="text" className="form-control find-member" placeholder="이름 혹은 이메일로 찾기" />
                        <div className="invite-card-member-list">
                            {this.props.projectMembers && this.props.projectMembers.map(projectMember =>
                                <TaskMembers 
                                    taskItem={this.props.taskItem}
                                    taskListNo={this.props.taskListNo}
                                    taskNo={this.props.taskNo}
                                    key={projectMember.userNo} 
                                    projectMember={projectMember} 
                                    projectMembers={this.props.projectMembers} 
                                    taskCallbacks = {this.props.taskCallbacks} />)
                            }
                            <div className="invite-member" onClick={this.callbackOpenInviteMember.bind(this)}>
                                <i className="fas fa-user-plus fa-2x"></i>
                                <span>멤버 초대하기</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div> : <div style={{display:'none'}} className="container card-member">
                <div className="card">
                    <div className="card-header">
                        <h6 style={{ display: "inline-block", fontSize: "14px", fontWeight: "bold" }}>멤버</h6>
                        <button type="button" className="close" style={{ lineHeight: "35px" }} onClick={this.props.onClickTaskMember} >&times;</button>
                        <hr style={{ marginTop: "5px", marginBottom: "10px", borderColor: "#E3E3E3" }} />
                    </div>
                    <div className="card-body">
                        <input type="text" className="form-control find-member" placeholder="이름 혹은 이메일로 찾기" />
                        <div className="invite-card-member-list">
                            {this.props.projectMembers && this.props.projectMembers.map(projectMember =>
                                <TaskMembers 
                                    taskItem={this.props.taskItem}
                                    taskListNo={this.props.taskListNo}
                                    taskNo={this.props.taskNo}
                                    key={projectMember.userNo} 
                                    projectMember={projectMember} 
                                    projectMembers={this.props.projectMembers} 
                                    taskCallbacks = {this.props.taskCallbacks} />)
                            }
                            <div className="invite-member" onClick={this.callbackOpenInviteMember.bind(this)}>
                                <i className="fas fa-user-plus fa-2x"></i>
                                <span>멤버 초대하기</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
        </>
        )
    }
}

export default TaskMember;