import React from 'react';
import './dashboardtopbar.scss';

export default class DashboardTopbar extends React.Component {
    
    onInputChange(event) {
        this.props["notifyProjectKeywordChange"](event.target.value);
    }

    render() {
        return (
            <div id="DashboardTopbar">
                <div className="topBar">
                    <nav className="navbar navbar-default">
                        <div className="container-fluid">
                            <form className="navbar-form navbar-left" action="">
                                <input type="text" value={this.props.projectKeyword} onChange={this.onInputChange.bind(this)} className="form-control" placeholder="프로젝트 검색" />
                            </form>
                        </div>
                    </nav>
                </div>
            </div>
        );
    }
}