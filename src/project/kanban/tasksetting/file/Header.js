import React, { Component } from 'react';
import './header.scss';
import Navigation from '../TaskSetNav';

class Header extends Component {
    render(){
        console.log("------->", this.props.taskContents);
    return (
        <div className="Header">
            <div className="Header-list">
                <h2><b>{this.props.taskContents}</b></h2>
                <span>작성자 : {this.props.name} • &nbsp;&nbsp;&nbsp; 작성일 : {this.props.date}</span>
            </div>
            <Navigation />
        </div>
    )
    }
}

export default Header;