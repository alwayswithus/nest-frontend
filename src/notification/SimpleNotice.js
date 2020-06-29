import React from 'react';
import moment from 'moment';

import { Link } from "react-router-dom";

class SimpleNotice extends React.Component {

    render() {
        let notice = this.props.notice;
        const today = new Date();
        return (
            <a href={
                `/nest/dashboard/${notice.projectNo}${notice.taskListNo === null ?"/kanbanboard/" :`/kanbanboard/task/${notice.taskNo}`}${(notice.noticeType === 'commentInsert')||(notice.noticeType === 'commentLike')?"/comment":""}`
            }>
            <div className="notice-one-contents" style={{display:'inline-block'}}>
                <div className="notice-contents-avatar-image">
                    <img src={`${notice.userPhoto}`} className="notice-avatar-image" alt="userimg"/>
                </div>
                <div className="notice-avatar-contents">
                    <div className="notice-avatar-part" style={{width:'200px'}}>
                        <span>
                            {(notice.noticeType === "projectJoin") || (notice.noticeType === "taskJoin") || (notice.noticeType === "commentLike") ? sessionStorage.getItem("authUserName")+notice.noticeMessage : notice.noticeMessage}
                        </span>
                    </div>
                    <div className="notice-avatar-contents-date">
                            {
                                        moment.duration(moment(today, 'YYYY-MM-DD h:mm').diff(moment(notice.noticeDate, 'YYYY-MM-DD h:mm'))).days() !== 0 
                                        ? `${moment.duration(moment(today, 'YYYY-MM-DD h:mm').diff(moment(notice.noticeDate, 'YYYY-MM-DD h:mm'))).days()} 일 전` 
                                        : moment.duration(moment(today, 'YYYY-MM-DD h:mm').diff(moment(notice.noticeDate, 'YYYY-MM-DD h:mm'))).hours() !== 0 
                                            ? `${moment.duration(moment(today, 'YYYY-MM-DD h:mm').diff(moment(notice.noticeDate, 'YYYY-MM-DD h:mm'))).hours()} 시간 전` 
                                            : moment.duration(moment(today, 'YYYY-MM-DD h:mm').diff(moment(notice.noticeDate, 'YYYY-MM-DD h:mm'))).minutes() !== 0 
                                                ? `${moment.duration(moment(today, 'YYYY-MM-DD h:mm').diff(moment(notice.noticeDate, 'YYYY-MM-DD h:mm'))).minutes()} 분 전` 
                                                : `${moment.duration(moment(today, 'YYYY-MM-DD h:mm').diff(moment(notice.noticeDate, 'YYYY-MM-DD h:mm'))).seconds()} 초 전`
                            }
                    </div>
                </div>
            </div>
            </a>
        );
    }
    
}
export default SimpleNotice;