import React, { Component } from 'react'
import userData from '../userData.json';
import './ProjectMemberAdd.scss'
import update from 'react-addons-update';

class ProjectMemberAdd extends Component {
    constructor() {
        super(...arguments)
        this.state = {
            users: userData,                // 사용자 데이터
            members: [],                    // 각 프로젝트마다 참여하는 사용자들 목록 변수
        }
    }

    // ProjectMember 추가 버튼 이벤트 함수
    onAddProjectMember() {
        this.props.callbackCloseMember.close(false);
    }

    // 프로젝트에 참여하길 원하는 멤버들을 클릭할 때 발생하는 이벤트 함수
    onCheckPoint(userNo, userName, userPhoto) {

        let member = {
            member_no: userNo,
            member_name: userName,
            member_photo: userPhoto
        }
        console.log("onCheckPoint : ")
        let newMember = update(this.state.members, {
            $push: [member]
        })

        this.setState({
            members: newMember
        })
    }
    render() {
        return (
            <div className="ProjectMemberAdd">
                {/* Add Project Member select */}
                    <div className="container card-member">
                        <div className="card">
                            <div className="card-header">
                                <h6 style={{ display: "inline-block", fontSize: "14px", fontWeight: "bold" }}>멤버</h6>
                                <button type="button" className="close" style={{ lineHeight: "35px" }} onClick={this.onAddProjectMember.bind(this)} >&times;</button>
                                <hr style={{ marginTop: "5px", marginBottom: "10px", borderColor: "#E3E3E3" }} />
                            </div>
                            <div className="card-body">
                                <input type="text" className="form-control find-member" placeholder="이름 혹은 이메일로 찾기" />
                                <div className="invite-card-member-list">

                                    {this.state.users.map(user =>
                                        <div className="invite-card-member" key={user.user_no}
                                            id={user.user_no} onClick={this.onCheckPoint.bind(this, user.user_no, user.user_name, user.user_photo)}>
                                            <img src={user.user_photo} className="img-circle" alt={user.user_photo} />
                                            <span>{user.user_name}</span>
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