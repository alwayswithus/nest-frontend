import React from 'react';
import './navigator.scss';

export default class Navigator extends React.Component {
    render() {
        return (
            <div className='Navigator'>
                <div className="navigation">
                    <ul className="nav-list">

                        {/*<!-- nest -->*/}
                        <li className="nav-item" data-toggle="modal" data-target="#nest-introduce">                      
                            <img src="images/nest.png" id="nest-logo" /><br />
                            <h6>Nest</h6>                    
                        </li>

                        {/*<!-- About link -->*/}
                        <li className="nav-item">                    
                            <i className="fas fa-user icon"></i><br />
                            <span className="label">About Me</span>     
                        </li>

                        {/*<!-- Notification link -->*/}
                        <li className="nav-item">
                            <a href="/notification" className="link">
                                <i className="far fa-bell icon"></i>
                                <br />
                                <span className="label">Notification</span>
                            </a>
                        </li>

                        {/*<!-- Calendar link -->*/}
                        <li className="nav-item">
                            <a href="#" className="link">
                                <i className="fas fa-calendar-alt icon"></i>
                                <br />
                                <span className="label">Calendar</span>
                            </a>
                        </li>

                        {/*<!-- Projects link-- >*/}
                        <li className="nav-item">
                            <a href="/dashboard" className="link">
                                <i className="fas fa-tasks icon"></i>
                                <br />
                                <span className="label">Projects</span>
                            </a>
                        </li >

                        {/*< !--Testimonials link-- >*/}
                        <li className="nav-item">
                            <a href="#" className="link">
                                <i className="fas fa-comment-dots icon"></i>
                                <br />
                                <span className="label">Slack</span>
                            </a>
                        </li >
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
            </div>
        );
    }
}