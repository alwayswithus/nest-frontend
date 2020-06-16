import React, { Component } from 'react'
import './ProfileProjectMember.scss';
import ApiService from '../ApiService';
import TransferMember from './TransferMember';

class ProfileProjectMember extends Component {

    constructor() {
        super(...arguments)
        this.state = {
            memberKeyword: "",
            projectMembers:[]
        }
    }

    // User List Close Function
    callbackCloseUserList() {
        this.props.onClose();
    }

    // CallBack Open Invite Member Function
    callbackOpenInviteMember() {
        this.props.callbackOpenInviteMember.open(true)
    }

    // Find Member Search Function
    onFindMemberSearch(event) {
        this.setState({
            memberKeyword: event.target.value
        })
    }

    render() {
        return (
            <div className="ProfileProjectMember">
                {/* Add Project Member select */}
                <div className="container card-member">
                    <div className="card">
                        <div className="card-header">
                            <h6 style={{ display: "inline-block", fontSize: "14px", fontWeight: "bold" }}>멤버</h6>
                            <button type="button" className="close" style={{ lineHeight: "35px" }} onClick={this.callbackCloseUserList.bind(this)} >&times;</button>
                            <hr style={{ marginTop: "5px", marginBottom: "10px", borderColor: "#E3E3E3" }} />
                        </div>
                        <div className="card-body">
                            <input type="text" className="form-control find-member" onChange={this.onFindMemberSearch.bind(this)} placeholder="이름 혹은 이메일로 찾기" />
                            <div className="invite-card-member-list">
                                {this.state.projectMembers && this.state.projectMembers.map(member => 
                                    sessionStorage.getItem("authUserNo") == member.userNo ? 
                                        <>
                                        <div className="invite-card-member" key={member.userNo}
                                            id={member.userNo}>
                                        <img src={member.userPhoto} className="img-circle" alt={member.userPhoto} />
                                        <span>{member.userName}</span>
                                         </div>
                                         <div class="dropdown">
                                         <button class="btn dropdown-toggle" type="button" data-toggle="dropdown">
                                             {member.roleNo == 1 ? "전체엑세스" : member.roleNo == 2 ? "제한엑세스" : "통제엑세스"}
                                         <span class="caret"></span></button>
                                         <ul class="dropdown-menu">
                                             <li><a href="#">전체엑세스</a></li>
                                             <li><a href="#">제한엑세스</a></li>
                                             <li><a href="#">통제엑세스</a></li>
                                         </ul>
                                     </div></>: 
                                        null
                            
                                )}
                                 {this.state.projectMembers && this.state.projectMembers.map(member => 
                                    <TransferMember 
                                    key={member.userNo}
                                    member={member}
                                />
                                )}
            
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    componentDidMount(){
        ApiService.fetchProjectMember(this.props.projectNo)
        .then(response=>
            this.setState({
                projectMembers:response.data.data
            })
        )
    }
}

export default ProfileProjectMember;