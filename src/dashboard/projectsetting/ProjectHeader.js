import React, { Component } from 'react';
import './Projectheader.scss';

class ProjectHeader extends Component  {
    
    constructor() {
        super(...arguments);
        this.state = {
            projectTitleCheck: false,   // project title input show and hide
            keyword: ""                 // project title input change 
        }
    }

    // CallBack Change Title Function
    callbackProjectTitleChange(event) {
        this.setState({
            keyword: event.target.value.substr(0, 15)
        })
        this.props.callbackProjectSetting.changeTitle(this.props.project.projectNo, this.state.keyword);
    }

    // Project Title Enter Function 
    onInputKeyPress(event) {
        if(event.key === "Enter") {
            this.setState({
                projectTitleCheck: !this.state.projectTitleCheck
            })
        }
    }

    // Project Title Input Show Function
    onProjectTitleCheck() {
        this.setState({
            projectTitleCheck: !this.state.projectTitleCheck,
            keyword: this.props.project.projectTitle
        })
    }

    // Project Setting Close Function
    onCloseProjectSetting() {
        this.props.callbackProjectSetting.close(true);
        this.props.callbackSettingListAllClose.close();
    }

    render() {
        return (
            <div className="ProjectHeader">
                <button type="button" className="close" 
                onClick={this.onCloseProjectSetting.bind(this)}>
                    <i className="fas fa-times fa-1x"></i>
                </button>
                <div className="Header-list">
                    {this.state.projectTitleCheck ? 
                    <div className="project-title-header">  
                        <input className="project-title" type="text" value={this.state.keyword} 
                        onChange={this.callbackProjectTitleChange.bind(this)} 
                        onKeyPress={this.onInputKeyPress.bind(this)}
                        autoFocus />
                        <i className="far fa-edit Icon" onClick={ this.onProjectTitleCheck.bind(this) }></i>
                    </div> :
                    <div className="project-title-header">  
                        <h2><b>{this.props.project.projectTitle}</b></h2>
                        <i className="far fa-edit Icon" onClick={ this.onProjectTitleCheck.bind(this) }></i>
                    </div>}
                    <span>작성자 : {this.props.name} • &nbsp;&nbsp;&nbsp; 작성일 : {this.props.project.projectStart}</span>
                </div>
            </div>
        )
    }
}

export default  ProjectHeader;