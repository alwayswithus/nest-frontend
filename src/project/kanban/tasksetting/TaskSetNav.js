import React, { Component } from 'react';
import './TaskSetNav.scss';
import { Navbar, Nav } from "react-bootstrap";
import { Link, withRouter } from 'react-router-dom';

class Navigation extends Component {

  render() {
    console.log(this.props.match)
    return (
      <div className="Navigation">
        {this.props.match.path === '/nest/dashboard/:projectNo/kanbanboard/:taskListNo/task/:taskNo/file' ?
          (<ul className="nav nav-tabs">
            <li className="nav-item">
              <Link className="nav-link" to = {`/nest/dashboard/${this.props.projectNo}/kanbanboard/${this.props.params.taskListNo}/task/${this.props.params.taskNo}`}>
                <p  style={{ textAlign: 'center', borderBottom: 'none' }} >속성 </p>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to ={`/nest/dashboard/${this.props.projectNo}/kanbanboard/${this.props.params.taskListNo}/task/${this.props.params.taskNo}/comment`}>
                <p style={{ textAlign: 'center', borderBottom: 'none' }} >코멘트</p>
              </Link>
            </li>
            <li className="nav-item">
            <Link className="nav-link" to = {`/nest/dashboard/${this.props.projectNo}/kanbanboard/${this.props.params.taskListNo}/task/${this.props.params.taskNo}/file`}>
              <p style={{ textAlign: 'center', borderBottom: '3px solid #27B6BA' }} >파일 & 링크</p>
            </Link>
            </li>
          </ul>) :

          (<>{this.props.match.path === '/nest/dashboard/:projectNo/kanbanboard/:taskListNo/task/:taskNo/comment' ?
            (<ul className="nav nav-tabs">
              <li className="nav-item">
              <Link to = {`/nest/dashboard/${this.props.projectNo}/kanbanboard/${this.props.params.taskListNo}/task/${this.props.params.taskNo}`}>
                <p id='setting' className="nav-link" style={{ textAlign: 'center', borderBottom: 'none' }} >속성 </p>
              </Link>
              </li>
              <li className="nav-item">
              <Link to = {`/nest/dashboard/${this.props.projectNo}/kanbanboard/${this.props.params.taskListNo}/task/${this.props.params.taskNo}/comment`}>
                <p id='comment' className="nav-link" style={{ textAlign: 'center', borderBottom: '3px solid #27B6BA' }} >코멘트</p>
              </Link>
              </li>
              <li className="nav-item">
              <Link to = {`/nest/dashboard/${this.props.projectNo}/kanbanboard/${this.props.params.taskListNo}/task/${this.props.params.taskNo}/file`}>
                <p id='file' className="nav-link" style={{ textAlign: 'center', borderBottom: 'none' }} >파일 & 링크</p>
              </Link>
              </li>
            </ul>) :

            (<ul className="nav nav-tabs">
              <li className="nav-item">
              <Link to = {`/nest/dashboard/${this.props.projectNo}/kanbanboard/${this.props.params.taskListNo}/task/${this.props.params.taskNo}`}>
                <p id='setting' className="nav-link" style={{ textAlign: 'center', borderBottom: '3px solid #27B6BA' }} >속성 </p>
              </Link>
              </li>
              <li className="nav-item">
              <Link to = {`/nest/dashboard/${this.props.projectNo}/kanbanboard/${this.props.params.taskListNo}/task/${this.props.params.taskNo}/comment`}>
                <p id='comment' className="nav-link" style={{ textAlign: 'center', borderBottom: 'none' }} >코멘트</p>
              </Link>
              </li>
              <li className="nav-item">
              <Link to = {`/nest/dashboard/${this.props.projectNo}/kanbanboard/${this.props.params.taskListNo}/task/${this.props.params.taskNo}/file`}>
                <p id='file' className="nav-link" style={{ textAlign: 'center', borderBottom: 'none' }} >파일 & 링크</p>
              </Link>
              </li> </ul>)}</>)
        }
      </div>
    );
  }
};

export default withRouter(Navigation);
