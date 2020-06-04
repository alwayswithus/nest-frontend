import React from 'react';

import './projectMember.scss';

export default class ProjectMember extends React.Component {

    callbackImageChange(userNo, userName, userPhoto) {
        this.props.ProjectMemberListSetting.imageChange(userNo, userName, userPhoto);
    }

    render() {
        return (
            <div className="invite-card-member"
                id={this.props.member.userNo}
                onClick={this.callbackImageChange.bind(this, this.props.member.userNo, this.props.member.userName, this.props.member.userPhoto)}>
                <img src={this.props.member.userPhoto} className="img-circle" alt={this.props.member.userPhoto} />
                <span style={{color: "black", fontSize: "14px"}}>{this.props.member.userName}</span>
            </div>
        )
    }
}