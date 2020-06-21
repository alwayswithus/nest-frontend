import React, { Component } from "react";
import "./TopBar.scss";
import { Link } from 'react-router-dom'

class TopBar extends Component {

  constructor(){
    super(...arguments)
    this.state ={
      historyOpen:false
    }
  }
  onProjectSetting(){
    this.props.callbackPorjectSetting.onProjectSetting(this.props.projectNo)
  
  }

  onClickHistory(){
    this.setState({
      historyOpen:!this.state.historyOpen
    })
  }

  selectpicker(e) {
    this.setState({
      selectPicker: e.target.value,
      searchKeyword:""
    });
  }
  render() {
    let activePath = this.props.activePath.split('/')[4];
    
    const kanbanboard = activePath.indexOf("kanbanboard") !== -1
    const timeline = activePath.indexOf("timeline") !== -1
    const file = activePath.indexOf("file") !== -1

    // const log = this.props.activePath.indexOf("log") !== -1

    return (
      <>
        <div className="topBar">
          <nav className="navbar navbar-default">
            <div className="container-fluid">
              <div className="col-sm-4 topCenterOut">
                <div className="topCenterIn">
                  <ul className="nav navbar-nav">
                    <li className={kanbanboard === true ? "topli active" : "topli"}>
                      <Link to={`/nest/dashboard/${this.props.projectNo}/kanbanboard`}>업무</Link>
                    </li>
                    {/* <li className={timeline === true ? "topli active" : "topli"}>
                      <Link to={`/nest/dashboard/${this.props.projectNo}/timeline`}>타임라인</Link>
                    </li> */}
                    <li className={file === true ? "topli active" : "topli"}>
                      <Link to={{pathname:`/nest/dashboard/${this.props.projectNo}/file`, state:{history : this.props.history}}}>파일</Link>
                    </li>
                    
                  </ul>
                    <form class="navbar-form navbar-left">
                    <div class="form-group">
                      <input type="text" class="form-control" placeholder="Search" name="search"></input>
                    </div>
                    <select
                      className="selectpicker"
                      // onChange={this.selectpicker.bind(this)}
                    >
                      <option className="option" value="task">
                        업무
                      </option>
                      <option className="option" value="tag">
                        태그
                      </option>
                    </select>
                  </form>
                </div>
              </div>
              <div className="navbar-header col-sm-4 navbar-brand">
              {this.props.projectTitle}
                {/* <div className="navbar-brand"> */}
                  
                {/* </div> */}
              </div>
              <div className="col-sm-4 testtest">
                
                {kanbanboard ?
                <ul className="nav navbar-nav navbar-right" >
                  <li>
                      <div className="popover__wrapper">
                          <span className="popover__title" onClick={this.onClickHistory.bind(this)}>활동로그</span>
                          {/* log lists */}
                          {this.state.historyOpen ? 
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
                                                         
                            )}</p></div> : null 
                        }
                      </div>
                    </li>
                    <li>
                    <i className="fas fa-cog fa-2x gearIcon" onClick={this.onProjectSetting.bind(this)}></i> 
                    </li>
                </ul>
                 :null}
              </div>
            </div>
          </nav>
        </div>
      </>
    );
  }
}

export default TopBar;
