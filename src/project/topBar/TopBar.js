import React, { Component } from "react";
import "./TopBar.scss";
import { Link } from 'react-router-dom'

class TopBar extends Component {

  onProjectSetting(){
    this.props.callbackPorjectSetting.onProjectSetting(this.props.projectNo)
  
  }

  render() {
    let activePath = this.props.activePath.split('/')[4];
    
    const kanbanboard = activePath.indexOf("kanbanboard") !== -1
    const timeline = activePath.indexOf("timeline") !== -1
    const file = activePath.indexOf("file") !== -1

    // const log = this.props.activePath.indexOf("log") !== -1
    // console.log(this.props.history)
    return (
      <>
        <div className="topBar">
          <nav className="navbar navbar-default">
            <div className="container-fluid">
              <div className="navbar-header col-sm-3">
                <Link to={`#`} className="navbar-brand">
                  <b>{this.props.projectTitle}</b>
                </Link>
              </div>
              <div className="col-sm-6 topCenterOut">
                <div className="topCenterIn">
                  <ul className="nav navbar-nav">
                    <li className={kanbanboard === true ? "active" : null}>
                      <Link to={`/nest/dashboard/${this.props.projectNo}/kanbanboard`}>업무</Link>
                    </li>
                    <li className={timeline === true ? "active" : null}>
                      <Link to={`/nest/dashboard/${this.props.projectNo}/timeline`}>타임라인</Link>
                    </li>
                    <li className={file === true ? "active" : null}>
                      <Link to={{pathname:`/nest/dashboard/${this.props.projectNo}/file`, state:{history : this.props.history}}}>파일</Link>
                    </li>
                    <li>
                      <div className="popover__wrapper">
                          <span className="popover__title">활동로그</span>
                          {/* log lists */}
                        <div className="popover__content">
                          {/* log */}
                          <p className="popover__message">
                            {this.props.history.length == 0 ? 
                            <>
                              <i className="fas fa-sad-tear"></i>
                              <div className="log-warning">활동기록이 없습니다.</div>
                            </> :
                           this.props.history.map(history => 
                              <div className="message">
                                <span><strong>{history.logContents.split("님이")[0]}</strong>님이&nbsp; 
                                {history.logContents.split("님이")[1]}</span>
                              </div>
                                                         
                            )}
                          </p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-sm-3">
                <ul className="nav navbar-nav navbar-right" >
                  <i className="fas fa-cog fa-2x gearIcon" onClick={this.onProjectSetting.bind(this)}></i>
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
