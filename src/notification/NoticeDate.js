import React from 'react';
import moment from 'moment';
import ReactTooltip from "react-tooltip";
import { Link } from "react-router-dom";

import './noticeDate.scss';

class NoticeDate extends React.Component {

    messageCheck(noticeNo){
        this.props.callbackMessageCheck.MessageCheck(noticeNo)
    }
    
    render() {
        let date = `${this.props.date.dateYear}-${this.props.date.dateMonth}-${this.props.date.dateDay}`;
        console.log("date : ", date)
        const today = new Date();

        return (
            <div className="NoticeDate">
                {this.props.notices && this.props.notices.map(notice =>
                    moment(notice.noticeDate).format('YYYY-MMM-DD') === date ?
                        <div key={notice.noticeNo} className={`notice-body-contents-today ${notice.messageCheck === 'N' ? "newMessage": ""}`} >
                            {console.log("true")}
                            <div className="notice-body-contents-avatar-image">
                                <img src={`../${notice.userPhoto}`} className="notice-avatar-image" alt="userimg"/>
                            </div>
                            <div className="notice-body-contents-avatar-name">
                                <span>{notice.userName}</span>
                            </div>
                            <div className="notice-body-contents-avatar-activities">
                                <div className="notice-body-contents-acive">
                                    <span>{notice.noticeMessage}</span>
                                </div>
                                
                                <div className="notice-body-contents-path">
                                    <i className="fas fa-project-diagram fa-xs"></i>
                                    <Link to={`/nest/dashboard/${notice.projectNo}/kanbanboard/${notice.taskListNo}/task/${notice.taskNo}`}>
                                        <span className="contents-path" data-tip="프로젝트로 가기" data-place="bottom">
                                            {`${notice.projectTitle} > ${notice.taskContents}`}
                                        </span>
                                        <ReactTooltip />
                                    </Link>
                                </div>
                            </div>
                            <div className="notice-body-avatar-timeline messageChecking">
                                <span>
                                    {
                                        moment.duration(moment(today, 'YYYY-MM-DD h:mm').diff(moment(notice.noticeDate, 'YYYY-MM-DD h:mm'))).days() !== 0 
                                        ? `${moment.duration(moment(today, 'YYYY-MM-DD h:mm').diff(moment(notice.noticeDate, 'YYYY-MM-DD h:mm'))).days()} 일 전` 
                                        : moment.duration(moment(today, 'YYYY-MM-DD h:mm').diff(moment(notice.noticeDate, 'YYYY-MM-DD h:mm'))).hours() !== 0 
                                            ? `${moment.duration(moment(today, 'YYYY-MM-DD h:mm').diff(moment(notice.noticeDate, 'YYYY-MM-DD h:mm'))).hours()} 시간 전` 
                                            : moment.duration(moment(today, 'YYYY-MM-DD h:mm').diff(moment(notice.noticeDate, 'YYYY-MM-DD h:mm'))).minutes() !== 0 
                                                ? `${moment.duration(moment(today, 'YYYY-MM-DD h:mm').diff(moment(notice.noticeDate, 'YYYY-MM-DD h:mm'))).minutes()} 분 전` 
                                                : `${moment.duration(moment(today, 'YYYY-MM-DD h:mm').diff(moment(notice.noticeDate, 'YYYY-MM-DD h:mm'))).seconds()} 초 전`
                                    }
                                </span>
                                {notice.messageCheck === 'N' 
                                    ? <div className="messageCheck">
                                        <i class="far fa-eye fa-2x"></i>
                                        <i class="far fa-eye-slash fa-2x" onClick={this.messageCheck.bind(this,notice.noticeNo)}></i>
                                      </div> : null}
                                
                            </div>
                            
                        </div>
                        : <div>{console.log("false")}</div>)}
            </div>
        )
    }
} 

export default NoticeDate;