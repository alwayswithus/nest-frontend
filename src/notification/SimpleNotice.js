import React from 'react';
import moment from 'moment';

//import { Link } from "react-router-dom";

class SimpleNotice extends React.Component {

    messageCheck(noticeNo){
        this.props.callbackMessageCheck.MessageCheck(noticeNo)
    }

    render() {
        let notice = this.props.notice;
        const today = new Date();
        return (
            <a href={
                `/nest/dashboard/${notice.projectNo}${notice.taskListNo === null ?"/kanbanboard/" :`/kanbanboard/task/${notice.taskNo}`}${(notice.noticeType === 'commentInsert')||(notice.noticeType === 'commentLike')?"/comment":""}`
            } style={{textDecoration:"none"}} onClick={this.messageCheck.bind(this,notice.noticeNo)}>
            <div className="notice-one-contents">
                <div className="notice-contents-avatar-image">
                    <img src={`${notice.userPhoto}`} className="notice-avatar-image" alt="userimg"/>
                </div>
                <div className="notice-avatar-contents">
                    <div className="notice-avatar-part">
                        <span>
                            {(notice.noticeType === "projectJoin") || (notice.noticeType === "taskJoin") || (notice.noticeType === "commentLike") ? sessionStorage.getItem("authUserName")+notice.noticeMessage : notice.noticeMessage}
                        </span>
                    </div>
                </div>
                <div className="notice-avatar-contents-date">
                    {
                        moment.duration(moment(today, 'YYYY-MM-DD HH:mm:ss').diff(moment(notice.noticeDate, 'YYYY-MM-DD HH:mm:ss'))).days() !== 0 
                        ? `${moment.duration(moment(today, 'YYYY-MM-DD HH:mm:ss').diff(moment(notice.noticeDate, 'YYYY-MM-DD HH:mm:ss'))).days()} 일 전` 
                        : moment.duration(moment(today, 'YYYY-MM-DD HH:mm:ss').diff(moment(notice.noticeDate, 'YYYY-MM-DD HH:mm:ss'))).hours() !== 0 
                            ? `${moment.duration(moment(today, 'YYYY-MM-DD HH:mm:ss').diff(moment(notice.noticeDate, 'YYYY-MM-DD HH:mm:ss'))).hours()} 시간 전` 
                            : moment.duration(moment(today, 'YYYY-MM-DD HH:mm:ss').diff(moment(notice.noticeDate, 'YYYY-MM-DD HH:mm:ss'))).minutes() !== 0 
                                ? `${moment.duration(moment(today, 'YYYY-MM-DD HH:mm:ss').diff(moment(notice.noticeDate, 'YYYY-MM-DD HH:mm:ss'))).minutes()} 분 전` 
                                : `${moment.duration(moment(today, 'YYYY-MM-DD HH:mm:ss').diff(moment(notice.noticeDate, 'YYYY-MM-DD HH:mm:ss'))).seconds()} 초 전`
                    }
                </div>
            </div>
            </a>
        );
    }
    
}
export default SimpleNotice;