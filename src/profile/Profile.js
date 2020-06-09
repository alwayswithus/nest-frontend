import React, {Component} from 'react';
import './profile.scss';
import ProfileNav from './ProfileNav';
import Navigator from "../navigator/Navigator";
import ApiService from '../ApiService';

class Profile extends Component {
    constructor(){
        super(...arguments)
        this.state = {
            profileUser : []
        }
    }
    render(){
        return (
            <>
                <Navigator callbackChangeBackground = {this.props.callbackChangeBackground}/>
                <div style={{ textAlign: 'center'}}>
                    <div className="Profile">
                        <ProfileNav />
                        <div className="profileLayout">
                            <div className="profileImg">
                                <img src={`${window.sessionStorage.getItem("authUserPhoto")}`} className="img-circle" alt="Cinque Terre" />
                                <button><i class="fas fa-camera icon-camera"></i> &nbsp;사진업데이트</button>
                            </div>
                            <from className='profileInput'>
                                <div>
                                    <div className="profileMenu">이름</div>
                                    <input 
                                        type="text" 
                                        placeholder={`${sessionStorage.getItem("authUserName")}`} />
                                </div>
                                <div>
                                    <div className="profileMenu">부서</div>
                                    
                                    <input type="text" placeholder="ex) 디자인팀" />
                                </div>
                                <div>
                                    <div className="profileMenu">직함</div>
                                    <input type="text" placeholder="ex) 웹디자이너" />
                                </div>
                                <div>
                                    <div className="profileMenu">전화번호</div>
                                    <input type="text" placeholder="000-0000-000" />
                                </div>
                                <div>
                                    <div className="profileMenu">주소</div>
                                    <input type="text" placeholder="선택사항" />
                                </div>
                                <div>
                                    <div className="profileMenu">생년월일</div>
                                    <input type="text" placeholder="선택사항" />
                                </div>
                                <div className="profileSave">
                                    <button id="profileButton" type="submit">변경사항 저장</button>
                                </div>
                            </from>
                        </div>
                    </div>
                </div>
            </>
        )
    }
    componentDidMount(){
        ApiService.fetchProfileUser(sessionStorage.getItem("authUserNo"))
        .then(response => {
            this.setState({
                profileUser: response.data.data
            })
        })
    }
}


export default Profile;