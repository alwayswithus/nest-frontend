import React,{Component} from 'react';
import './profileset.scss';
import DeleteModal from './DeleteModal';

class SettingList extends Component {
    constructor() {
        super(...arguments)
        this.state = {
            opne:false
        }
    }
    onModalOpen(){
        this.setState({
            open:!this.state.open
        })
    }
    render(){
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
                                <input id='submit' type="submit" value="비밀번호변경"/>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="panel panel-default">
                    <div class="panel-heading">
                    <h4 class="panel-title">
                        <a data-toggle="collapse" data-parent="#accordion" href="#collapse2"> 시간 설정 </a>
                    </h4>
                    </div>
                    <div id="collapse2" class="panel-collapse collapse">
                    <div class="panel-body">
                        타임존 <br/>
                        <input id='submit' type="submit" value="타임존업데이트"/>
                    </div>
                    </div>
                </div>
                <div className="panel panel-default">
                    <div className="panel-heading">
                    <h4 className="panel-title">
                        <a data-toggle="collapse" data-parent="#accordion" href="#collapse3"> 언어(Language) </a>
                    </h4>
                    </div>
                    <div id="collapse3" class="panel-collapse collapse">
                    <div class="panel-body"> 
                        언어 <br/>
                        <input id='submit' type="submit" value="언어업데이트"/> 
                    </div>
                    </div>
                </div>
                <div className="panel panel-default">
                    <div className="panel-heading">
                    <h4 className="panel-title">
                        <a data-toggle="collapse" data-parent="#accordion" href="#collapse4">알림 설정</a>
                    </h4>
                    </div>
                    <div id="collapse4" class="panel-collapse collapse">
                    <div class="panel-body">
                        <form className="notify-form">
                            <ul>
                                <li><input type="checkbox" name='Nest'/> Nest 전체 알림</li>
                                <li><input type="checkbox" name='Slack'/> Slack 알림</li>
                                <li><input type="checkbox" name="Git"/> Git 알림</li>
                                <li><input type="checkbox" name="Calendar"/> 구글 캘린더 알림</li>
                                <li><input type="checkbox" name="Email"/> 이메일 수신</li>
                            </ul>
                            <input id='submit' type="submit" value="알림업데이트"/>
                        </form>
                    </div>
                    </div>
                </div>
                <div class="panel panel-default">
                    <div class="panel-heading">
                    <h4 class="panel-title">
                        <a data-toggle="collapse" data-parent="#accordion" href="#collapse5">계정 삭제 </a>
                    </h4>
                    </div>
                    <div id="collapse5" class="panel-collapse collapse">
                    <div class="panel-body">
                        <div className="bodyText">
                        한 번 삭제된 계정은 다시 복구할 수 없습니다. 계정이 삭제되면, 현재 계정에서 생성된 모든 데이터에 더이상 엑세스할 수 없습니다. 
                        삭제 후, 다시 이용하고자 한다면, 새로 가입해주셔야합니다.
                        </div>
                        <div className="bodyA">
                            <button className = "delete" onClick = {this.onModalOpen.bind(this)}><b>계정 삭제하기</b></button>
                            {this.state.open ? <DeleteModal /> : "" }
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        )
    }
 }

 export default SettingList;