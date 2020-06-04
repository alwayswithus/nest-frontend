import React from 'react';

import './projectMember.scss';

export default class ProjectMember extends React.Component {

    render() {
        return (
            <div className="invite-card-member" key={this.props.member.userNo}
                id={this.props.member.userNo}>
                <img src={this.props.member.userPhoto} className="img-circle" alt={this.props.member.userPhoto} />
                <span style={{color: "black", fontSize: "14px"}}>{this.props.member.userName}</span>
            </div>
        )
    }
}