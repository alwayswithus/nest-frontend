import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';

import './projectset.scss';
import ProjectHeader from './ProjectHeader';
import ProjectStatus from './ProjectStatus';
import ModalCalendar from '../../modalCalendar/ModalCalendar';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import ProjectMemberAdd from './ProjectMemberAdd';

class ProjectSetting extends Component {
    constructor() {
        super(...arguments)
        this.state = {
            Exist: false,
            Delete: false,

            show: false,
            userListOpen: false,

            projectDescCheck: false,    // project desc show and hide
            keyword: "",                // project desc input change

            inviteMemberButton: false,
            inviteMemberEmail: "",
            inviteMemberName: ""
        }
    }

    // CallBack User List Close Function
    callbackCloseUserList(userListOpen) {
        this.setState({
            userListOpen: userListOpen
        })
    }

    // CallBack Change Desc Function
    callbackProjectDescChange(event) {
        this.setState({
            keyword: event.target.value.substr(0, 30)
        })
        this.props.callbackProjectSetting.changeDesc(this.props.project.projectNo, this.state.keyword);
    }

    // CallBack Open Invite Member Function
    callbackOpenInviteMember(inviteMemberButton) {
        this.setState({
            userListOpen: false,
            inviteMemberButton: inviteMemberButton
        })
    }

    // CallBack Invite Member Function
    callbackInviteMember(memberEmail, memberName) {
        this.props.callbackProjectSetting.inviteMember(this.props.project.projectNo, memberEmail, memberName);
    }

    // CallBack Project Setting List All Colse Function
    callbackSettingListAllClose() {
        this.setState({
            userListOpen: false,
            inviteMemberButton: false
        })
    }

    handleClickOpenCalendar() {
        this.setState({
            Exist: false,
            Delete: false,
            show: !this.state.show
        })
    }

    handleClickOpenExit() {
        this.setState({
            Exist: true,
            Delete: false
        })
    }

    handleClickOpenDel() {
        this.setState({
            Exist: false,
            Delete: true
        })
    }
    handleClose() {
        this.setState({
            Exist: false,
            Delete: false
        })
    }

    // Project Desc Enter Function 
    onInputKeyPress(event) {
        if (event.key === "Enter") {
            this.setState({
                projectDescCheck: !this.state.projectDescCheck
            })
        }
    }

    // User List Open Function
    onUserListOpen() {
        this.setState({
            userListOpen: !this.state.userListOpen,
            inviteMemberButton: false
        })
    }

    // Project Desc Input Show and Hide Function
    onProjectDescCheck() {
        this.setState({
            projectDescCheck: !this.state.projectDescCheck,
            keyword: this.props.project.projectDesc
        })
    }

    // Delete Member in Porject Function
    onDelteMember(memberNo) {
        this.props.callbackProjectSetting.deleteMember(memberNo, this.props.project.projectNo)
    }

    // Invite Member Open Function
    onInviteMember() {
        this.setState({
            userListOpen: true,
            inviteMemberButton: !this.state.inviteMemberButton
        })
    }

    // Input Invite Member Email Function
    onInputInviteMemberEmail(event) {
        this.setState({
            inviteMemberEmail: event.target.value
        })
    }

    // Input Invite Member Name Function
    onInputInviteMemberName(event) {
        this.setState({
            inviteMemberName: event.target.value
        })
    }

