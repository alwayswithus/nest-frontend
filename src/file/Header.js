import React from 'react';
import './header.scss';
import Navigation from '../tasksetting/Navigation';

const Header = (props) => {
    return (
        <div className="Header">
            <div className="Header-list">
                <h2><b>Project Name</b></h2>
                <span>작성자 : {props.name} • &nbsp;&nbsp;&nbsp; 작성일 : {props.date}</span>
            </div>
            <Navigation />
        </div>
    )
}

export default Header;