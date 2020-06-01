import React, { Component } from 'react';
import './TaskSetNav.scss';
import { Navbar, Nav } from "react-bootstrap";
import { withRouter } from 'react-router-dom';

class Navigation extends Component {

  render() {
    return (
      <div className="Navigation">
        {this.props.match.path === '/nest/dashboard/:projectNo/kanbanboard/:taskListNo/task/:taskNo/file' ?
          (<ul className="nav nav-tabs">
            <li className="nav-item">
              <a id='setting' className="nav-link" style={{ textAlign: 'center', borderBottom: 'none' }} href={`/nest/dashboard/${this.props.projectNo}/kanbanboard/${this.props.params.taskListNo}/task/${this.props.params.taskNo}`}>속성 </a>
            </li>
            <li className="nav-item">
              <a id='comment' className="nav-link" style={{ textAlign: 'center', borderBottom: 'none' }} href={`/nest/dashboard/${this.props.projectNo}/kanbanboard/${this.props.params.taskListNo}/task/${this.props.params.taskNo}/comment`}>코멘트</a>
            </li>
            <li className="nav-item">
              <a id='file' className="nav-link" style={{ textAlign: 'center', borderBottom: '3px solid #27B6BA' }} href={`/nest/dashboard/${this.props.projectNo}/kanbanboard/${this.props.params.taskListNo}/task/${this.props.params.taskNo}/file`}>파일 & 링크</a>
            </li>
          </ul>) :

          (<>{this.props.match.path === '/nest/dashboard/:projectNo/kanbanboard/:taskListNo/task/:taskNo/comment' ?
            (<ul className="nav nav-tabs">
              <li className="nav-item">
                <a id='setting' className="nav-link" style={{ textAlign: 'center', borderBottom: 'none' }} href={`/nest/dashboard/${this.props.projectNo}/kanbanboard/${this.props.params.taskListNo}/task/${this.props.params.taskNo}`}>속성 </a>
              </li>
              <li className="nav-item">
                <a id='comment' className="nav-link" style={{ textAlign: 'center', borderBottom: '3px solid #27B6BA' }} href={`/nest/dashboard/${this.props.projectNo}/kanbanboard/${this.props.params.taskListNo}/task/${this.props.params.taskNo}/comment`}>코멘트</a>
              </li>
              <li className="nav-item">
                <a id='file' className="nav-link" style={{ textAlign: 'center', borderBottom: 'none' }} href={`/nest/dashboard/${this.props.projectNo}/kanbanboard/${this.props.params.taskListNo}/task/${this.props.params.taskNo}/file`}>파일 & 링크</a>
              </li>
            </ul>) :

            (<ul className="nav nav-tabs">
              <li className="nav-item">
                <a id='setting' className="nav-link" style={{ textAlign: 'center', borderBottom: '3px solid #27B6BA' }} href={`/nest/dashboard/${this.props.projectNo}/kanbanboard/${this.props.params.taskListNo}/task/${this.props.params.taskNo}`}>속성 </a>
              </li>
              <li className="nav-item">
                <a id='comment' className="nav-link" style={{ textAlign: 'center', borderBottom: 'none' }} href={`/nest/dashboard/${this.props.projectNo}/kanbanboard/${this.props.params.taskListNo}/task/${this.props.params.taskNo}/comment`}>코멘트</a>
              </li>
              <li className="nav-item">
                <a id='file' className="nav-link" style={{ textAlign: 'center', borderBottom: 'none' }} href={`/nest/dashboard/${this.props.projectNo}/kanbanboard/${this.props.params.taskListNo}/task/${this.props.params.taskNo}/file`}>파일 & 링크</a>
              </li> </ul>)}</>)
        }
      </div>
    );
  }
};

export default withRouter(Navigation);
