import React, { Component } from 'react'
import './TaskMember.scss';
import TaskMembers from './TaskMembers';

class TaskMember extends Component {

    constructor(){
        super(...arguments)
        this.state = {
            keyword:''
        }
    }
    // CallBack Open Invite Member Function
    callbackOpenInviteMember() {
        this.props.callbackOpenInviteMember.open(true)
    }

    onChangeMemberSearch(event){
        this.setState({
            keyword:event.target.value
        })
    }
    render() {
        return (
            <>
                <div className="TaskMemberAdd">
                {/* Add Task Member select */}
                <div className="container card-member">
                    <div className="card">
                        <div className="card-header">
                            <h6 style={{ display: "inline-block", fontSize: "14px", fontWeight: "bold" }}>멤버</h6>
                            <button type="button" className="close" style={{ lineHeight: "35px" }} onClick={this.props.onClickTaskMember} >&times;</button>
                            <hr style={{ marginTop: "5px", marginBottom: "10px", borderColor: "#E3E3E3" }} />
                        </div>
                        <div className="card-body">
                            <input type="text" className="form-control find-member" value= {this.state.keyword} onChange={this.onChangeMemberSearch.bind(this)} placeholder="이름 혹은 이메일로 찾기" />
                            <div className="invite-card-member-list">
                                {this.props.projectMembers && this.props.projectMembers
                                .filter(projectMember => projectMember.userName.indexOf(this.state.keyword) !== -1 || projectMember.userEmail.indexOf(this.state.keyword) !== -1)
                                .map(projectMember =>
                                    <TaskMembers 
                                        taskItem={this.props.taskItem}
                                        taskListNo={this.props.taskListNo}
                                        taskNo={this.props.taskNo}
                                        key={projectMember.userNo} 
                                        projectMember={projectMember} 
                                        projectMembers={this.props.projectMembers} 
                                        taskCallbacks = {this.props.taskCallbacks} />)
                                }
                                <div className="invite-member">
                                    <div className="icon-exclamation"><i className="fas fa-exclamation-circle"></i></div>
                                    <div className="warning">
                                        <span>
                                            멤버 초대를 원하시면 <i className="fas fa-cog"></i> 프로젝트 설정에서 추가해주세요
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </>
        )
    }
}

export default TaskMember;