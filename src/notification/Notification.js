import React from 'react';
import moment from 'moment';
import ApiService from "../ApiService";
import update from "react-addons-update";

import NoticeDate from './NoticeDate';
import Navigator from '../navigator/Navigator';
import './notification.scss';
import SockJsClient from "react-stomp";

const API_URL = "http://192.168.1.223:8080/nest";
const API_HEADERS = {
    'Content-Type': 'application/json'
}
class Notification extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            notices: [],                               // notice send Data
            dates: [],                                          // date Data
            popoverOpen:false // 알림 상태변수
        }
    }

    callbackMessageCheck(noticeNo){
        // console.log(noticeNo);

        const noticeIndex = this.state.notices.findIndex(
            (notice) => notice.noticeNo === noticeNo
          );

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

        fetch(`${API_URL}/api/notification/update/${noticeNo}/${sessionStorage.getItem("authUserNo")}`, {
            method:'post',
            headers:API_HEADERS,
          })
    }

    receiveNotice(socketData) {
        if (socketData[0] && socketData[0].indexOf(parseInt(sessionStorage.getItem("authUserNo"))) !== -1) {
            const notice = socketData[1];
            if (notice && sessionStorage.getItem("authUserNo") !== notice.senderNo) {
                ApiService.fetchNotification().then(
                    (response) => {
                        this.setState({
                            dates: response.data.data.date,
                            notices: response.data.data.notice
                        });
                    }
                );
            }
        }
    }

    onCloseEvent() {
        
        if(this.state.popoverOpen === true){
          this.setState({
            popoverOpen:false
          })
        } 
      }
    
      onUpdateStatePopOver(){
        this.setState({
          popoverOpen:!this.state.popoverOpen
        })
      }
    render() {
        let count = 0;
        this.state.notices.map(notice => 
            notice.messageCheck === 'N' ? (count +=1) : null
        )
        //console.log(this.state.notices)
        return (
            <div className="Notification" onClick={this.onCloseEvent.bind(this)}>
                {/* 사이드바 */}
                <div className="sidebar">
                    <Navigator 
                        onClosePopOver = {this.onCloseEvent.bind(this)}
                        onUpdateStatePopOver = {this.onUpdateStatePopOver.bind(this)}
                        popoverOpen = {this.state.popoverOpen}
                        callbackChangeBackground={this.props.callbackChangeBackground} />
                </div>
                <div className="notice-header-background"></div>

                <SockJsClient
                                url={`${API_URL}/socket`}
                                topics={[`/topic/asnotice`]}
                                onMessage={this.receiveNotice.bind(this)}
                                ref={(client) => {
                                    this.clientRef = client;
                                }}
                            />

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
                                {count} 개의 새 업데이트가 있습니다.
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