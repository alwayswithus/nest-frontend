import React, {Component} from 'react'
import './TransferText.scss';
import ProjectMemberAdd from '../dashboard/projectsetting/ProjectMemberAdd'
class TransferText extends Component {
    
    constructor(){
        super(...arguments)
        this.state = {
            open:false
        }
    }

    onClickMemberList() {
        this.setState({
            open:!this.state.open
        })
    }
    render(){
        return(
            <div className="TransferText">
                <sapn style={{fontSize:'0.5rem'}}>다음은 소유권 이전이 필요합니다. 결제 상태는 그대로 유지됩니다.</sapn>
                <hr style={{border:'3px solid black'}}/>
                <div className="transfer" onClick={this.onClickMemberList.bind(this)}>
                    <img src='/nest/assets/images/unnamed.jpg'></img>
                    <i class="fas fa-arrow-right"></i>
                    <img src='/nest/assets/images/unnamed.jpg'></img>
                    {this.state.open ? <ProjectMemberAdd /> : "" }
                </div>
            </div>
        )
    }
}

export default TransferText;