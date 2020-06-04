import React, { Component } from "react";
import "./TopBar.scss";
import { Link } from 'react-router-dom'

class TopBar extends Component {

  
  render() {
    const kanbanboard = this.props.activePath.indexOf("kanbanboard") !== -1
    const timeline = this.props.activePath.indexOf("timeline") !== -1
    const file = this.props.activePath.indexOf("file") !== -1
    // const log = this.props.activePath.indexOf("log") !== -1
    return (
      <>
        <div className="topBar">
          <nav className="navbar navbar-default">
            <div className="container-fluid">
              <div className="navbar-header col-sm-1">
                <Link to={`#`} className="navbar-brand">
                  NEST
                </Link>
              </div>
              <div className="col-sm-10 topCenterOut">
                <div className="topCenterIn">
                  <ul className="nav navbar-nav">
                    <li className={kanbanboard === true ? "active" : null}>
                      <Link to={`/nest/dashboard/${this.props.projectNo}/kanbanboard`}>업무</Link>
                    </li>
                    <li className={timeline === true ? "active" : null}>
                      <Link to={`/nest/dashboard/${this.props.projectNo}/timeline`}>타임라인</Link>
                    </li>
                    <li className={file === true ? "active" : null}>
                      <Link to={`/nest/dashboard/${this.props.projectNo}/file`}>파일</Link>
                    </li>
                    <li>
                      <Link to="#">활동로그</Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-sm-1">
                <ul className="nav navbar-nav navbar-right">
                  <i className="fas fa-cog fa-2x fa-spin gearIcon"></i>
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </>
    );
  }
}

export default TopBar;
