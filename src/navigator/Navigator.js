import React from 'react';
import './navigator.scss';

import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button'
import NavNotice from './NavNotice';

export default class Navigator extends React.Component {

    constructor() {
        super(...arguments);
        this.state = {
            backgroundId: "",
            popoverOpen: false,
        }
    }

    onBackGroundClick(event) {
        this.props.callbackChangeBackground.change(event.target.alt)
        this.setState({
            backgroundId: event.target.id
        })
    }

    /* 세션 스토리지 초기화. (로그아웃시 사용...) */
    sessionClear(){ 
        sessionStorage.clear(); 
        this.modalClose();
    }

    modalClose(){
        window.jQuery(document.body).removeClass("modal-open");
        window.jQuery(".modal-backdrop").remove();
    }

    onPopoverOpen() {
        this.setState({
            popoverOpen: !this.state.popoverOpen
        })
    }

    render() {
        return (
            <div className='Navigator'>
                <div className="navigation">
                    <ul className="nav-list">
                        <div className="exclude-nest-li">
                            {/*<!-- About link -->*/}
                            <div className="nav-item profile" data-toggle="modal" data-target="#use-profile" >
                                <div className="nav-item-profile" style={{ backgroundImage: `url(${window.sessionStorage.getItem("authUserPhoto")})` }}></div>
                            </div>

                            {/*<!-- Notification link -->*/}
                            <div className="nav-item button" onClick={this.onPopoverOpen.bind(this)}>
                                <span data-tooltip-text="Notification">                       
                                    <a className="badge badge-danger" style={{ backgroundColor: "red", position: "relative", zIndex: "99", left: "22px", top: "-13px"}}>0</a>
                                    <i className="far fa-bell icon" style={{position: "relative", left: "-9px"}}></i>    
                                </span>
                            </div>
                            {this.state.popoverOpen ? <NavNotice/> : ""}
                            
                            {/*<!-- Calendar link -->*/}
                            <div className="nav-item button">
                                <Link to="/nest/calendar" className="link">
                                    <span data-tooltip-text="Calendar">
                                        <i className="fas fa-calendar-alt icon"></i>
                                    </span>
                                </Link>
                            </div>

                            {/*<!-- Projects link-- >*/}
                            <div className="nav-item button">
                                <span data-tooltip-text="Projects">
                                    <Link to="/nest/dashboard" className="link">
                                        <i className="fas fa-tasks icon"></i>
                                    </Link>
                                </span>
                            </div >

                            {/*<!-- nest -->*/}
                        </div>
                        <div className="nest-li">
                            <li className="nav-item" data-toggle="modal" data-target="#nest-introduce">
                                <img src="/nest/assets/images/nest.png" id="nest-logo" />
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
                            <Link to="/nest/profile" className="profile-setting-page" onClick={this.modalClose.bind(this)}>
                                <div className="modal-header">
                                    <img src={`${window.sessionStorage.getItem("authUserPhoto")}`} alt="avatar" className="rounded-circle img-responsive" />
                                    <div className="text-center">
                                        <h4 className="mt-1 mb-2">{window.sessionStorage.getItem("authUserName")}</h4>
                                        <h5 className="mt-1 mb-2">{window.sessionStorage.getItem("authUserEmail")}</h5>
                                    </div>
                                </div>
                            </Link>
                            {/* Body */}
                            <div className="modal-body">
                                <h4 className="mt-1 mb-2">배경화면 설정</h4>
                                <div className="background-setting">
                                    <img id="1" onClick={this.onBackGroundClick.bind(this)} src="/nest/assets/images/abandoned-forest-industry-nature.jpg" alt="/nest/assets/images/abandoned-forest-industry-nature.jpg" className={this.state.backgroundId === "1" ? "active rounded-circle img-responsive" : "rounded-circle img-responsive"} />
                                    <img id="2" onClick={this.onBackGroundClick.bind(this)} src="/nest/assets/images/arizona-asphalt-beautiful-blue-sky.jpg" alt="/nest/assets/images/arizona-asphalt-beautiful-blue-sky.jpg" className={this.state.backgroundId === "2" ? "active rounded-circle img-responsive" : "rounded-circle img-responsive"} />
                                    <img id="3" onClick={this.onBackGroundClick.bind(this)} src="/nest/assets/images/sunray-through-trees.jpg" alt="/nest/assets/images/sunray-through-trees.jpg" className={this.state.backgroundId === "3" ? "active rounded-circle img-responsive" : "rounded-circle img-responsive"} />
                                    <img id="4" onClick={this.onBackGroundClick.bind(this)} src="/nest/assets/images/fire-wallpaper.jpg" alt="/nest/assets/images/fire-wallpaper.jpg" className={this.state.backgroundId === "4" ? "active rounded-circle img-responsive" : "rounded-circle img-responsive"} />
                                    <div className="btn background-setting-button">
                                        더 보기
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <form action="/nest/logout" method="POST">
                                    <div className="text-center mt-4 user-logout">
                                        <input type="submit" className="btn btn-cyan mt-1" onClick={this.sessionClear.bind(this)} value="Logout" method="POST"/>
                                        {/*<i className="fas fa-sign-in ml-1"></i>*/}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}