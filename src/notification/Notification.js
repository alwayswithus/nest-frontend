import React from 'react';
import moment from 'moment';
import Pagination from 'react-bootstrap/Pagination'
import noticeSendData from './noticeSendData.json';
import dates from './dateData.json';

import NoticeDate from './NoticeDate';
import Navigator from '../navigator/Navigator';
import './notification.scss';

const API_URL = "http://localhost:8080/nest";
const API_HEADERS = {
    'Content-Type': 'application/json'
}
class Notification extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            notices: noticeSendData,                               // notice send Data
            dates: dates,                                          // date Data
            url: window.sessionStorage.getItem("authUserBg")       // background url
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

        window.sessionStorage.setItem("authUserBg", url)
        this.setState({
            url: url
        })
    }

    render() {
        return (
            <div className="Notification" style={{ backgroundImage: `url(${this.state.url})` }}>
                {/* 사이드바 */}
                <div className="sidebar">
                    <Navigator callbackChangeBackground={{ change: this.callbackChangeBackground.bind(this) }} />
                </div>
                <div className="notice-header-background"></div>
                <div className="notice-contents">
                    <div className="notice-header-contents">
                        <div className="notice-header-icon">
                            <div className="notice-header-title-month">
                                <span className="notice-header-title-month-text">{moment(new Date()).format("MMM")}</span>
                            </div>
                            <div className="notice-header-title-day">
                                <span className="notice-header-title-day-text">{moment(new Date()).format("DD")}</span>
                            </div>
                        </div>
                        <div className="notice-header-title-text">
                            <span className="notice-header-title-plural">
                                {this.state.notices.length} 개의 새 업데이트가 있습니다.
                            </span>
                        </div>
                    </div>
                    <div className="notice-body-contents">
                        {this.state.dates.map(date =>
                            <div key={date.dateDay} className="notice-body-today">
                                <div className="notice-body-header-today">
                                    <div className="notice-body-header-date">
                                        <span>Update on {date.dateMonth} {date.dateDay}, {date.dateYear}</span>
                                    </div>
                                    <NoticeDate notices={this.state.notices} date={date} />
                                </div>
                            </div>)}
                    </div>
                </div>
            </div>
        );
    }
}

export default Notification;