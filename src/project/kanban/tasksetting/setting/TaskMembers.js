import React from 'react';
import './TaskMembers.scss'

export default class TaskMembers extends React.Component {

    callbackAddDeleteMember(userNo) {
        this.props.taskCallbacks.addDeleteMember(
            userNo,
            this.props.projectMembers,
            this.props.taskListNo,
            this.props.taskNo)
    }

    render() {
        return (
            <div className="invite-card-member" key={this.props.projectMember.userNo}
                id={this.props.projectMember.userNo} 
                onClick={this.callbackAddDeleteMember.bind(this, this.props.projectMember.userNo, this.props.projectMember.userName, this.props.projectMember.userPhoto)}>
                <img src={this.props.projectMember.userPhoto} className="img-circle" alt={this.props.projectMember.userPhoto} />
                <span>{this.props.projectMember.userName}</span>
                { this.props.taskItem.memberList.map(member => 
                    member.userNo === this.props.projectMember.userNo ? <i key={this.props.projectMember.userNo} className="fas fa-check"></i> : "") }
            </div>
        )
    }
}