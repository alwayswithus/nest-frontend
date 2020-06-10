import React, {Component} from 'react';
import './profile.scss';
import ProfileNav from './ProfileNav';
import Navigator from "../navigator/Navigator";
import ApiService from '../ApiService';
import moment from 'moment';
import NavbarCollapse from 'react-bootstrap/NavbarCollapse';

class Profile extends Component {
    constructor(){
        super(...arguments)
        this.state = {
            profileUser : null,
            valid:false,
            profileMonth:'',
            profileDate:'',
            profileYear:''
        }
    }
    onChangeDate(event){
        if(moment(event.target.value, "D", true).isValid() || moment(event.target.value, "DD", true).isValid()){
            this.setState({
                valid:false
            })
        } else {
            this.setState({
                valid:true
            })
        }
    }

    onChangeYear(event){
        if(moment(event.target.value, "YYYY", true).isValid()){
            this.setState({
                valid:false
            })
        } else {
            this.setState({
                valid:true
            })
        }
    }

    onClickMonth(month){
        this.setState({
            profileMonth:month
        })
    }

    profileSave(){

    }

    render(){
        if(!this.state.profileUser){
            return <></>
        }
        
        const month = [1, 2, 3, 4, 5, 6, 7, 8, 9 , 10 , 11, 12]
        return (
            <>
                <Navigator callbackChangeBackground = {this.props.callbackChangeBackground}/>
                <div style={{ textAlign: 'center'}}>
                    <div className="Profile">
                        <ProfileNav />
                        <div className="profileLayout">
                            <div className="profileImg">
                                <img src={this.state.profileUser.userPhoto} className="img-circle" alt="Cinque Terre" />
                                <button><i class="fas fa-camera icon-camera"></i> &nbsp;사진업데이트</button>
                            </div>
                            <form onSubmit={this.profileSave.bind(this)} className='profileInput'>
                                <div>
                                    <div className="profileMenu">이름</div>
                                    {this.state.profileUser.userName === null ? <input name="name" type="text" placeholder="ex) 홍길동" /> : <input name="name" type="text" placeholder={this.state.profileUser.userName} />}
                                </div>
                                <div>
                                    <div className="profileMenu">부서</div>
                                    {this.state.profileUser.userDept === null ? <input name="dept" type="text" placeholder="ex) 디자인팀" /> : <input name="dept" type="text" placeholder={this.state.profileUser.userDept} />}
                                </div>
                                <div>
                                    <div className="profileMenu">직함</div>
                                    {this.state.profileUser.userTitle === null ? <input name="title" type="text" placeholder="ex) 웹디자이너" /> : <input name="title" type="text" placeholder={this.state.profileUser.userTitle} />}
                                </div>
                                <div>
                                    <div className="profileMenu">전화번호</div>
                                    {this.state.profileUser.userNumber === null ? <input name="number" type="text" placeholder="000-0000-000" /> : <input name="number" type="text" placeholder={this.state.profileUser.userNumber} />}
                                </div>
                                <div>
                                    <div className="profileMenu">주소</div>
                                    <input type="text" placeholder="선택사항" />
                                </div>
                                <div className="profileBirth">
                                    <div className="profileMenu">생년월일</div>
                                    <div className="profileBirth-input">
                                        <input name="date" className = "date" onChange={this.onChangeDate.bind(this)} type="text" placeholder={`${this.state.profileDate} 일`} />
                                        <div class="dropup">
                                            <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">{this.state.profileMonth} 월
                                                <span class="caret"></span>
                                            </button>
                                            <ul class="dropdown-menu">
                                                <li class="dropdown-header">월</li>
                                                {month.map(month => 
                                                    <li onClick={this.onClickMonth.bind(this, month)}><span className="dropdown-span">{month}&nbsp;월</span></li>
                                                )}
                                            </ul>
                                        </div>
                                        <input name="year" className = "year" onChange={this.onChangeYear.bind(this)} type="text" placeholder={`${this.state.profileYear} 년`} />
                                    </div>
                                </div>
                                {this.state.valid ? <div style={{color:'red'}}> 생년월일이 올바르지 않습니다. </div> : null}
                                <div className="profileSave">
                                    <button id="profileButton" type="submit">변경사항 저장</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </>
        )
    }
    componentDidMount(){
        ApiService.fetchProfileUser(sessionStorage.getItem("authUserNo"))
        .then(response => {
            if(response.data.data.userBirth === null) {
                this.setState({
                    profileUser: response.data.data,
                    profileMonth: '월',
                    profileDate: '일',
                    profileYear:'년'
                })
            } else {
                this.setState({
                    profileUser: response.data.data,
                    profileMonth: moment(response.data.data.userBirth.split('-')[1]).format("M"),
                    profileDate: response.data.data.userBirth.split('-')[2],
                    profileYear:response.data.data.userBirth.split('-')[0]
                })
            }
        })
    }
}


export default Profile;