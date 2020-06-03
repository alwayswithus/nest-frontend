import React from 'react';

import TransferText from './TransferText';
import './roleTransfer.scss';

export default class RoleTransfer extends React.Component {

    callbackRoleTransferClose() {
        this.props.roleTransferSetting.close();
    }

    render() {
        return (
            <div id="RoleTransfer">
                <div className="Modal-overlay" />
                {this.props.roleTransferCloseButton ? "" :
                <div className="Modal" style={{borderRadius: "10px"}}>
                    <p className="title">
                        권한 이전하기
                        <button type="button" className="close" onClick={this.callbackRoleTransferClose.bind(this)}>&times;</button>
                    </p>
                    <div className="title-content">
                        <strong>{this.props.project.projectTitle} </strong>
                        프로젝트에서 나가기 전에 전체 엑세스 권한을 가지고 있는 멤버가 존재해야 합니다. <br />
                        전체 엑세스 권한을 줄 멤버 한 명을 선택해주시기 바랍니다.
                    </div>
                    <div className="content">
                        <p><TransferText /></p>
                    </div>
                    <div className="button-wrap">
                        <button> 프로젝트 나가기 </button>
                    </div>
                </div>}
            </div>
        )
    }
}