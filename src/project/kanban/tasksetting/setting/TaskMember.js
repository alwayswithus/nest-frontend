import React, { Component } from 'react'
import './TaskMember.scss';
import ProjectSettingUser from '../../../../dashboard/projectsetting/ProjectSettingUser';

class TaskMember extends Component {
    
    // User List Close Function
    callbackCloseUserList() {
        this.props.callbackCloseUserList.close(false);
    }

    // CallBack Open Invite Member Function
    callbackOpenInviteMember() {
        this.props.callbackOpenInviteMember.open(true)
    }

    render() {
        return (
            <div className="TaskMemberAdd">
                {/* Add Task Member select */}
                <div className="container card-member">
                    <div className="card">
                        <div className="card-header">
                            <h6 style={{ display: "inline-block", fontSize: "14px", fontWeight: "bold" }}>멤버</h6>
                            <button type="button" className="close" style={{ lineHeight: "35px" }} onClick={this.callbackCloseUserList.bind(this)} >&times;</button>
                            <hr style={{ marginTop: "5px", marginBottom: "10px", borderColor: "#E3E3E3" }} />
                        </div>
                        <div className="card-body">
                            <input type="text" className="form-control find-member" placeholder="이름 혹은 이메일로 찾기" />
                            <div className="invite-card-member-list">
                                {this.props.users && this.props.users.map(user =>
                                    <ProjectSettingUser key={user.userNo} user={user} project={this.props.project} callbackProjectSetting={this.props.callbackProjectSetting} />)}
                                <div className="invite-member" onClick={this.callbackOpenInviteMember.bind(this)}>
                                    <i className="fas fa-user-plus fa-2x"></i>
                                    <span>멤버 초대하기</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default TaskMember;