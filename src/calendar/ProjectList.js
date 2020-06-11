import React, { Component } from 'react';
import './projectList.scss';

export default class ProjectList extends Component {

    constructor() {
        super(...arguments)

        this.state = {
            projectNumber: ""
        }
    }

    
    callbackProjectListClose() {
        this.props.projectList.close();
    }

    onSelectProject(projectNo, projectTitle) {
        let projectNumber = projectNo
        
        this.props.projectList.projectNo(projectNo, projectTitle)

        this.setState({
            projectNumber: projectNumber
        })
    }

    render() {
        return (
            <div className="ProjectList">
                <div className="container card-member" style={{position: "absolute", top: "38px", left: "25px", width: "385px", height: "253px" }}>
                    <div className="card">
                        <div className="card-header">
                            <i onClick={this.callbackProjectListClose.bind(this)} className="fas fa-chevron-left"></i>
                            <h6 style={{ marginLeft: "10px", display: "inline-block", fontSize: "14px", fontWeight: "bold" }}>프로젝트 선택</h6>
                            <hr style={{ marginTop: "5px", marginBottom: "10px", borderColor: "#E3E3E3" }} />
                        </div>
                        <div className="card-body">
                            <input type="text" className="form-control find-member" placeholder="프로젝트 검색" />
                            <div className="invite-card-member-list" style={{overflow: "auto"}}>
                                {this.props.projects && this.props.projects.map(project =>
                                    <div className="project-name" key={project.projectNo} onClick={this.onSelectProject.bind(this, project.projectNo, project.projectTitle)}>
                                        {project.projectTitle}
                                        {project.projectNo === this.state.projectNumber ? <i className="fas fa-check"></i> : ""}
                                    </div> 
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}