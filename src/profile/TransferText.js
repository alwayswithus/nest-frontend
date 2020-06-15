import React, {Component} from 'react'
import './TransferText.scss';
import ProfileProjectMember from './ProfileProjectMember';
class TransferText extends Component {
    
    constructor(){
        super(...arguments)
        this.state = {
            open:false,
            projectNo:''
        }
    }

    onClickProjectTitle(projectNo) {
        this.setState({
            open:!this.state.open,
            projectNo:projectNo
        })
    }


    render(){
        return(
            <div className="TransferText">
                <span style={{fontSize:'0.5rem'}}>다음은 소유권 이전이 필요합니다. 결제 상태는 그대로 유지됩니다.</span>
                <hr style={{border:'1px solid #DFDFDF',marginTop: '9px'}}/>
                <div className="transfer">
                    <div>
                        {this.props.userProject&&this.props.userProject.map(project => 
                         project.roleNo == '1' ? 
                            <div key={project.projectNo} className="project-title-transfer" onClick={this.onClickProjectTitle.bind(this, project.projectNo)}>{project.projectTitle}</div>
                            : <div className="project-title">{project.projectTitle}</div>
                        )}
                        {this.state.open ? 
                        <ProfileProjectMember 
                            projectNo={this.state.projectNo}
                            onClose={this.onClickProjectTitle.bind(this)}
                        /> : null}
                    </div>
                    <i className="fas fa-quote-left"></i>
                    {this.props.userProject.map(project => 
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