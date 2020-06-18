import React, {Component} from 'react';
import './DeleteModal.scss';
import TransferText from './TransferText'
import ApiService from '../ApiService';
import update from 'react-addons-update';
import {Link} from 'react-router-dom';

const API_URL = "http://localhost:8080/nest";
const API_HEADERS = {
  'Content-Type': 'application/json'
}

class Modal extends Component {
    constructor(){
        super(...arguments)
        this.state = {
            projects : [],
            delete:false,
            confirmArray: [],//프로젝트 번호 담는 배열
            userNoArray:[], // 회원 담는 배열,
            transferOk:false,
            allProjectUser:[]
        }
    }

    onCloseModal(){
        this.props.onClose();
    }

    onUpdateDeleteState(){
        console.log("!!!")
    }

    onDeleteAccount(){
        console.log(this.state.allProjectUser)
        if(this.state.transferOk){
            fetch(`${API_URL}/api/userproject/transferrole/${sessionStorage.getItem("authUserNo")}`, {
                method: 'post',
                headers: API_HEADERS,
                body: JSON.stringify(this.state.allProjectUser)
            })
        }
    }

    userRoleUpdate(projectNo, userNo, roleNo, array){
        let projectIndexArray =[];
        let index = [];

        const projectIndex = this.state.projects.findIndex(project => project.projectNo === projectNo);

        array.map(array => projectIndexArray.push(array.projectNo))

        index.push(this.state.projects.map(project => projectIndexArray.indexOf(project.projectNo)))

        if(index[0].indexOf(-1) == -1){
            this.setState({
                delete:true,
                transferOk:true,
                allProjectUser:{array}
            })
        }
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
                                delete={this.state.delete}
                                userNoArray={this.state.userNoArray}
                                confirmArray={this.state.confirmArray}
                                projects={this.state.projects}
                            />
                        </p>
                    </div>
                    {this.state.delete ? 
                    <>
                        <div className="delete-warning-message">
                            <span>아래 delete 버튼을 누르면 본 계정은 정말로 삭제됩니다. 삭제하시려면 아래 버튼을 눌러주세요</span>
                        </div>
                        <div className="button-wrap-delete">
                            <Link to = "/nest/"><button onClick = {this.onDeleteAccount.bind(this)}> Delete </button></Link>
                        </div></> : 
                        <div className="button-wrap">
                        <button onClick = {this.onCloseModal.bind(this)}> Confirm </button>
                    </div>
                    }
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