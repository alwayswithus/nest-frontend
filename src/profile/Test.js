import React,{useState} from 'react';

const Test = (props) => {
    
    const [visible, setVisible] = useState(true);
    
    // const FoldEvent = () => {
    //    setVisible(!visible);
    // }

    const onChanged = (e) => {
        const visible = e.target.className === 'collapsed';
        console.log( e.target);
        setVisible(visible);
    }
    return (
        <div className="panel-group" id="accordion">
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h4 className="panel-title">
                        <a data-toggle="collapse" data-parent="#accordion" href="#collapse1">비밀번호</a>
                    </h4>
                </div>
                <div id="collapse1" class="panel-collapse collapse in">
                    <div className="panel-body">
                        <form className="passwordForm">
                            <div className="Current-pass">
                                <span>현재 비밀번호</span><br/>
                                <input />
                            </div>
                            <div className="New-pass">
                                <span>새 비밀번호</span><br/>
                                <input />
                            </div>
                            <div className="Confirm-pass">
                                <span>새 비밀번호 확인</span><br/>
                                <input />
                            </div>
                        </form>
                    </div>
        console.log(e.target.a);
        // const visible = e.target.className === 'fa-arrow-circle-down';
        setVisible(visible);
    }
    return (
        <div class="panel-group" id="accordion">
            <div class="panel panel-default">
                <div class="panel-heading">
                <h4 class="panel-title">
                    <a data-toggle="collapse" data-parent="#accordion" href="#collapse1"> 비밀번호 </a>
                </h4>
                </div>
                <div id="collapse1" class="panel-collapse collapse in">
                <div class="panel-body">Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                commodo consequat.</div>
                </div>
            </div>
            <div class="panel panel-default">
                <div class="panel-heading">
                <h4 class="panel-title">
                    <a data-toggle="collapse" data-parent="#accordion" href="#collapse2"> 시간 설정 </a>
                </h4>
                </div>
                <div id="collapse2" class="panel-collapse collapse">
                <div class="panel-body">
                    타임존
                </div>
                </div>
            </div>
            <div class="panel panel-default">
                <div class="panel-heading">
                <h4 class="panel-title">
                    <a data-toggle="collapse" data-parent="#accordion" href="#collapse3"> 언어 설정 </a>
                </h4>
                </div>
                <div id="collapse3" class="panel-collapse collapse">
                <div class="panel-body">Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                commodo consequat.</div>
                </div>
            </div>
            <div class="panel panel-default">
                <div class="panel-heading">
                <h4 class="panel-title">
                    <a data-toggle="collapse" data-parent="#accordion" href="#collapse4">알림 설정</a>
                </h4>
                </div>
                <div id="collapse4" class="panel-collapse collapse">
                <div class="panel-body">Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                commodo consequat.</div>
                </div>
            </div>
            <div class="panel panel-default">
                <div class="panel-heading">
                <h4 class="panel-title">
                    <a data-toggle="collapse" data-parent="#accordion" href="#collapse5">계정 삭제 </a>
                </h4>
                </div>
                <div id="collapse5" class="panel-collapse collapse">
                <div class="panel-body">Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                commodo consequat.</div>
                </div>
            </div>
        </div>
    )
 }

 export default Test;