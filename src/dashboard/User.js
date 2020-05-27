import React from 'react';
import './user.scss';

export default class User extends React.Component {

    callbackJoinExitMember(userNo, userName, userPhoto) {
        this.props.callbackUser.joinExitMember(userNo, userName, userPhoto);
    }

    render() {
        return (
            <div className="invite-card-member" id={this.props.user.userNo} onClick={this.callbackJoinExitMember.bind(this, this.props.user.userNo, this.props.user.userName, this.props.user.userPhoto)}>
                <img src={this.props.user.userPhoto} className="img-circle" alt={this.props.user.userPhoto} />
                <span>{this.props.user.userName}</span>
                { this.props.members.map(member => 
                    member.memberNo === this.props.user.userNo ? <i key={member.memberNo} className="fas fa-check"></i> : "") }
            </div>
        )
    }
}