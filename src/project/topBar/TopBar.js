import React, { Component } from "react";
import "./TopBar.scss";

class TopBar extends Component {
  render() {
    return (
      <>
        <div className="topBar">
          <nav className="navbar navbar-default">
            <div className="container-fluid">
              <div className="navbar-header col-sm-1">
                <a className="navbar-brand" href="#">
                  NEST
                </a>
              </div>
              <div className="col-sm-10 topCenterOut">
                <div className="topCenterIn">
                  <ul className="nav navbar-nav">
                    <li className="active">
                      <a href={`/nest/dashboard/${this.props.projectNo}/kanbanboard`}>업무</a>
                    </li>
                    <li>
                      <a href={`/nest/dashboard/${this.props.projectNo}/timeline`}>타임라인</a>
                    </li>
                    <li>
                      <a href={`/nest/dashboard/${this.props.projectNo}/file`}>파일</a>
                    </li>
                    <li>
                      <a href="#">활동로그</a>
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
