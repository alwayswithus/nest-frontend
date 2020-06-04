import React from 'react';
import ReactTooltip from 'react-tooltip';

import ProjectMemberList from './ProjectMemberList';
import './transferText.scss';


export default class TransferText extends React.Component {

    constructor() {
        super(...arguments)

        this.state = {
            projectMemberList: false
        }
    }

    // CallBack Project Member List Open and Close
    callbackProjectMemberList() {
        this.setState({
            projectMemberList: false
        })
    }

    // Project Member List Open and Close
    onProjectMember() {
        this.setState({
            projectMemberList: !this.state.projectMemberList
        })
    }

    render() {
        return (
            <div className="TransferText">
                <div className="transfer">
                    <img className="img-authUser" src={window.sessionStorage.getItem("authUserPhoto")}
                        data-tip={window.sessionStorage.getItem("authUserName")}
                        data-place="bottom" />
                    <i className="fas fa-arrow-right"></i>
                    <img className="img-roleUser" src='/nest/assets/images/no-profile.jpg' onClick={this.onProjectMember.bind(this)} />
                    {this.state.projectMemberList ?
                        <ProjectMemberList
                            ProjectMemberListSetting={{close: this.callbackProjectMemberList.bind(this)}}
                            project={this.props.project} /> :
                        ""}
                </div>
                <ReactTooltip />
            </div>
        )
    }
}