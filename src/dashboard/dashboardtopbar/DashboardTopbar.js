import React from 'react';
import './dashboardtopbar.scss';

export default class DashboardTopbar extends React.Component {
    render() {
        return (
            <div id="DashboardTopbar">
                <div className="topBar">
                    <img src="images/nest.png" id="nest-logo" />
                    <nav className="navbar navbar-default">
                        <div className="container-fluid">
                            <form class="navbar-form navbar-left" action="">
                                <div class="form-group">
                                    <input type="text" class="form-control" placeholder="Search" />
                                </div>
                            </form>
                        </div>
                    </nav>
                </div>
            </div>
        );
    }
}