import React from 'react';
import './navigator.scss';
import ReactTooltip from "react-tooltip";

export default class Navigator extends React.Component {

    constructor() {
        super(...arguments);
        this.state = {
            backgroundId: ""
        }
    }

    onBackGroundClick(event) {
        this.props.callbackChangeBackground.change(event.target.alt)
        this.setState({
            backgroundId: event.target.id
        })
    }

    render() {
        return (
            <div className='Navigator'>
                <div className="navigation">
                    <ul className="nav-list">
                        <div className="exclude-nest-li">
                            {/*<!-- About link -->*/}
                            <li className="nav-item" data-toggle="modal" data-target="#use-profile">
                                <img className="nav-item-profile" src="assets/images/ko.jpg"></img><br />
                            </li>

                            {/*<!-- Notification link -->*/}
                            <li className="nav-item">
                                <span data-tooltip-text="Notification">
                                    <a href="/nest/notification" className="link">
                                        <i className="far fa-bell icon"></i>
                                    </a>
                                </span>
                            </li>

                            {/*<!-- Calendar link -->*/}
                            <li className="nav-item">
                                <a href="/nest/calendar" className="link">
                                    <span data-tooltip-text="Calendar">
                                        <i className="fas fa-calendar-alt icon"></i>
                                    </span>
                                </a>
                            </li>

                            {/*<!-- Projects link-- >*/}
                            <li className="nav-item">
                                <span data-tooltip-text="Projects">
                                    <a href="/nest/dashboard" className="link">
                                        <i className="fas fa-tasks icon"></i>
                                    </a>
                                </span>
                            </li >

                            {/*< !-- Slack link-- >*/}
                            <li className="nav-item">
                                <span data-tooltip-text="Slack">
                                    <a href="#" className="link">
                                        <i className="fas fa-comment-dots icon"></i>
                                    </a>
                                </span>
                            </li >

                            {/*<!-- nest -->*/}
                        </div>
                        <div className="nest-li">
                            <li className="nav-item" data-toggle="modal" data-target="#nest-introduce">
                                <img src="assets/images/nest.png" id="nest-logo" />
                            </li>
                        </div>
                    </ul >
                </div >

                {/* Nest Introduce Modal */}
                <div className="modal fade" id="nest-introduce" role="dialog">
                    <div className="modal-dialog modal-lg" role="document">
                        {/* Nest Introduce Modal content */}
                        <div className="modal-content">

                            {/* Nest Introduce Modal body */}
                            <div className="modal-body mb-0 p-0">
                                <div className="embed-responsive embed-responsive-16by9 z-depth-1-half">
                                    <iframe className="embed-responsive-item" src="https://www.youtube.com/embed/A3PDXmYoF5U"></iframe>
                                </div>
                            </div>

                            {/* Nest Introduce Modal footer */}
                            <div className="modal-footer justify-content-center flex-column flex-md-row">
                                <button type="button" className="btn btn-outline-primary btn-rounded btn-md ml-4" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Profile Modal */}
                <div className="modal fade" id="use-profile" role="dialog" aria-labelledby="myModalLabel"
                    aria-hidden="true">
                    <div className="modal-dialog cascading-modal modal-avatar modal-sm" role="document">
                        {/* Content */}
                        <div className="modal-content">
                            {/* Header */}
                            <a href="/nest/profile" className="profile-setting-page">
                                <div className="modal-header">
                                    <img src="assets/images/ko.jpg" alt="avatar" className="rounded-circle img-responsive" />
                                    <div className="text-center">
                                        <h4 className="mt-1 mb-2">Maria Doe</h4>
                                        <h5 className="mt-1 mb-2">youg1322@naver.com</h5>
                                    </div>
                                </div>
                            </a>
                            {/* Body */}
                            <div className="modal-body">
                                <h4 className="mt-1 mb-2">배경화면 설정</h4>
                                <div className="background-setting">
                                    <img id="1" onClick={this.onBackGroundClick.bind(this)} src="assets/images/abandoned-forest-industry-nature.jpg" alt="assets/images/abandoned-forest-industry-nature.jpg" className={this.state.backgroundId === "1" ? "active rounded-circle img-responsive" : "rounded-circle img-responsive"} />
                                    <img id="2" onClick={this.onBackGroundClick.bind(this)} src="assets/images/arizona-asphalt-beautiful-blue-sky.jpg" alt="assets/images/arizona-asphalt-beautiful-blue-sky.jpg" className={this.state.backgroundId === "2" ? "active rounded-circle img-responsive" : "rounded-circle img-responsive"} />
                                    <img id="3" onClick={this.onBackGroundClick.bind(this)} src="assets/images/sunray-through-trees.jpg" alt="assets/images/sunray-through-trees.jpg" className={this.state.backgroundId === "3" ? "active rounded-circle img-responsive" : "rounded-circle img-responsive"} />
                                    <img id="4" onClick={this.onBackGroundClick.bind(this)} src="assets/images/fire-wallpaper.jpg" alt="assets/images/fire-wallpaper.jpg" className={this.state.backgroundId === "4" ? "active rounded-circle img-responsive" : "rounded-circle img-responsive"} />
                                    <div className="btn background-setting-button">
                                        더 보기
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <a href="/nest/">
                                    <div className="text-center mt-4 user-logout">
                                        <button className="btn btn-cyan mt-1">Logout <i className="fas fa-sign-in ml-1"></i></button>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}