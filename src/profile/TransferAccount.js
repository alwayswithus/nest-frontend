import React, { Component } from 'react';
import ProfileProjectMember from './ProfileProjectMember';
import ReactTooltip from 'react-tooltip';
import { times } from 'lodash';

class TransferAccount extends Component {
    constructor(){
        super(...arguments)
        this.state = {
            open:false,
            projectNo:'',
            transferMemberPhoto:'/nest/assets/images/no-profile.jpg',
            transferMemberName:'미정'
        }
    }

    onClickProjectTitle(projectNo) {
        this.setState({
            open:!this.state.open,
            projectNo:projectNo
        })
    }

    onCloseProjectMember(){
        this.setState({
            open:false
        })
    }

    onUpdateTransferImg(userPhoto,userName){
        this.setState({
            transferMemberPhoto:userPhoto,
            transferMemberName:userName
        })
    }
    render() {
        console.log()
        return (
            <div>
                {this.props.project.roleNo == '1' ?
                    <div style={{ margin: '2%' }}>
                        <div className="project-title-transfer" >{this.props.project.projectTitle}</div>
                        <img className="project-user-photo" src={this.state.transferMemberPhoto} data-tip={this.state.transferMemberName} data-place="bottom" onClick={this.onClickProjectTitle.bind(this, this.props.project.projectNo)} />
                        <ReactTooltip />
                        <i className="fas fa-arrow-right"></i>
                        <img alt={`${sessionStorage.getItem("authUserPhoto")}`} data-tip={`${sessionStorage.getItem("authUserName")}`} src={`${sessionStorage.getItem("authUserPhoto")}`} className="project-user-photo"></img>
                        <ReactTooltip />
                    </div>
                    : null}
                
                        {this.state.open ? 
                        <ProfileProjectMember 
                            deleteModalCallbacks={this.props.deleteModalCallbacks}
                            projectNo={this.state.projectNo}
                            project={this.props.project}
                            onUpdateTransferImg={this.onUpdateTransferImg.bind(this)}
                            onClose={this.onCloseProjectMember.bind(this)}
                        /> : null}
            </div>
        )
    }
}

export default TransferAccount;