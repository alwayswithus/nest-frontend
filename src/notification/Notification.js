import React from 'react';
import moment from 'moment';
import Pagination from 'react-bootstrap/Pagination'
import ApiService from "../ApiService";
import update from "react-addons-update";

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
            notices: [],                               // notice send Data
            dates: [],                                          // date Data
        }
    }

    callbackMessageCheck(noticeNo){
        // console.log(noticeNo);

        const noticeIndex = this.state.notices.findIndex(
            (notice) => notice.noticeNo === noticeNo
          );

          console.log(this.state.notices[noticeIndex])

        let newNotices = this.state.notices


        newNotices = update(newNotices,{
            [noticeIndex]:{
                messageCheck:{
                    $set : 'Y'
                }
            }
        })
        this.setState({
            notices :newNotices
        })

        fetch(`${API_URL}/api/notification/update/${noticeNo}`, {
            method:'post',
            headers:API_HEADERS,
          })
    }

    render() {
        
        return (
            <div className="Notification" >
                {/* 사이드바 */}
                <div className="sidebar">
                    <Navigator callbackChangeBackground={this.props.callbackChangeBackground} />
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
                                    <NoticeDate notices={this.state.notices} date={date} callbackMessageCheck={{MessageCheck:this.callbackMessageCheck.bind(this)}}/>
                                </div>
                            </div>)}
                    </div>
                </div>
            </div>
        );
    }
    componentDidMount() {
        ApiService.fetchNotification().then(
          (response) => {
            this.setState({
                dates:response.data.data.date,
                notices:response.data.data.notice
            });
          }
        );
      }
}

export default Notification;