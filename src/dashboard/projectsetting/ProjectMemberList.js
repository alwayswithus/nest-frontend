import React from 'react';

import './projectMemberList.scss';
import ProjectMember from './ProjectMember';

export default class ProjectMemberList extends React.Component {

    // CallBack Project Member List Open and Close
    callbackProjectMemberList() {
        this.props.ProjectMemberListSetting.close();
    }

    render() {
        return (
            <div className="ProjectMemberList">
                <div className="container card-member">
                    <div className="card">
                        <div className="card-header">
                            <h6 style={{ display: "inline-block", fontSize: "14px", marginTop: "15px", marginRight: "220px", fontWeight: "bold", color: "black" }}>멤버</h6>
                            <button type="button" onClick={this.callbackProjectMemberList.bind(this)} className="close" style={{ lineHeight: "35px" }}>&times;</button>
                            <hr style={{ marginTop: "5px", marginBottom: "10px", borderColor: "#E3E3E3" }} />
                        </div>
                        <div className="card-body">
                            <input type="text" className="form-control find-member" placeholder="이름 혹은 이메일로 찾기" />
                            <div className="invite-card-member-list">
                                {this.props.project.members && this.props.project.members
                                    .map(member =>
                                        <ProjectMember member={member} />)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}