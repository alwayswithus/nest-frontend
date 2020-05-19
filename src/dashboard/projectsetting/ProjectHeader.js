import React, { Component } from 'react';
import './Projectheader.scss';

class ProjectHeader extends Component  {
    
    onCloseProjectSetting() {
        this.props.callbackProjectSetting.close(true);
    }

    render() {
        return (
            <div className="ProjectHeader">
                <button type="button" className="close" onClick={ this.onCloseProjectSetting.bind(this) } ><i className="fas fa-times fa-1x"></i></button>
                <div className="Header-list">
                    <h2><b>{this.props.project.projectTitle}</b></h2>
                    <span>작성자 : {this.props.name} • &nbsp;&nbsp;&nbsp; 작성일 : {this.props.project.projectStart}</span>
                </div>
            </div>
        )
    }
}

export default  ProjectHeader;