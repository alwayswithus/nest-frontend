import React from "react";
import Table from 'react-bootstrap/Table'
import ReactTooltip from "react-tooltip";
import { Link } from "react-router-dom";

import Navigator from '../../navigator/Navigator'
import TopBar from '../topBar/TopBar';
import './file.scss';

const API_URL = "http://localhost:8080/nest";
const API_HEADERS = {
  "Content-Type": "application/json",
};
export default class File extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            url: sessionStorage.getItem("authUserBg")
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
        return (
            <div className="File" style={{ backgroundImage: `url(${this.state.url})` }}>
                <Navigator callbackChangeBackground={{ change: this.callbackChangeBackground.bind(this) }} />
                <TopBar />
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
                            <tr className="file-contents">
                                <td>
                                    <div className="file-name-cell">
                                        <div className="file-name-cell-image">
                                            <img className="file-image" src="../nest/assets/images/toy.png" />
                                        </div>
                                        <div className="file-name-and-path">
                                            <span className="file-name">plug.png</span>
                                            <Link to="#">
                                                <div className="file-image-location" data-tip="프로젝트로 가기" data-place="bottom">
                                                    코드의 숲 > 계획 업무 1
                                                </div>
                                                <ReactTooltip />
                                            </Link>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ paddingTop: "23px" }}>2.87 KB</td>
                                <td style={{ paddingTop: "23px" }}>2020년 5월 25일 19:43</td>
                                <td style={{ paddingTop: "17px" }}>
                                    <div className="share-person">
                                        김우경                      
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
                        </tbody>
                    </Table>
                </div>
            </div>
        )
    }
}