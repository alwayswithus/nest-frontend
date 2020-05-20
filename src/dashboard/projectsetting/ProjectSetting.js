import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import './projectset.scss';
import ProjectHeader from './ProjectHeader';
import ProjectStatus from './ProjectStatus';
import ModalCalendar2 from '../../modalCalendar/ModalCalendar2';
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
            userListOpen: false
        }
    }

    // User List Close Function
    callbackCloseUserList(userListOpen) {
        this.setState({
            userListOpen: userListOpen
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

    // User List Open Function
    onUserListOpen() {
        this.setState({
            userListOpen: !this.state.userListOpen
        })
    }

    onSubmit(date) {
        console.log("date:", date)
    }

    // Delete Member in Porject Function
    onDelteMember(memberNo) {
        this.props.callbackProjectSetting.deleteMember(memberNo, this.props.project.projectNo)
    }
    render() {
        return (
            <div style={{ height: '100%', position: 'relative', marginLeft: "65.7%" }}>
                {/* 프로젝트 헤더 */}
                <ProjectHeader project={this.props.project} name='김우경' callbackProjectSetting={this.props.callbackProjectSetting} />
                {/* 프로젝트 리스트 */}
                <div className="ProjectSet" >
                    <hr />
                    <div style={{ color: '#60C7CA', fontSize: '1.3rem', padding: '3%' }}><b>설명 추가</b></div>
                    <hr style={{ marginBottom: '20px', color: '#555555' }} />
                    <div className="setList">
                        <ul>
                            {/* 프로젝트상태 */}
                            <li>
                                <div style={{ display: 'inline-block' }}><h5><b>프로젝트 상태</b></h5></div>
                                <div style={{ display: 'inline-block' }}><ProjectStatus project={this.props.project} /> </div>
                            </li>

                            {/* 마감일 */}
                            <li>
                                <div style={{ display: 'inline-block' }}><h5><b>마감일</b></h5></div>
                                <div style={{ display: 'inline-block' }}>
                                    <Button onClick={this.handleClickOpenCalendar.bind(this)} variant=""><i className="fas fa-plus fa-1x"></i></Button>
                                    {this.state.show ? <ModalCalendar2 onSubmit={this.onSubmit.bind(this)} /> : ""}
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
                                            callbackCloseUserList={{close: this.callbackCloseUserList.bind(this)}} 
                                            callbackProjectSetting={this.props.callbackProjectSetting}/> : ""}
                                    </div>
                                </div>
                                {/* 프로젝트 멤버 리스트 */}
                                <div className="Member-list" style={{ display: 'inline-block' }}>
                                    {this.props.project.members && this.props.project.members.map(member =>
                                        <div className="Member" key={member.memberNo}>
                                            <img src={member.memberPhoto} className="img-circle" alt={member.memberPhoto} />
                                            <span>{member.memberName}</span>
                                            <span className="delete-member" onClick={this.onDelteMember.bind(this, member.memberNo)}>
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

