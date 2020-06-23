import React, { Component } from "react";
import "./TopBar.scss";
import { Link } from 'react-router-dom'

class TopBar extends Component {

  constructor(){
    super(...arguments)
    this.state ={
      historyOpen:false,
      searchKeyword:"",
      
    }
  }
  onProjectSetting(){
    this.props.callbackPorjectSetting.onProjectSetting(this.props.projectNo)
  
  }

  onClickHistory(){
    window.jQuery(".wrap, .topRight a").toggleClass('active');
  }


  selectpicker(e) {
    this.setState({
      selectPicker: e.target.value,
      searchKeyword:"",
    });
  }
  
  render() {
    let activePath = this.props.activePath.split('/')[4];
    
    const kanbanboard = activePath.indexOf("kanbanboard") !== -1
    const timeline = activePath.indexOf("timeline") !== -1
    const file = activePath.indexOf("file") !== -1


    return (
      <>
      <div className='wrap'>
        <div className='content'>
        {this.props.history.length === 0 ? 
          <>
            <i className="fas fa-sad-tear"></i>
            <div className="log-warning">활동기록이 없습니다.</div>
          </> :
          this.props.history.map(history => 
            <div className="message">
              <span><strong>{history.logContents.split("님이")[0]}</strong>님이&nbsp; 
                {history.logContents.split("님이")[1]}
              </span>
          </div>
          )}
        </div>
      </div>
        <div className="topBar">
            <div className="container-fluid">
          {/* <nav class=""> */}
            <div class="row">
              <div className="col-sm-4 topLeft">
              <ul class="">
                  <li className={kanbanboard === true ? "active" : ""}><Link to={`/nest/dashboard/${this.props.projectNo}/kanbanboard`}><a>업무</a></Link></li>
                  <li className={file === true ? "active" : ""}><Link to={{pathname:`/nest/dashboard/${this.props.projectNo}/file`, state:{history : this.props.history}}}><a>파일</a></Link></li>
                </ul>
              </div>

              <div class="col-sm-4 topCenter">
                  <a>{this.props.projectTitle}</a>
              </div>

              <div className="col-sm-4 topRight">
              {kanbanboard ?
                <ul class="">
                    <li><a href="#" onClick={this.onClickHistory.bind(this)}>활동로그</a></li>
                    <li><Link to={`/nest/dashboard/${this.props.projectNo}/kanbanboard`}><i className="fas fa-cog fa-2x gearIcon" onClick={this.onProjectSetting.bind(this)}></i></Link>  </li>
                </ul>
                :null}
              </div>
            </div>
          {/* </nav> */}
          {/* <nav className="navbar navbar-default">
            <div className="container-fluid">
              <div className="navbar-header col-sm-4 topCenterOut">
                <div className="topCenterIn">
                  <ul className="nav navbar-nav">
                    <li className={kanbanboard === true ? "topli active" : "topli"}>
                      <Link to={`/nest/dashboard/${this.props.projectNo}/kanbanboard`}>업무</Link>
                    </li>
                    <li className={file === true ? "topli active" : "topli"}>
                      <Link to={{pathname:`/nest/dashboard/${this.props.projectNo}/file`, state:{history : this.props.history}}}>파일</Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="navbar-header col-sm-4 navbar-brand">
                {this.props.projectTitle}
              </div>
              <div className="col-sm-4 topRightSide">
                {kanbanboard ?
                <ul className="nav navbar-nav navbar-right" >
                  <li>
                      <a href="#" onClick={this.onClickHistory.bind(this)}>활동로그</a>
                    </li>
                    <li>
                    <i className="fas fa-cog fa-2x gearIcon" onClick={this.onProjectSetting.bind(this)}></i> 
                    </li>
                </ul> :null}
              </div>
            </div>
          </nav> */}
          </div>
        </div>
      </>
    );
  }
}

export default TopBar;