    render() {
        return (
            <div style={{ height: '100%', position: 'relative', marginLeft: "65.7%" }}>
                {/* 프로젝트 헤더 */}
                <ProjectHeader project={this.props.project} name='김우경'  
                    callbackSettingListAllClose={{close: this.callbackSettingListAllClose.bind(this)}} 
                    callbackProjectSetting={this.props.callbackProjectSetting} />
                {/* 프로젝트 리스트 */}
                <div className="ProjectSet">
                    <div className="project-description">
                        <hr />
                        <div className="project-description-header">
                            <div className="project-introduce"><b>설명</b></div>
                            <i className="far fa-edit Icon" onClick={this.onProjectDescCheck.bind(this)}></i>
                        </div>
                        {this.state.projectDescCheck ?
                            <div className="project-description-contents">
                                <input className="project-description-input" type="text" value={this.state.keyword}
                                    onChange={this.callbackProjectDescChange.bind(this)}
                                    onKeyPress={this.onInputKeyPress.bind(this)}
                                    autoFocus />
                            </div> :
                            <div className="project-description-contents">
                                <h5 style={{ marginTop: "0", fontWeight: "bold" }}>{this.props.project.projectDesc}</h5>
                            </div>
                        }
                        <hr style={{ marginBottom: '20px', color: '#555555' }} />
                    </div>
                    <div className="setList">
                        <ul>
                            {/* 프로젝트상태 */}
                            <li>
                                <div style={{ display: 'inline-block' }}><h5><b>프로젝트 상태</b></h5></div>
                                <div style={{ display: 'inline-block' }}><ProjectStatus callbackProjectSetting={this.props.callbackProjectSetting} project={this.props.project} /> </div>
                            </li>

                            {/* 마감일 */}
                            <li>
                                <div style={{ display: 'inline-block' }}><h5><b>마감일</b></h5></div>
                                <div style={{ display: 'inline-block' }}>
                                    <Button onClick={this.handleClickOpenCalendar.bind(this)} variant=""><i className="fas fa-plus fa-1x"></i></Button>
                                    {this.state.show ? <ModalCalendar project={this.props.project}/> : ""}
                                </div>

                            </li>

                            {/* 프로젝트 멤버 */}
                            <li>
                                <div style={{ float: 'left' }}>
                                    <h5><b>프로젝트멤버</b></h5>
                                </div>
                                <div style={{ float: 'left' }}>
                                    <Button onClick={this.onUserListOpen.bind(this)} variant=""><i className="fas fa-plus fa-1x"></i></Button>
                                    <div>
                                        {this.state.userListOpen ?
                                            <ProjectMemberAdd project={this.props.project} users={this.props.users}
                                                callbackCloseUserList={{ close: this.callbackCloseUserList.bind(this) }}
                                                callbackOpenInviteMember={{ open: this.callbackOpenInviteMember.bind(this) }}
                                                callbackProjectSetting={this.props.callbackProjectSetting} /> : ""}

                                        {/* Add Project Member select */}
                                        {this.state.inviteMemberButton ?
                                            <div style={{ position: "relative" }}>
                                                <div className="container card-member member-invite">
                                                    <div className="card">
                                                        <div className="card-header">
                                                            <div className="back-select-user-button" onClick={this.onInviteMember.bind(this)}>
                                                                <i className="fas fa-chevron-left"></i>
                                                            </div>
                                                            <h6 style={{ display: "inline-block", fontSize: "14px", fontWeight: "bold" }}>멤버 초대하기</h6>
                                                            <hr style={{ marginTop: "5px", marginBottom: "10px", borderColor: "#E3E3E3" }} />
                                                        </div>
                                                        <div className="card-body">
                                                            <h6 style={{ fontSize: "14px", fontWeight: "bold" }}>이메일</h6>
                                                            <input type="text" className="form-control find-member" name="userEmail"
                                                                onChange={this.onInputInviteMemberEmail.bind(this)}
                                                                value={this.state.inviteMemberEmail} placeholder="yong80211@gmail.com" />
                                                            <h6 style={{ fontSize: "14px", fontWeight: "bold" }}>이름 (선택사항)</h6>
                                                            <input type="text" name="userName" className="form-control find-member"
                                                                onChange={this.onInputInviteMemberName.bind(this)}
                                                                value={this.state.inviteMemberName} />
                                                            <h6>
                                                                nest에 가입할 수 있는 초대 메일이 발송됩니다. 또 해당 사용자는 프로젝트에 자동으로 초대됩니다.
                                                    </h6>
                                                        </div>
                                                        <div className="card-footer">
                                                            <hr />
                                                            <input type="button" id="add-member-invite"
                                                                className="btn btn-outline-primary btn-rounded"
                                                                onClick={this.callbackInviteMember.bind(this, this.state.inviteMemberEmail, this.state.inviteMemberName)}
                                                                value="멤버 초대하기" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div> : ""}
                                    </div>
                                </div>
                                {/* 프로젝트 멤버 리스트 */}
                                <div className="Member-list" style={{ display: 'inline-block' }}>
                                    {this.props.project.members && this.props.project.members.map(member =>
                                        <div className="Member" key={member.userNo}>
                                            <img src={member.userPhoto} className="img-circle" alt={member.userPhoto} />
                                            <span>{member.userName}</span>
                                            <span className="delete-member" onClick={this.onDelteMember.bind(this, member.userNo)}>
                                                <i className="fas fa-times"></i>
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </li>

                            {/* csv로 내보내기 */}
                            <li>
                                <div style={{ display: 'inline-block' }}><h5><b>csv로 내보내기</b></h5></div>
                                <div style={{ display: 'inline-block' }} className="link"><button>csv로 내보내기</button></div>
                            </li>

                            {/* 프로젝트 나가기 */}
                            <li>
                                <div style={{ display: 'inline-block' }}><h5><b>프로젝트 나가기</b></h5></div>
                                <div style={{ display: 'inline-block' }} className="link">
                                    <button onClick={this.handleClickOpenExit.bind(this)} >프로젝트 나가기</button>
                                    <Dialog onClose={this.handleClose.bind(this)} open={this.state.Exist}>
                                        <DialogTitle onClose={this.handleClose.bind(this)}>
                                            <h2><b>이 프로젝트 나가기</b></h2>
                                        </DialogTitle>
                                        <DialogContent>
                                            정말 이 프로젝트를 나가시겠습니까?
                                        </DialogContent>
                                        <DialogActions>
                                            <Button variant="outlined" style={{ backgroundColor: '#FF4040', color: 'white' }} onClick={this.handleClose.bind(this)}>닫기</Button>
                                        </DialogActions>
                                    </Dialog>
                                </div>
                            </li>

                            {/* 프로젝트 영구삭제 */}
                            <li>
                                <div style={{ display: 'inline-block' }}><h5><b>프로젝트 영구삭제</b></h5></div>
                                <div style={{ display: 'inline-block' }} className="link">
                                    <button onClick={this.handleClickOpenDel.bind(this)} style={{ backgroundColor: '#FF4040', color: 'white' }}>프로젝트 삭제하기</button>
                                    <Dialog onClose={this.handleClose.bind(this)} open={this.state.Delete}>
                                        <DialogTitle onClose={this.handleClose.bind(this)}>
                                            <h2><b>프로젝트 삭제</b></h2>
                                        </DialogTitle>
                                        <DialogContent>
                                            정말 삭제하시겠습니까? Project Name이 영구 삭제됩니다.
                                        </DialogContent>
                                        <DialogActions>
                                            <Button variant="outlined" style={{ backgroundColor: '#FF4040', color: 'white' }} onClick={this.handleClose.bind(this)}>닫기</Button>
                                        </DialogActions>
                                    </Dialog>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}
export default ProjectSetting;

