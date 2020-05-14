import React, { Component } from 'react';
// import './Projectheader.scss';

class ProjectHeader extends Component  {
    render(){
        return (
            <div className="ProjectHeader">
                <div className="Header-list">
                    <h2><b>Project Name</b></h2>
                    <span>작성자 : {this.props.name} • &nbsp;&nbsp;&nbsp; 작성일 : {this.props.date}</span>
                </div>
            </div>
        )
    }
}

export default  ProjectHeader;