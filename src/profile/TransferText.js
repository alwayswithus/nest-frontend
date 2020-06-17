import React, {Component} from 'react'
import './TransferText.scss';
import ProfileProjectMember from './ProfileProjectMember';
import TransferAccount from './TransferAccount';

class TransferText extends Component {


    render(){
        console.log(this.props.projects)
        return(
            <div className="TransferText">
                <div className="transfer">
                    <div>
                        {this.props.projects&&this.props.projects.map(project => 
                         project.roleNo != '1' ? 
                         <div className="project-title">{project.projectTitle}</div>
                            : null
                        )}
                    </div>
                    <div>
                        {this.props.projects&&this.props.projects.map(project => 
                            <TransferAccount 
                                deleteModalCallbacks={this.props.deleteModalCallbacks}
                                project = {project}
                            />
                        )}
                    </div>
                    <i className="fas fa-quote-left"></i>
                    {this.props.projects.map(project => 
                        project.roleNo == '1' ? 
                            <div key={project.projectNo} className="role-project-title">{project.projectTitle}, </div> : null
                    )}
                    <i className="fas fa-quote-right"></i>
                    <div className="warning-text">에서 권한이 <strong>전체 엑세스</strong> 입니다. 해당 프로젝트를 클릭하여 1명 이상에게 전체 엑세스를 넘겨주고 본인의 권한을 제한 혹은 통제 엑세스로 변경하세요.</div>
                </div>
            </div>
        )
    }
}

export default TransferText;