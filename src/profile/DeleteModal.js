import React from 'react';
import './DeleteModal.scss';
import TransferText from './TransferText'

const Modal = () => {
    return (
        <React.Fragment>
            <div className="Modal-overlay" />
            <div className="Modal">
                <p className="title">소유권 이전하기</p>
                <span>계정을 삭제하기 전에 회원님의 워크스페이스, 프로젝트 업무, 대화채널 소유권을 다른 팀원에게 이전해야 합니다.</span>
                <div className="content">
                    <p>
                        <TransferText />
                    </p>
                </div>
                <div className="button-wrap">
                    <button> Confirm </button>
                </div>
            </div>
        </React.Fragment>
    )
}
export default Modal;