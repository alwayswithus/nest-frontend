import React, {Component} from 'react';
import './DeleteModal.scss';
import TransferText from './TransferText'
import ApiService from '../ApiService';

class Modal extends Component {
    constructor(){
        super(...arguments)
        this.state = {
            userProject : []
        }
    }
    onCloseModal(){
        this.props.onClose();
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
                                userProject={this.state.userProject}
                            />
                        </p>
                    </div>
                    <div className="button-wrap">
                        <button onClick = {this.onCloseModal.bind(this)}> Confirm </button>
                    </div>
                </div>
            </React.Fragment>
        )
    }
    componentDidMount(){
        ApiService.fetchUserProjectByUserNo(sessionStorage.getItem("authUserNo"))
        .then(response => 
            this.setState({
                userProject: response.data.data.userProject
            })    
        )
    }
}

export default Modal;