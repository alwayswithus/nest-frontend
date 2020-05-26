import React from 'react';
import moment from 'moment';

import './noticeDate.scss';

export default class NoticeDate extends React.Component {

    render() {
        let date = `${this.props.date.dateYear}-${this.props.date.dateMonth}-${this.props.date.dateDay}`;
        console.log(date);
        return (
            <div className="NoticeDate">
                {this.props.notices.map(notice =>
                    moment(notice.noticeDate).format('YYYY-MMM-DD') === date ?
                        <div key={notice.noticeNo} className="notice-body-contents-today">
                            <div className="notice-body-contents-avatar-image">
                                <img src={`../${notice.sendUser.userPhoto}`} className="notice-avatar-image" />
                            </div>
                            <div className="notice-body-contents-avatar-name">
                                <span>{notice.sendUser.userName}</span>
                            </div>
                            <div className="notice-body-contents-avatar-activities">
                                <div className="notice-body-contents-acive">
                                    <span>{notice.noticeMessage}</span>
                                </div>
                                <div className="notice-body-contents-path">
                                    <i className="fas fa-project-diagram fa-xs"></i>
                                    <span className="contents-path">{`${notice.project.projectName} > ${notice.task.taskContents}`}</span>
                                </div>
                            </div>
                            <div className="notice-body-avatar-timeline">
                                <span>{moment.duration(moment(new Date, 'YYYY-MM-DD h:mm').diff(moment(notice.noticeDate, 'YYYY-MM-DD h:mm'))).days() !== 0 ?
                                    `${moment.duration(moment(new Date, 'YYYY-MM-DD h:mm').diff(moment(notice.noticeDate, 'YYYY-MM-DD h:mm'))).days()} 일 전` :
                                    moment.duration(moment(new Date, 'YYYY-MM-DD h:mm').diff(moment(notice.noticeDate, 'YYYY-MM-DD h:mm'))).hours() !== 0 ?
                                    `${moment.duration(moment(new Date, 'YYYY-MM-DD h:mm').diff(moment(notice.noticeDate, 'YYYY-MM-DD h:mm'))).hours()} 시간 전` :
                                    moment.duration(moment(new Date, 'YYYY-MM-DD h:mm').diff(moment(notice.noticeDate, 'YYYY-MM-DD h:mm'))).minutes() !== 0 ?
                                        `${moment.duration(moment(new Date, 'YYYY-MM-DD h:mm').diff(moment(notice.noticeDate, 'YYYY-MM-DD h:mm'))).minutes()} 분 전` :
                                        `${moment.duration(moment(new Date, 'YYYY-MM-DD h:mm').diff(moment(notice.noticeDate, 'YYYY-MM-DD h:mm'))).seconds()} 초 전`}
                                </span>
                            </div>
                        </div>
                        : "")}
            </div>
        )
    }
} 