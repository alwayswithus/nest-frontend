import React from 'react';
import './dashboardtopbar.scss';

export default class DashboardTopbar extends React.Component {
    render() {
        return (
            <div id="DashboardTopbar">
                <div className="topBar">
                    <nav className="navbar navbar-default">
                        <div className="container-fluid">
                            <form className="navbar-form navbar-left" action="">
                                <input type="text" className="form-control" placeholder="Search" />
                            </form>
                        </div>
                    </nav>
                </div>
            </div>
        );
    }
}