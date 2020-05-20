import React, { Component } from 'react'
import './ProjectMemberAdd.scss'
import update from 'react-addons-update';

class ProjectMemberAdd extends Component {
    constructor() {
        super(...arguments)
    }

    // User List Close Function
    callbackCloseUserList() {
        this.props.callbackCloseUserList.close(false);
    }

    callbackAddMember(userNo, userName, userPhoto) {
        let member = {
            memberNo: userNo,
            memberName: userName,
            memberPhoto: userPhoto
        }

        this.props.callbackProjectSetting.addMember(member, this.props.project.projectNo);
    }

    render() {
        return (
            <div className="ProjectMemberAdd">
                {/* Add Project Member select */}
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
                                    <div className="invite-card-member" key={user.userNo}
                                        id={user.userNo} onClick={this.callbackAddMember.bind(this, user.userNo, user.userName, user.userPhoto)}>
                                        <img src={user.userPhoto} className="img-circle" alt={user.userPhoto} />
                                        <span>{user.userName}</span>
                                        {user.userCheck ? <i className="fas fa-check"></i> : ""}
                                    </div>)}
                                <div className="invite-member">
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

export default ProjectMemberAdd;