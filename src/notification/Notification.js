import React from 'react';
import Navigator from '../navigator/Navigator';
import './notification.scss';

const Notification = () => {
    return (
        <div id="Notification">
            {/* 사이드바 */}
            <div className="sidebar">
                <Navigator />
            </div>
            <div className="notice-header-background">
                <div className="notice-header">
                    <div className="notice-header-contents">
                        <div className="notice-header-icon">
                            <div className="notice-header-title-month">
                                <span className="notice-header-title-month-text">MAY</span>
                            </div>
                            <div className="notice-header-title-day">
                                <span className="notice-header-title-day-text">8</span>
                            </div>
                        </div>
                        <div className="notice-header-title-text">
                            <span className="notice-header-title-plural">
                                30 개의 새 업데이트가 있습니다.
                        </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="notice-contents">

            </div>
        </div>
    );
}

export default Notification;