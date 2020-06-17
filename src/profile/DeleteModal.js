import React, {Component} from 'react';
import './DeleteModal.scss';
import TransferText from './TransferText'
import ApiService from '../ApiService';
import update from 'react-addons-update';

const API_URL = "http://192.168.1.223:8080/nest";
const API_HEADERS = {
  'Content-Type': 'application/json'
}

class Modal extends Component {
    constructor(){
        super(...arguments)
        this.state = {
            projects : [],
            delete:false
        }
    }
    onCloseModal(){
        this.props.onClose();
    }

    onUpdateDeleteState(){
        console.log("!!!")
    }

    userRoleUpdate(projectNo, userNo, roleNo){
        console.log(this.state.userProject)
        const projectIndex = this.state.projects.findIndex(project => project.projectNo === projectNo);

        let userProject = {
        projectNo: projectNo,
        userNo: userNo,
        roleNo: roleNo
        }

        // fetch(`${API_URL}/api/userproject/rolechange`, {
        // method: 'post',
        // headers: API_HEADERS,
        // body: JSON.stringify(userProject)
        // })
        // .then(response => response.json())
        // .then(json => {
        //     let newProject = update(this.state.projectMembers, {
        //         [projectIndex]: {
        //             roleNo:{$set:roleNo}
        //         }
        //     })

        //     this.setState({
        //         projectMembers: newProject,
        //     })
        // })
    }
    render(){
        return (
            <React.Fragment>
                <div className="Modal-overlay" />
                <div className="Modal">
                    <p className="title">소유권 이전하기</p>
                    <p className="warning-message">계정을 삭제하기 전에 회원님의 워크스페이스, 프로젝트 업무, 대화채널 소유권을 다른 팀원에게 이전해야 합니다.</p>
                    <div className="content">
                        <p>
                            <TransferText 
                                deleteModalCallbacks={{
                                    onUpdateDeleteState:this.onUpdateDeleteState.bind(this),
                                    userRoleUpdate:this.userRoleUpdate.bind(this)
                                }}
                                
                                projects={this.state.projects}
                            />
                        </p>
                    </div>
                    {this.state.delete ? <div>계정삭제하기</div> : null}
                    <div className="button-wrap">
                        <button onClick = {this.onCloseModal.bind(this)}> Confirm </button>
                    </div>
                </div>
            </React.Fragment>
        )
    }
    componentDidMount(){
        ApiService.fetchDashboard()
        .then(response => 
            this.setState({
                projects:response.data.data.allProject
            })
        )
    }
}

export default Modal;