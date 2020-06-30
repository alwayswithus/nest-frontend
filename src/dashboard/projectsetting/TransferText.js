import React from 'react';
import ReactTooltip from 'react-tooltip';

import ProjectMemberList from './ProjectMemberList';
import './transferText.scss';


export default class TransferText extends React.Component {

    constructor() {
        super(...arguments)

        this.state = {
            imageChange: false,
            projectMemberList: false,
            userNo: null,
            userName: "",
            userPhoto: "",
            userNumber: ""
        }
    }

    // CallBack Project Member List Open and Close
    callbackProjectMemberList() {
        this.setState({
            projectMemberList: false
        })
    }

    // CallBack Image Change Function
    callbackImageChange(userNo, userName, userPhoto) {
        this.setState({
            userNumber: userNo,
            imageChange: true,
            userNo: userNo,
            userName: userName,
            userPhoto: userPhoto,
            projectMemberList: false
        })

        this.props.TransferTextSetting.getData(userNo, userName, userPhoto)
    }

    // Project Member List Open and Close
    onProjectMember() {
        this.setState({
            projectMemberList: !this.state.projectMemberList
        })
    }

    render() {
        return (
            <div className="TransferText02">
                <div className="transfer">
                    <img className="img-authUser" src={window.sessionStorage.getItem("authUserPhoto")}
                        data-tip={window.sessionStorage.getItem("authUserName")}
                        data-place="bottom" />
                    <ReactTooltip />
                    <i className="fas fa-arrow-right"></i>
                    {this.state.imageChange ? 
                    <img className="img-roleUser" src={this.state.userPhoto} onClick={this.onProjectMember.bind(this)} data-tip={this.state.userName} data-place="bottom" /> :
                    <img className="img-roleUser" src='/nest/assets/images/no-profile.jpg' data-tip={this.state.userName} data-place="bottom" onClick={this.onProjectMember.bind(this)} />}
                    <ReactTooltip />
                    {this.state.projectMemberList ?
                        <ProjectMemberList
                            ProjectMemberListSetting={{
                                close: this.callbackProjectMemberList.bind(this),
                                imageChange: this.callbackImageChange.bind(this)
                            }}
                            userNumber={this.state.userNumber}
                            project={this.props.project} /> :
                        ""}
                </div>
            </div>
        )
    }
}