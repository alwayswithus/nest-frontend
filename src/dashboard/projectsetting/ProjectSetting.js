import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';

import './projectset.scss';
import ProjectHeader from './ProjectHeader';
import ProjectStatus from './ProjectStatus';
import ProjectModalCalendar from '../../modalCalendar/ProjectModalCalendar';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import ProjectMemberAdd from './ProjectMemberAdd';
import ApiService from '../../ApiService';
import moment, { now }  from 'moment';
import RoleTransfer from './RoleTransfer';

class ProjectSetting extends Component {
    constructor() {
        super(...arguments)
        this.state = {
            Exist: false,
            projectDeleteOpen: false,
            Delete: false,
            isExistRoleOne: false,
            roleTransferCloseButton: false,

            show: false,
            userListOpen: false,

            projectDescCheck: false,    // project desc show and hide
            keyword: "",                // project desc input change

            isMemberEmailValid: false,
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
        this.props.callbackProjectSetting.changeDesc(this.props.project.projectNo, event.target.value.substr(0, 30));

        this.setState({
            keyword: event.target.value.substr(0, 30)
        })
    }

    // CallBack Open Invite Member Function
    callbackOpenInviteMember(inviteMemberButton) {
        this.setState({
            userListOpen: false,
            inviteMemberButton: inviteMemberButton
        })
    }

    // CallBack Invite Member Function
    callbackInviteMember(projectNo, memberEmail, memberName) {
        this.props.callbackProjectSetting.inviteMember(projectNo, memberEmail, memberName);
        this.setState({
            inviteMemberEmail: "",
            inviteMemberName: ""
        })
    }

    // CallBack Project Setting List All Colse Function
    callbackSettingListAllClose() {
        this.setState({
            userListOpen: false,
            inviteMemberButton: false
        })
    }

    // CallBack RoleTransfer Close Button Function
    callbackRoleTransferClose() {
        this.setState({
            roleTransferCloseButton: true
        })
    }

    // CallBack Member Role Change Function
    callbackRoleChange(projectNo, userNo, roleNo) {
        this.props.callbackProjectSetting.changeRole(projectNo, userNo, roleNo);
    }

    // CallBack Project Delete Function
    callbackProjectDelete(projectNo, userNo, userName, userPhoto) {
        this.setState({
            roleTransferCloseButton: true,
            Exist: false,
            Delete: false
        })

        this.props.callbackProjectSetting.projectDelete(projectNo, userNo, userName, userPhoto);
        this.props.callbackProjectSetting.close(true);

    }

    handleClickOpenExit() {
        this.setState({
            Exist: true,
            Delete: false
        })
    }

    callbackProjectForeverDelete() {
        this.setState({
            projectDeleteOpen: false
        })

        this.props.callbackProjectSetting.projectForeverDelete(this.props.project.projectNo);
        this.props.callbackProjectSetting.close(true);
    }

    handleProjectDeleteOpen() {
        this.setState({
            projectDeleteOpen: true
        })
    }

    handleProjectDeleteClose() {
        this.setState({
            projectDeleteOpen: false
        })
    }

    handleClickOpenDel() {
        this.setState({
            Exist: false,
            Delete: true
        })
    }

    handleStay() {
        this.setState({
            Exist: false,
            Delete: false
        })
    }

    // Project Esc Function
    handleClose() {
        const bool = this.props.project.members.some(member => member.roleNo === 1)
        if (bool) {
            this.setState({
                isExistRoleOne: false,
                Exist: false,
                Delete: false
            })
            
            this.props.callbackProjectSetting.projectNotTransferDelete(this.props.project.projectNo);
            this.props.callbackProjectSetting.close(true);
        }
        else {
            this.setState({
                isExistRoleOne: true,
                roleTransferCloseButton: false
            })
        }
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
        const emailRegExp = /^[\w-]+(\.[\w-]+)*@([a-z0-9-]+(\.[a-z0-9-]+)*?\.[a-z]{2,6}|(\d{1,3}\.){3}\d{1,3})(:\d{4})?$/;

        if (event.target.value.match(emailRegExp)) {
            this.setState({
                isMemberEmailValid: true,
                inviteMemberEmail: event.target.value
            })
        }
        else {
            this.setState({
                isMemberEmailValid: false,
                inviteMemberEmail: event.target.value
            })
        }
    }

    // Input Invite Member Name Function
    onInputInviteMemberName(event) {
        this.setState({
            inviteMemberName: event.target.value
        })
    }

    onClickConfirm(from, to, projectNo){
        this.props.callbackProjectSetting.updateProjectDate(moment(from).format('YYYY-MM-DD'),moment(to).format('YYYY-MM-DD'), projectNo)
    }

    render() {
        return (
            <div style={{ height: '100%', position: 'relative', marginLeft: "65.7%" }} id="projectHeader">
                {/* 프로젝트 헤더 */}
                <ProjectHeader 
                    userProject={this.props.userProject} 
                    project={this.props.project}
                    callbackSettingListAllClose={{ close: this.callbackSettingListAllClose.bind(this) }}
                    callbackProjectSetting={this.props.callbackProjectSetting} 
                />
                {/* 프로젝트 리스트 */}
                <div className="ProjectSet">
                    <div className="project-description">
                        <hr />
                        <div className="project-description-header">
                            <div className="project-introduce"><b>설명</b></div>
                            {this.props.userProject.roleNo === 1 ?
                                <i className="far fa-edit Icon" onClick={this.onProjectDescCheck.bind(this)}></i> : ""}
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
                                <div style={{ display: 'inline-block' }}><ProjectStatus userProject={this.props.userProject} project={this.props.project} callbackProjectSetting={this.props.callbackProjectSetting} /> </div>
                            </li>

                            {/* 마감일 */}
                            <li>
                                <div style={{ display: 'inline-block' }}><h5><b>마감일</b></h5></div>
                                <div style={{ display: 'inline-block' }}>

                                <div className="dateBtn">
                                    
                                    {!this.props.project.projectStart && !this.props.project.projectEnd && 
                                    <Button variant="" onClick={this.props.callbackProjectSetting.modalStateUpdate} disabled={this.props.userProject.roleNo !== 1 ? true: false} > 
                                    <i className="fas fa-plus fa-1x"></i>
                                    </Button>}
                                    {this.props.project.projectStart && !this.props.project.projectEnd &&
                                     <Button variant="" onClick={this.props.callbackProjectSetting.modalStateUpdate} disabled={this.props.userProject.roleNo !== 1 ? true: false} className="dateButtom"> 
                                    <b className="taskDate">  {this.props.project.projectStart} ~</b> 
                                     </Button>}
                                    {this.props.project.projectStart && this.props.project.projectEnd && 
                                     <Button variant="" onClick={this.props.callbackProjectSetting.modalStateUpdate} disabled={this.props.userProject.roleNo !== 1 ? true: false} className="dateButtom"> 
                                    <b className="taskDate"> {this.props.project.projectStart} ~ {this.props.project.projectEnd}</b> 
                                    </Button>}
                                </div>
                                  {this.props.modalState 
                                      ?<div style={{position:"relative"}}>
                                          <ProjectModalCalendar 
                                              project={this.props.project} 
                                              onClickConfirm={this.onClickConfirm.bind(this)}
                                              from = {this.props.project.projectStart}
                                              to = {this.props.project.projectEnd}
                                              callbackProjectSetting={this.props.callbackProjectSetting}/> 
                                          </div>
                                      : null}
                                </div>

                            </li>

                            {/* 프로젝트 멤버 */}
                            <li>
                                <div style={{ float: 'left' }}>
                                    <h5><b>프로젝트멤버</b></h5>
                                </div>
                                <div style={{ float: 'left' }}>
                                        <Button onClick={this.onUserListOpen.bind(this)} variant="" disabled={this.props.userProject.roleNo && this.props.userProject.roleNo !== 1}><i className="fas fa-plus fa-1x"></i></Button>
                                    <div>
                                        {this.state.userListOpen ?
                                            <ProjectMemberAdd 
                                                project={this.props.project} 
                                                users={this.props.users}
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
                                                            {this.state.isMemberEmailValid ? 
                                                            this.props.loading ? 
                                                            <div style={{textAlign: "center", marginBottom: "14px"}}><img style={{height: "25px"}} src="../assets/images/ajax-loader.gif" /></div> : 
                                                            <input type="button" id="add-member-invite"
                                                                className="btn btn-outline-primary btn-rounded"
                                                                onClick={this.callbackInviteMember.bind(this, this.props.project.projectNo, this.state.inviteMemberEmail, this.state.inviteMemberName)}
                                                                value="멤버 초대하기" /> 
                                                            :
                                                            <input type="button" id="add-member-invite"
                                                                className="btn btn-outline-primary btn-rounded"
                                                                onClick={this.callbackInviteMember.bind(this, this.props.project.projectNo, this.state.inviteMemberEmail, this.state.inviteMemberName)}
                                                                value="멤버 초대하기" disabled />}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div> : ""}
                                    </div>
                                </div>
                                {/* 프로젝트 멤버 리스트 */}
                                <div className="Member-list" style={{ display: 'inline-block' }}>
                                    {this.props.project.members && this.props.project.members.map(member =>
                                        <div className="dropdown" key={member.userNo}>

                                            {sessionStorage.getItem("authUserNo") == member.userNo ? 
                                            <button className="btn btn-default dropdown-toggle Member" type="button" data-toggle="dropdown" disabled>
                                                <img src={member.userPhoto} className="img-circle" alt={member.userPhoto} />
                                                <span>{member.userName}</span>
                                                <span className="delete-member">
                                                    <i className="fas fa-times"></i>
                                                </span>
                                            </button> :
                                            this.props.userProject.roleNo && this.props.userProject.roleNo === 1 ?
                                                <button className="btn btn-default dropdown-toggle Member" type="button" data-toggle="dropdown">
                                                    <img src={member.userPhoto} className="img-circle" alt={member.userPhoto} />
                                                    <span>{member.userName}</span>
                                                    <span className="delete-member" onClick={this.onDelteMember.bind(this, member.userNo)}>
                                                        <i className="fas fa-times"></i>
                                                    </span>
                                                </button> :
                                                <button className="btn btn-default dropdown-toggle Member" type="button" data-toggle="dropdown" disabled>
                                                    <img src={member.userPhoto} className="img-circle" alt={member.userPhoto} />
                                                    <span>{member.userName}</span>
                                                    <span className="delete-member">
                                                        <i className="fas fa-times"></i>
                                                    </span>
                                                </button>}
                                            <div className="dropdown-menu" role="menu">
                                                <div className="dropdown-list">
                                                    <div className="dropdown-list-contents" role="menuitem"
                                                        onClick={this.callbackRoleChange.bind(this, this.props.project.projectNo, member.userNo, 1)}>
                                                        <div className="access-title">
                                                            전체 엑세스
                                                        </div>
                                                        {member.roleNo === 1 ?
                                                            <div className="access-check">
                                                                <i className="fas fa-check"></i>
                                                            </div> : ""}
                                                    </div>
                                                    <div className="dropdown-list-contents" role="menuitem"
                                                        onClick={this.callbackRoleChange.bind(this, this.props.project.projectNo, member.userNo, 2)}>
                                                        <div className="access-title">
                                                            제한 엑세스
                                                        </div>
                                                        {member.roleNo === 2 ?
                                                            <div className="access-check">
                                                                <i className="fas fa-check"></i>
                                                            </div> : ""}
                                                    </div>
                                                    <div className="dropdown-list-contents" role="menuitem"
                                                        onClick={this.callbackRoleChange.bind(this, this.props.project.projectNo, member.userNo, 3)}>
                                                        <div className="access-title">
                                                            통제 엑세스
                                                        </div>
                                                        {member.roleNo === 3 ?
                                                            <div className="access-check">
                                                                <i className="fas fa-check"></i>
                                                            </div> : ""}
                                                    </div>
                                                    <div className="divider"></div>
                                                    <div className="dropdown-list-description" role="menuitem">
                                                        <div className="entire-access-description" role="menuitem">
                                                            <strong style={{ color: "Red" }}>전체 엑세스</strong>
                                                            : 모든 프로젝트 멤버는 프로젝트 안에 있는 업무 보기, 수정이 가능합니다.
                                                        </div>
                                                        <br />
                                                        <div className="limit-access-description" role="menuitem">
                                                            <strong style={{ color: "#808000" }}>제한 엑세스</strong>
                                                            : 모든 프로젝트 멤버는 업무, 제목, 설명, 위치, 시작일, 마감일, 멤버 배정에 대해
                                                            추가/수정을 할 수 없습니다. <br /> 단, 코멘트, 태그, 색상 라벨, 체크 리스트에 대해
                                                            추가/수정은 가능합니다.
                                                        </div>
                                                        <br />
                                                        <div className="control-access-description" role="menuitem">
                                                            <strong style={{ color: "green" }}>통제 엑세스</strong>
                                                            : 프로젝트 멤버는 업무만 볼 수 있습니다. 그 이외 모든 활동은 불가능합니다.
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
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
                                    <Dialog open={this.state.Exist} onClose={this.handleStay.bind(this)}>
                                        <DialogTitle style={{ paddingBottom: "0px" }} onClose={this.handleClose.bind(this)}>
                                            <h2><b>이 프로젝트 나가기</b></h2>
                                        </DialogTitle>
                                        <DialogContent style={{ paddingTop: "0px", fontSize: "17px" }}>
                                            정말 이 프로젝트를 나가시겠습니까?
                                        </DialogContent>
                                        <DialogActions style={{ display: "grid" }}>
                                            <Button variant="outlined" style={{ backgroundColor: '#E6E8EC', color: 'black', fontWeight: 'bold', marginBottom: "7px" }} onClick={this.handleStay.bind(this)}>아니오, 이 프로젝트에 머뭅니다.</Button>
                                            <Button variant="outlined" style={{ backgroundColor: '#FF4040', color: 'white', fontWeight: 'bold' }} onClick={this.handleClose.bind(this)}>네, 이 프로젝트를 나갑니다.</Button>
                                            {this.state.isExistRoleOne ? 
                                            <RoleTransfer roleTransferCloseButton={this.state.roleTransferCloseButton}
                                            project={this.props.project}
                                            roleTransferSetting={{
                                                close: this.callbackRoleTransferClose.bind(this),
                                                projectDelete: this.callbackProjectDelete.bind(this)
                                            }}/> : 
                                            ""}  
                                        </DialogActions>
                                    </Dialog> 
                                </div>
                            </li>

                            {/* 프로젝트 영구삭제 */}
                            <li>
                                <div style={{ display: 'inline-block' }}><h5><b>프로젝트 영구삭제</b></h5></div>
                                <div style={{ display: 'inline-block' }} className="link">
                                    {this.props.userProject.roleNo && this.props.userProject.roleNo === 1 ?
                                    <Button onClick={this.handleProjectDeleteOpen.bind(this)} style={{ backgroundColor: '#E95E51', color: 'white' }}>프로젝트 삭제하기</Button> : 
                                    <Button onClick={this.handleProjectDeleteOpen.bind(this)} style={{ backgroundColor: '#E95E51', color: 'white' }} disabled>프로젝트 삭제하기</Button>}
                                    <Dialog open={this.state.projectDeleteOpen} onClose={this.handleProjectDeleteClose.bind(this)}>
                                        <DialogTitle style={{paddingBottom: "0"}}>
                                            <h2><b>프로젝트 삭제</b></h2>
                                        </DialogTitle>
                                        <DialogContent>
                                        정말 삭제하시겠습니까? <strong>{this.props.project.projectTitle}</strong>이(가) 영구 삭제됩니다.
                                        </DialogContent>
                                        <DialogActions>
                                            <Button variant="outlined" style={{ backgroundColor: '#E6E8EC', color: '#696F7A' }} onClick={this.handleProjectDeleteClose.bind(this)}>아니오</Button>
                                            <Button variant="outlined" style={{ backgroundColor: '#E95E51', color: 'white' }} onClick={this.callbackProjectForeverDelete.bind(this)}>네</Button>
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

