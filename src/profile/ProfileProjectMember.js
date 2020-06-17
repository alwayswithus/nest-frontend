import React, { Component } from 'react'
import './ProfileProjectMember.scss';
import TransferMember from './TransferMember';

class ProfileProjectMember extends Component {

    constructor() {
        super(...arguments)
        this.state = {
            memberKeyword: "",
            userRole:''
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
        const projectMembers = this.props.project.members
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
                                {projectMembers && projectMembers.map(member => 
                                    <TransferMember 
                                        onUpdateTransferImg={this.props.onUpdateTransferImg}
                                        onClose={this.props.onClose}
                                        key={member.userNo}
                                        member={member}
                                        deleteModalCallbacks={this.props.deleteModalCallbacks}
                                    />
                                )}
            
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ProfileProjectMember;