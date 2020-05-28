import React from 'react';
import './projectsettinguser.scss'

export default class ProjectSettingUser extends React.Component {

    callbackAddDeleteMember(userNo, userName, userPhoto) {
        this.props.callbackProjectSetting.addDeleteMember(userNo, userName, userPhoto, this.props.project.projectNo);
    }

    render() {
        return (
            <div className="invite-card-member" key={this.props.user.userNo}
                id={this.props.user.userNo} onClick={this.callbackAddDeleteMember.bind(this, this.props.user.userNo, this.props.user.userName, this.props.user.userPhoto)}>
                <img src={this.props.user.userPhoto} className="img-circle" alt={this.props.user.userPhoto} />
                <span>{this.props.user.userName}</span>
                { this.props.project.members.map(member => 
                    member.userNo === this.props.user.userNo ? <i key={member.userNo} className="fas fa-check"></i> : "") }
            </div>
        )
    }
}