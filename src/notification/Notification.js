import React from 'react';
import Navigator from '../navigator/Navigator';
import './notification.scss';

export default class Notification extends React.Component {
    constructor() {
        super(...arguments)
        this.state = {
            url: ""
        }
    }

    // CallBack Background Image Setting 
    callbackChangeBackground(url) {
        this.setState({
            url: url
        })
    }

    render() {
        return (
            <div id="Notification" style={{ backgroundImage: `url(${this.state.url})` }}>
                {/* 사이드바 */}
                <div className="sidebar">
                    <Navigator callbackChangeBackground={{ change: this.callbackChangeBackground.bind(this) }} />
                </div>
                <div className="notice-header-background"></div>
                <div className="notice-contents">
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
                    <div className="notice-body-contents">

                    </div>
                </div>
            </div>
        );
    }
}