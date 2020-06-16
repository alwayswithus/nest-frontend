import React from 'react';
import './TransferMember.scss'

export default class TransferMember extends React.Component {

    constructor(){
        super(...arguments)
        this.state = {
            userRole:'',
            active:false
        }
    }
    callbackAddDeleteMember(userNo, userName, userPhoto) {
        this.props.callbackProjectSetting.addDeleteMember(userNo, userName, userPhoto, this.props.project.projectNo);
    }

    onClickRole(userPhoto, userName){
        console.log("!!!")
        this.props.onClose();
        this.props.onUpdateTransferImg(userPhoto, userName);
        // this.props.deleteModalCallbacks.userRoleUpdate(
        //     this.props.member.projectNo, 
        //     this.props.member.userNo,
        //     1)
    }

    render() {
        return (
            <div className="invite-card-member"  key={this.props.member.userNo}
                id={this.props.member.userNo} onClick={this.onClickRole.bind(this, this.props.member.userPhoto,this.props.member.userName)}>
                <img src={this.props.member.userPhoto} className="img-circle" alt={this.props.member.userPhoto} />
                <span>{this.props.member.userName}</span>
            </div>
        )
    }
}