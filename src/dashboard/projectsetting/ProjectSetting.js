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
import update from 'react-addons-update';

class ProjectSetting extends Component {
    constructor() {
        super(...arguments)
        this.state = {
            Exist: false,
            Delete: false,

            show: false,
            memberListOpen: false,
            members: [this.props.members]
        }
        console.log("!!!!!!" + this.state.members)
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

    onSubmit(date) {
        console.log("date:", date)
    }

    // + 버튼을 눌렀을 때 memberList 창이 뜸.
    addMemberList() {
        this.setState({
            memberListOpen: !this.state.memberListOpen
        })
    }

    // x 버튼을 눌렀을 때 memberList창 닫음.(call back 함수)
    callbackCloseMember(state) {
        this.setState({
            memberListOpen: state
        })
    }

    callbackAddMember(members) {
        this.setState({
            members:members
        })
    }

    // 프로젝트 멤버 삭제하는 함수
  onDelteMember(memberNo) {
    const memberIndex = this.state.members.findIndex(
      (member) => member.member_no === memberNo
    );
    console.log(memberIndex);

   let deleteMember = update(this.state.members, {
      $splice: [[memberIndex, 1]]
    })

    this.setState({
      members: deleteMember
    })
  }
    render() {
        // console.log("projectSetting:" + this.props.project)
        console.log("projectSetting:" + this.state.members)
        return (
            <div style={{ height: '100%', position: 'relative', marginLeft: "65.7%" }}>
                {/* 프로젝트 헤더 */}
                <ProjectHeader project={this.props.project} name='김우경' callbackCloseProjectSetting={this.props.callbackCloseProjectSetting} />
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
                                    <h5>
                                        <b>프로젝트멤버</b>
                                    </h5>
                                </div>
                                <div style={{ float: 'left' }}>
                                    <Button onClick={this.addMemberList.bind(this)} variant=""><i className="fas fa-plus fa-1x"></i> </Button>
                                    <div>
                                        {this.state.memberListOpen ? <ProjectMemberAdd 
                                                callbackMembers={{ 
                                                    close: this.callbackCloseMember.bind(this),
                                                    addMember : this.callbackAddMember.bind(this)}} /> : ""}
                                    </div>
                                </div>
                                {/* 프로젝트 멤버 리스트 */}
                                <div className="Member-list" style={{ display: 'inline-block' }}>
                                        {/* <img src="assets/images/unnamed.jpg" className="img-circle" alt="Cinque Terre" />
                                            <span>test</span> */}
                                        {this.props.members && this.props.members.map(member => 
                                        <div className="Member">
                                            <img src={member.member_photo} className="img-circle" alt="Cinque Terre" />
                                            <span>{member.member_name}</span>
                                            <span className="delete-member" onClick={ this.onDelteMember.bind(this, member.member_no) }>
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

