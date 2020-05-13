import React, { Component } from 'react';
import './TaskSetNav.scss';
import { Navbar, Nav } from "react-bootstrap";
import { withRouter } from 'react-router-dom';

class Navigation extends Component {
  
  constructor(){
    super(...arguments);
    this.state= {
      navigation:
      <>
      </>
    }
  }

  render() {
    const NavLink= {
      width:'205px', 
      textAlign:'center',
      backgroundColor:'none'
    }

    return (
      <div className="Navigation">
        <ul class="nav nav-tabs">
          <li class="nav-item">
              <a id='setting' className="nav-link" style={{ textAlign:'center', borderBottom:'3px solid #27B6BA'}} href="#">속성 </a>
            </li>
            <li class="nav-item">
              <a id='comment' className="nav-link" style={{ textAlign:'center', borderBottom:'none'}} href="/comment">코멘트</a>
            </li>
            <li class="nav-item">
              <a id='file' className="nav-link" style={{ textAlign:'center', borderBottom:'none'}} href="/file">파일 & 링크</a>
            </li>
        </ul>
      </div>
    );
  }
};

export default withRouter(Navigation);
