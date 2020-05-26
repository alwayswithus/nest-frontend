import React, { Component } from 'react';
import './header.scss';
import Navigation from '../TaskSetNav';

class Header extends Component {
    onClickCloseTaskSetting(){
        console.log("close!")
    }
    render(){
    return (
        <div style={{display:'block'}} id= "taskSettingHeader" className="Header">
            <i onClick={this.onClickCloseTaskSetting.bind(this)} className="fas fa-times fa-1x"></i>
            <div className="Header-list">
                <h2><b>{this.props.taskContents}</b></h2>
                <span>작성자 : {this.props.name} • &nbsp;&nbsp;&nbsp; 작성일 : {this.props.date}</span>
            </div>
            <Navigation params = {this.props.params} />
        </div>
    )
    }
}

export default Header;