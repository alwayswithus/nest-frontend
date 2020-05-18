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
    callbackClosemember() {
        this.props.callbackMembers.close(false);
    }

    // 프로젝트에 참여하길 원하는 멤버들을 클릭할 때 발생하는 이벤트 함수
    callbackCheckpoint(userNo, userName, userPhoto) {

        // 새 프로젝트 추가 버튼을 누르고 난 후 멤버 추가 버튼 옆에 있는 멤버 상태 변수
        let member = {
            member_no: userNo,
            member_name: userName,
            member_photo: userPhoto
        }

        let addDeleteMember = update(this.state.members, {
            $push: [member]
        })

        // 멤버를 추가하기 위한 버튼을 클릭할 때 나오는 사용자 데이터
        const userIndex = this.state.users.findIndex(
            (user) => user.user_no === userNo
        )

        let checkUser;
        checkUser = update(this.state.users, {
            [userIndex]: {
                user_check: { $set: !this.state.users[userIndex].user_check }
            }
        })

        if (this.state.users[userIndex].user_check) {
            const memberIndex = this.state.members.findIndex(
                (member) => member.member_no === userNo
            );

            addDeleteMember = update(this.state.members, {
                $splice: [[memberIndex, 1]]
            })
        }

        this.setState({
            users: checkUser,
            members: addDeleteMember
        })
        this.props.callbackMembers.addMember(addDeleteMember);
    }

    render() {
        return (
            <div className="ProjectMemberAdd">
                {/* Add Project Member select */}
                <div className="container card-member">
                    <div className="card">
                        <div className="card-header">
                            <h6 style={{ display: "inline-block", fontSize: "14px", fontWeight: "bold" }}>멤버</h6>
                            <button type="button" className="close" style={{ lineHeight: "35px" }} onClick={this.callbackClosemember.bind(this)} >&times;</button>
                            <hr style={{ marginTop: "5px", marginBottom: "10px", borderColor: "#E3E3E3" }} />
                        </div>
                        <div className="card-body">
                            <input type="text" className="form-control find-member" placeholder="이름 혹은 이메일로 찾기" />
                            <div className="invite-card-member-list">
                                {this.state.users.map(user =>
                                    <div className="invite-card-member" key={user.user_no}
                                        id={user.user_no} onClick={this.callbackCheckpoint.bind(this, user.user_no, user.user_name, user.user_photo)}>
                                        <img src={user.user_photo} className="img-circle" alt={user.user_photo} />
                                        <span>{user.user_name}</span>
                                        {user.user_check ? <i className="fas fa-check"></i> : ""}
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