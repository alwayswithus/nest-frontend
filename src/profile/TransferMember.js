import React from 'react';
import './TransferMember.scss'

export default class TransferMember extends React.Component {

    callbackAddDeleteMember(userNo, userName, userPhoto) {
        this.props.callbackProjectSetting.addDeleteMember(userNo, userName, userPhoto, this.props.project.projectNo);
    }

    render() {
        return (
            <div className="invite-card-member" key={this.props.member.userNo}
                id={this.props.member.userNo}
            >
                <img src={this.props.member.userPhoto} className="img-circle" alt={this.props.member.userPhoto} />
                {sessionStorage.getItem("authUserNo") != this.props.member.userNo ? 
                    
                    <span>{this.props.member.userName}</span> : null
                }
                
                <div class="dropdown">
                    <button class="btn dropdown-toggle" type="button" data-toggle="dropdown">
                        {this.props.member.roleNo == 1 ? "전체엑세스" : this.props.member.roleNo == 2 ? "제한엑세스" : "통제엑세스"}
                    <span class="caret"></span></button>
                    <ul class="dropdown-menu">
                        <li><a href="#">전체엑세스</a></li>
                        <li><a href="#">제한엑세스</a></li>
                        <li><a href="#">통제엑세스</a></li>
                    </ul>
                </div>
            </div>
        )
    }
}