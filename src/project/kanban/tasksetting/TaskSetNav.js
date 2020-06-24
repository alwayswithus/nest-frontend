import React, { Component } from 'react';
import './TaskSetNav.scss';
import { Navbar, Nav } from "react-bootstrap";
import { Link, withRouter } from 'react-router-dom';

class Navigation extends Component {

  render() {
    const Styled = {
      paddingBottom: '8px',
      width: '142px',
      textAlign: 'center', 
      borderBottom: 'none'
    }

    const StyledBottom = {
      paddingBottom: '8px',
      width: '142px',
      textAlign: 'center', 
      borderBottom: '3px solid #27B6BA'
    }
  
    console.log(this.props.match.path === '/nest/calendar/:projectNo/task/:taskNo')
    return (
      <div className="Navigation">
        {this.props.match.path.indexOf("calendar") == -1 ?
        // 칸반에서의 이동
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <Link className="nav-link" to = {`/nest/dashboard/${this.props.projectNo}/kanbanboard/task/${this.props.params.taskNo}`}>
                <p style={this.props.match.path === '/nest/dashboard/:projectNo/kanbanboard/task/:taskNo/' ? StyledBottom : Styled} >속성 </p>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to ={`/nest/dashboard/${this.props.projectNo}/kanbanboard/task/${this.props.params.taskNo}/comment`}>
                <p style={this.props.match.path === '/nest/dashboard/:projectNo/kanbanboard/task/:taskNo/comment' ? StyledBottom : Styled} >코멘트</p>
              </Link>
            </li>
            <li className="nav-item">
            <Link className="nav-link" to = {`/nest/dashboard/${this.props.projectNo}/kanbanboard/task/${this.props.params.taskNo}/file`}>
              <p style={this.props.match.path === '/nest/dashboard/:projectNo/kanbanboard/task/:taskNo/file' ? StyledBottom : Styled} >파일 & 링크</p>
            </Link>
            </li>
          </ul> :
          // 캘린더에서의 이동
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <Link className="nav-link" to = {`/nest/calendar/${this.props.projectNo}/task/${this.props.params.taskNo}`}>
              <p style={this.props.match.path === '/nest/calendar/:projectNo/task/:taskNo' ? StyledBottom : Styled} >속성 </p>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to ={`/nest/calendar/${this.props.projectNo}/task/${this.props.params.taskNo}/comment`}>
              <p style={this.props.match.path === '/nest/calendar/:projectNo/task/:taskNo/comment' ? StyledBottom : Styled} >코멘트</p>
            </Link>
          </li>
          <li className="nav-item">
          <Link className="nav-link" to = {`/nest/calendar/${this.props.projectNo}/task/${this.props.params.taskNo}/file`}>
            <p style={this.props.match.path === '/nest/calendar/:projectNo/task/:taskNo/file' ? StyledBottom : Styled} >파일 & 링크</p>
          </Link>
          </li>
        </ul>
        }
        
      </div>
    );
  }
};

export default withRouter(Navigation);
