import React,{Component} from 'react';
import './ProfileModal.scss'
import ApiService from '../../../../ApiService';
class ProfileModal extends Component {
    constructor(){
        super(...arguments)
        this.state = {
            userProfile : []
        }
    }
    render(){
        return(
            <div className="container card-profile">
                <div className="card">
                    <div className="card-header">
                        <button type="button" className="close" style={{ lineHeight: "35px" }} onClick={this.props.onClickUserImg}>&times;</button>
                    </div>
                    <div className="card-body">
                        <div className="user-img" style={{backgroundImage:`url(${this.props.comment.userPhoto})`}}></div>
                        <div className="user-info">
                            <li className = "user-info-name">{this.props.comment.userName}</li>
                            <li className = "user-info-email">{this.props.comment.userEmail}</li>
                        </div>
                        <hr style={{ marginTop: "5px", marginBottom: "10px", borderColor: "#E3E3E3" }} />
                        <div className="user-info-detail">
                            <li className="user-info-detail-title">
                                <i className="fas fa-id-badge"></i>
                                <span>직함 : </span>
                                {this.state.userProfile.userTitle === null ? <span>직함이 없습니다.</span> : <span>{this.state.userProfile.userTitle}</span>}
                            </li>
                            <li className="user-info-detail-dept">
                                <i className="fas fa-building"></i>
                                <span>부서 : </span>
                                {this.state.userProfile.userDept === null ? <span>부서가 없습니다.</span> : <span>{this.state.userProfile.userDept}</span>}
                            </li>
                            <li className="user-info-detail-number">
                                <i className="fas fa-phone-square-alt"></i> 
                                <span>전화번호 : </span>
                                {this.state.userProfile.userNumber === null ? <span>전화번호가 없습니다.</span> : <span>{this.state.userProfile.userNumber}</span>}
                            </li>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    componentDidMount(){
        ApiService.fetchProfileUser(this.props.comment.userNo)
        .then(response => 
            this.setState({
                userProfile:response.data.data,
                open:!this.state.open
            })
        )
    }
}

export default ProfileModal;