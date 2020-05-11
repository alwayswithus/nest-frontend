import React from 'react';
import './navigator.scss';

export default class Navigator extends React.Component {
    render() {
        return (
            <div className='Navigator'>
                <div className="navigation">
                    <ul className="nav-list">

                        {/*<!-- nest -->*/}
                        <li className="nav-item">
                            <a href="#" className="link">
                                <img src="images/nest.png" id="nest-logo" /><br />
                                <h5>Nest</h5>
                            </a>
                        </li>
                        
                        {/*<!-- About link -->*/}
                        <li className="nav-item">
                            <a href="#" className="link">
                                <i className="fas fa-user icon"></i><br />
                                <span className="label">About Me</span>
                            </a>
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
            </div >
        );
    }
}