import React, {Component} from 'react';
import Button from 'react-bootstrap/Button';
import './projectset.scss';
import Header from '../file/Header';
import ProjectStatus from './ProjectStatus';
import ModalCalendar from '../calendar/ModalCalendar';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

class ProjectSetting extends Component {
    constructor() {
        super(...arguments)
        this.state = {
            Calendaropen:false,
            Exist:false,
            Delete:false
        }
    }

    handleClickOpenCalendar() {
        this.setState({
            Calendar:true,
            Exist:false
        })
    }

    handleClickOpenExit() {
        this.setState({
            Calendar:false,
            Exist:true
        })
    }

    handleClickOpenDel () {
        this.setState({
            Calendar:false,
            Exist:false,
            Delete:true
        })
    }
    handleClose() {
        this.setState({
            Calendar:false,
            Exist:false,
            Delete:false
        })
    }
    render(){
        
    return (
        <div className="ProjectSet">
            <Header name='김우경' date='2020.05.06'/>
            <div style={{fontSize:'1.3rem'}}>설명 추가</div>
            <hr style={{marginBottom:'20px', color:'#555555'}}/>
            <div className="setList">
                <ul>
                    <li>
                        <div><h5><b>프로젝트 상태</b></h5></div>
                        <div><ProjectStatus /> </div>
                    </li>
                    <li>
                        <div><h5><b>마감일</b></h5></div>
                        <div>
                            <Button onClick = {this.handleClickOpenCalendar.bind(this) } variant=""><i class="fas fa-plus fa-1x"></i></Button>
                            <Dialog onClose={this.handleClose.bind(this)} open={this.state.Calendar}>
                                <DialogTitle onClose={this.handleClose.bind(this)}>
                                    <b>일정 설정</b>
                                </DialogTitle>
                                <DialogContent>
                                    <ModalCalendar />
                                </DialogContent>
                                <DialogActions>
                                    <Button variant="outlined" color="primary" onClick={this.handleClose.bind(this)}>닫기</Button>
                                </DialogActions>
                            </Dialog>
                        </div>
                      
                    </li>
                    <li>
                        <div><h5><b>프로젝트멤버</b></h5></div>
                        <div><Button variant=""><i class="fas fa-plus fa-1x"></i> </Button></div>
                    </li>
                    <li>
                        <div><h5><b>csv로 내보내기</b></h5></div>
                        <div className="link"><button>csv로 내보내기</button></div>
                    </li>
                    <li>
                        <div><h5><b>프로젝트 나가기</b></h5></div>
                        <div className="link">
                            <button onClick = {this.handleClickOpenExit.bind(this)}>프로젝트 나가기</button>
                            <Dialog onClose={this.handleClose.bind(this)} open={this.state.Exist}>
                                <DialogTitle onClose={this.handleClose.bind(this)}>
                                    <h2><b>이 프로젝트 나가기</b></h2>
                                </DialogTitle>
                                <DialogContent>
                                    정말 이 프로젝트를 나가시겠습니까?
                                </DialogContent>
                                <DialogActions>
                                    <Button variant="outlined" style={{backgroundColor:'#FF4040', color:'white'}} onClick={this.handleClose.bind(this)}>닫기</Button>
                                </DialogActions>
                            </Dialog>
                        </div>
                    </li>
                    <li>
                        <div><h5><b>프로젝트 영구삭제</b></h5></div>
                        <div className="link">
                            <button onClick = {this.handleClickOpenDel.bind(this)} style={{backgroundColor:'#FF4040' , color:'white'}}>프로젝트 삭제하기</button>
                            <Dialog onClose={this.handleClose.bind(this)} open={this.state.Delete}>
                                <DialogTitle onClose={this.handleClose.bind(this)}>
                                    <h2><b>프로젝트 삭제</b></h2>
                                </DialogTitle>
                                <DialogContent>
                                    정말 삭제하시겠습니까? Project Name이 영구 삭제됩니다.
                                </DialogContent>
                                <DialogActions>
                                    <Button variant="outlined" style={{backgroundColor:'#FF4040', color:'white'}} onClick={this.handleClose.bind(this)}>닫기</Button>
                                </DialogActions>
                            </Dialog>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    )
    }
}
export default ProjectSetting;

