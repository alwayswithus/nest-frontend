import React, { Component } from 'react';
import './TaskSetNav.scss';
import { Navbar, Nav } from "react-bootstrap";
import { withRouter } from 'react-router-dom';

class Navigation extends Component {
  
  onSettingClick(e) {
    e.preventDefault()
    this.props.onCallbackSetting(e.target.href)
  }

  render() {
    return (
      <div className="Navigation">
          {this.props.path == 'http://localhost:3000/nest/file' ? 
            (<ul class="nav nav-tabs">
              <li class="nav-item">
                <a onClick={this.onSettingClick.bind(this)} id='setting' className="nav-link" style={{ textAlign: 'center', borderBottom: 'none' }} href="/nest/setting">속성 </a>
              </li>
              <li class="nav-item">
                <a onClick={this.onSettingClick.bind(this)} id='comment' className="nav-link" style={{ textAlign: 'center', borderBottom: 'none' }} href="/nest/comment">코멘트</a>
              </li>
              <li class="nav-item">
                <a onClick={this.onSettingClick.bind(this)} id='file' className="nav-link" style={{ textAlign: 'center', borderBottom: '3px solid #27B6BA' }} href="/nest/file">파일 & 링크</a>
              </li> </ul>) : 
                
                (<>{this.props.path == 'http://localhost:3000/nest/comment' ? 
                      (<ul class="nav nav-tabs">
                        <li class="nav-item">
                          <a onClick={this.onSettingClick.bind(this)} id='setting' className="nav-link" style={{ textAlign: 'center', borderBottom: 'none' }} href="/nest/setting">속성 </a>
                        </li>
                        <li class="nav-item">
                          <a onClick={this.onSettingClick.bind(this)} id='comment' className="nav-link" style={{ textAlign: 'center', borderBottom: '3px solid #27B6BA' }} href="/nest/comment">코멘트</a>
                        </li>
                        <li class="nav-item">
                          <a onClick={this.onSettingClick.bind(this)} id='file' className="nav-link" style={{ textAlign: 'center', borderBottom: 'none' }} href="/nest/file">파일 & 링크</a>
                        </li> </ul> ) : 
                        (<ul class="nav nav-tabs">
                            <li class="nav-item">
                              <a onClick={this.onSettingClick.bind(this)} id='setting' className="nav-link" style={{ textAlign: 'center', borderBottom: '3px solid #27B6BA' }} href="/nest/setting">속성 </a>
                            </li>
                            <li class="nav-item">
                              <a onClick={this.onSettingClick.bind(this)} id='comment' className="nav-link" style={{ textAlign: 'center', borderBottom: 'none' }} href="/nest/comment">코멘트</a>
                            </li>
                            <li class="nav-item">
                              <a onClick={this.onSettingClick.bind(this)} id='file' className="nav-link" style={{ textAlign: 'center', borderBottom: 'none' }} href="/nest/file">파일 & 링크</a>
                            </li> </ul>)  }</>)
          }
      </div>
    );
  }
};

export default withRouter(Navigation);
