import React, { Component } from 'react';
import './header.scss';
import Navigation from '../TaskSetNav';
import {Link} from 'react-router-dom';

class Header extends Component {

    render(){
    return (
        <div style={{display:'block'}} id= "taskSettingHeader" className="Header">
            <Link to = {`/nest/dashboard/${this.props.projectNo}/kanbanboard`} onClick={this.props.onClickTag}><i className="fas fa-times fa-1x"></i></Link>
            <div className="Header-list">
                <h2><b>{this.props.taskContents}</b></h2>
                <span>작성자 : {this.props.name} • &nbsp;&nbsp;&nbsp; 작성일 : {this.props.date}</span>
            </div>
            <Navigation params = {this.props.params} projectNo={this.props.projectNo} />
        </div>
    )
    }
}

export default Header;