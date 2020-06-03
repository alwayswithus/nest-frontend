import React from "react";
import Table from 'react-bootstrap/Table'
import ReactTooltip from "react-tooltip";
import { Link } from "react-router-dom";
import moment from 'moment';
import Navigator from '../../navigator/Navigator'
import TopBar from '../topBar/TopBar';
import './file.scss';
import ApiService from "../../ApiService";

const API_URL = "http://localhost:8080/nest";
const API_HEADERS = {
  "Content-Type": "application/json",
};
export default class File extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            url: sessionStorage.getItem("authUserBg"),
            projectFiles:null
        }
    }

    // CallBack Background Image Setting 
    callbackChangeBackground(url) {

        let authUser = {
            userNo: window.sessionStorage.getItem("authUserNo"),
            userBg: url
          }
      
          fetch(`${API_URL}/api/user/backgroundChange`, {
            method: 'post',
            headers: API_HEADERS,
            body: JSON.stringify(authUser)
          })
          
          sessionStorage.setItem("authUserBg", url)
          this.setState({
            url: url
          })
    }

    render() {
        console.log()
        return (
            <div className="File" style={{ backgroundImage: `url(${this.state.url})` }}>
                <Navigator callbackChangeBackground={{ change: this.callbackChangeBackground.bind(this) }} />
                <TopBar projectNo={this.props.match.params.projectNo}/>
                <div className="file-resource-table">
                    <Table>
                        <thead>
                            <tr style={{ backgroundColor: "#E3E3E3" }}>
                                <th style={{ paddingLeft: "17px" }}>이름</th>
                                <th>크기</th>
                                <th>공유한 날짜</th>
                                <th>공유한 사람</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.projectFiles && this.state.projectFiles.map(projectFile => 
                                <tr className="file-contents">
                                    <td>
                                        <div className="file-name-cell">
                                            <div className="file-name-cell-image">
                                                <img className="file-image" src={`${API_URL}${projectFile.filePath}`} />
                                            </div>
                                            <div className="file-name-and-path">
                                                <span className="file-name">{projectFile.fileName}</span>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ paddingTop: "23px" }}>
                                    <Link 
                                        style={{color:'black', textDecoration:'none'}} 
                                        to={`/nest/dashboard/${this.props.match.params.projectNo}/kanbanboard/${projectFile.tasklistNo}/task/${projectFile.taskNo}/file`}>
                                        <div className="file-image-location" data-tip="프로젝트로 가기" data-place="bottom">
                                            {projectFile.tasklistName} > {projectFile.taskContents}
                                        </div>
                                        <ReactTooltip />
                                    </Link>
                                </td>
                                <td style={{ paddingTop: "23px" }}>{moment(projectFile.fileRegdate).format("MM월 DD일 hh:mm")}</td>
                                <td style={{ paddingTop: "17px" }}>
                                    <div className="share-person">
                                        {projectFile.userName}                    
                                    </div>
                                    <div className="contents-dropdown">
                                        <div className="dropdown">
                                            <button className="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">
                                                <i className="fas fa-ellipsis-v"></i>
                                            </button>
                                            <ul class="dropdown-menu">
                                                <li><a href="#">다운로드</a></li>
                                                <li><a href="#">삭제</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            )}
                            </tbody>
                    </Table>
                </div>
            </div>
        )
    }
    componentDidMount(){
        ApiService.fetchFile(this.props.match.params.projectNo)
        .then(response => {
            this.setState({
                projectFiles:response.data.data
            })
        })
    }
}