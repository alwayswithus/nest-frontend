import React,{Component} from 'react';
import './profileset.scss';
import DeleteModal from './DeleteModal';
import { Link } from "react-router-dom"
import { displayName } from 'react-quill';

const API_URL = "http://localhost:8080/nest";
const API_HEADERS = {
    "Content-Type": "application/json",
  };

class SettingList extends Component {
    constructor() {
        super(...arguments)
        this.state = {
            opne:false,

            passError:false,
            errortext:"",
            currentPass:"",
            newPass:"",
            confirmPass:""

        }
    }
    onModalOpen(){
        this.setState({
            open:!this.state.open
        })
    }

    render(){
        /* 비밀번호 변경 관련 */
        const passwordFormSubmit = e =>{
            e.preventDefault();
            if(this.state.currentPass === "") {
                this.setState({
                    passError:false,
                    currentPass:"",
                    newPass:"",
                    confirmPass:"",
                    errortext:"현재 비밀번호가 입력되지 않았습니다."
                })
            } else if(this.state.newPass === "") {
                this.setState({
                    passError:false,
                    currentPass:"",
                    newPass:"",
                    confirmPass:"",
                    errortext:"새 비밀번호가 입력되지 않았습니다."
                })
            } else if (this.state.confirmPass === "") {
                this.setState({
                    passError:false,
                    currentPass:"",
                    newPass:"",
                    confirmPass:"",
                    errortext:"새 비밀번호 확인을 입력하세요."
                })
            } else if (this.state.newPass !== this.state.confirmPass) {
                this.setState({
                    passError:false,
                    currentPass:"",
                    newPass:"",
                    confirmPass:"",
                    errortext:"새 비밀번호 확인이 일치하지 않습니다."
                })
            } else {
                let userInfo = {
                    userNo: sessionStorage.getItem("authUserNo"),
                    userPassword: this.state.currentPass,
                    userNewPassword: this.state.newPass
                }
                fetch(`${API_URL}/api/profile/passUpdate`, {
                    method: 'post',
                    headers: API_HEADERS,
                    body: JSON.stringify(userInfo)
                }).then(response => response.json()).then(response => {
                    if (!response.data) {
                        this.setState({
                            passError:false,
                            currentPass: "",
                            newPass: "",
                            confirmPass: "",
                            errortext: "현재 비밀번호가 일치하지 않습니다."
                        });
                    } else {
                        this.setState({
                            passError:true,
                            currentPass: "",
                            newPass: "",
                            confirmPass: "",
                            errortext: "업데이트 되었습니다."
                        });
                    }
                });
            }
        }
        const currentPassSet = e => {
            let keyword = e.target.value;
            this.setState({
                errortext:"",
                currentPass:keyword
            })
        }
        const newPassSet = e => {
            let keyword = e.target.value;
            this.setState({
                newPass:keyword
            })
            if(this.state.confirmPass === ""){
                this.setState({
                    errortext:"",
                })
            }else if(this.state.confirmPass === keyword){
                this.setState({
                    passError:true,
                    errortext:"일치.",
                })
            }else{
                this.setState({
                    passError:false,
                    errortext:"새 비밀번호 확인이 일치하지 않습니다.",
                })
            }
        }
        const confirmPassSet = e => {
            let keyword = e.target.value;
            this.setState({ confirmPass:keyword })
            if(this.state.newPass === keyword){
                this.setState({
                    passError:true,
                    errortext:"일치.",
                })
            }else{
                this.setState({
                    passError:false,
                    errortext:"새 비밀번호 확인이 일치하지 않습니다.",
                })
            }
        }
        /////////////////////

        /* 알림설정 관련*/

        const notifySubmit = e => {
            e.preventDefault();
        }

        ////////////////////

        return (
            <div className="panel-group" id="accordion">
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h4 className="panel-title">
                            <Link data-toggle="collapse" data-parent="#accordion" to="#collapse1">비밀번호</Link>
                        </h4>
                    </div>
                    <div id="collapse1" class="panel-collapse collapse in">
                        <div className="panel-body">
                            <form className="passwordForm" onSubmit={passwordFormSubmit}>
                                <div className="Current-pass">
                                    <span>현재 비밀번호</span><br/>
                                    <input 
                                        name="currentPass"
                                        type="password"
                                        autocomplete="current-password"
                                        onChange={currentPassSet}
                                        value={this.state.currentPass}/>
                                </div>
                                <div className="New-pass">
                                    <span>새 비밀번호</span><br/>
                                    <input 
                                        name="newPass"
                                        type="password"
                                        autocomplete="new-password"
                                        onChange={newPassSet}
                                        value={this.state.newPass}/>
                                </div>
                                <div className="Confirm-pass">
                                    <span>새 비밀번호 확인</span><br/>
                                    <input 
                                        name="confirmPass"
                                        type="password"
                                        autocomplete="new-password"
                                        onChange={confirmPassSet}
                                        value={this.state.confirmPass}/>
                                </div>
                                <input id='submit' type="submit" value="비밀번호변경"/>
                                <p style={{display:"inline-block", paddingLeft:"20px"}} 
                                   id={(this.state.passError) ? "doneText" : "errorText"}> 
                                    {this.state.errortext} <br/>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
                {/* <div className="panel panel-default">
                    <div class="panel-heading">
                    <h4 class="panel-title">
                        <Link data-toggle="collapse" data-parent="#accordion" href="#collapse2"> 시간 설정 </Link>
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
                        <Link data-toggle="collapse" data-parent="#accordion" href="#collapse3"> 언어(Language) </Link>
                    </h4>
                    </div>
                    <div id="collapse3" class="panel-collapse collapse">
                    <div class="panel-body"> 
                        언어 <br/>
                        <input id='submit' type="submit" value="언어업데이트"/> 
                    </div>
                    </div>
                </div> */}
                <div className="panel panel-default">
                    <div className="panel-heading">
                    <h4 className="panel-title">
                        <Link data-toggle="collapse" data-parent="#accordion" to="#collapse4">알림 설정</Link>
                    </h4>
                    </div>
                    <div id="collapse4" class="panel-collapse collapse">
                    <div class="panel-body">
                        <form className="notify-form" onSubmit={notifySubmit}>
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
                        <Link data-toggle="collapse" data-parent="#accordion" to="#collapse5">계정 삭제 </Link>
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