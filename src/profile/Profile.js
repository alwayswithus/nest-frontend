import React, {Component} from 'react';
import './profile.scss';
import ProfileNav from './ProfileNav';
import Navigator from "../navigator/Navigator";
import ApiService from '../ApiService';
import moment from 'moment';

const API_URL = "http://localhost:8080/nest";
const API_HEADERS = {
    "Content-Type": "application/json",
  };

class Profile extends Component {
    constructor(){
        super(...arguments)
        this.state = {
            profileUser : null, // 유저의 모든 정보 배열
            validDate:false, // 생일 validation 상태변수
            validNumber:false, // 전화번호 validation 상태변수
            change:false, // 회원 정보 수정 상태변수
            photoUpdate:false, // 회원 프로필 이미지 상태변수
            selectedFile:null, // 회원 이미지 파일
            name:null,
            dept:null,
            title:null,
            number:null,
            birth:null,
            photo:''
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

    onClickprofileSave(){
        console.log("!!!!")
        let userInfo = {
            userNo:sessionStorage.getItem("authUserNo"),
            userPhoto: this.state.photo,
            userName: this.state.name,
            userDept: this.state.dept,
            userTitle: this.state.title,
            userNumber: this.state.number,
            userBirth: this.state.birth
        }
        fetch(`${API_URL}/api/profile/update`, {
            method:'post',
            headers:API_HEADERS,
            body: JSON.stringify(userInfo)
        })
        this.setState({
            change:false
        })

        sessionStorage.setItem("authUserPhoto", this.state.photo);
    }

    //이름 변경
    onChangeName(event){
        this.setState({
            name:event.target.value,
            change:true
        })
    }

    //부서 변경
    onChangeDept(event){
        this.setState({
            dept:event.target.value,
            change:true
        })
    }

    //직함 변경
    onChangeTitle(event){
        this.setState({
            title:event.target.value,
            change:true
        })
    }

    //번호 변경
    onChangeNumber(event){
        var regExp = /^\d{3}-\d{3,4}-\d{4}$/;
        if(regExp.test(event.target.value)){
            this.setState({
                validNumber:false,
                number:event.target.value,
                change:true
            })
        } else {
            this.setState({
                validNumber:true,
                number:event.target.value
            })
        }
    }

    //생년월일 변경
    onChangeBirth(event){
        if(moment(event.target.value,"YYYY-MM-DD",true).isValid()){
            this.setState({
                birth:event.target.value,
                validDate:false,
                change:true
            })
        } else {
            this.setState({
                birth:event.target.value,
                validDate:true
            })
        }
    }

    //사진 업데이트 하기 클릭
    handleChange(event){
        console.log(event.target.files[0].type)
        if(event.target.files[0].type === 'image/png' || event.target.files[0].type ==='image/jpeg'){
            this.setState({
                photo:URL.createObjectURL(event.target.files[0]),
                photoUpdate:true,
                selectedFile:event.target.files[0]
            })
        } else{
            alert("지원하지 않는 파일 형식입니다.")
        }


    }

    //취소 클릭
    onClickReset(){
        this.setState({
            photoUpdate:false,
            photo:this.state.profileUser.userPhoto
        })
    }

    //수정 클릭
    onClickConfirm(){
        this.setState({
            photoUpdate:false,
            change:true
        })
        console.log(this.state.selectedFile)
        const formData = new FormData();
        formData.append('file', this.state.selectedFile)

        fetch(`${API_URL}/api/profile/photoupload`, {
            method: 'post',
            body:formData
        })
        .then((response) => response.json())
        .then((json) => {
            this.setState({
                photo:API_URL+json.data
            })
        })
    }
    render(){
        if(!this.state.profileUser){
            return <></>
        }
        
        
        return (
            <>
                <Navigator callbackChangeBackground = {this.props.callbackChangeBackground}/>
                <div style={{ textAlign: 'center'}}>
                    <div className="Profile">
                        <ProfileNav />
                        <div className="profileLayout">
                            <div className="profileImg">
                                <div className="userPhoto" style={{ backgroundImage: `url(${this.state.photo})` }}></div>
                                {this.state.photoUpdate ? 
                                    <ul className="list-unstyled list-inline media-detail"> 
                                        <li className="photoupdate-reset" onClick={this.onClickReset.bind(this)}>취소</li>
                                        <li className="photoupdate-confirm" onClick={this.onClickConfirm.bind(this)}>수정</li>
                                    </ul>:
                                    <>
                                        <label htmlFor="PhotoUpdate">
                                            <div className="PhotoUpdate"><i className="fas fa-camera icon-camera"></i> &nbsp;사진업데이트</div>
                                        </label>
                                        <input type="file" id="PhotoUpdate" style={{display:'none'}} onChange={this.handleChange.bind(this)}></input>
                                    </>
                                }
                            </div>
                            <div className='profileInput'>
                                <div>
                                    <div className="profileMenu">이름</div>
                                    {this.state.profileUser.userName === null ? 
                                        <input name="name" type="text" value={this.state.name} placeholder="ex) 홍길동" onChange={this.onChangeName.bind(this)}/> : 
                                        <input name="name" type="text" value={this.state.name} placeholder={this.state.profileUser.userName} onChange={this.onChangeName.bind(this)}/>}
                                </div>
                                <div>
                                    <div className="profileMenu">이메일</div>
                                    <input type="text" placeholder={this.state.profileUser.userEmail} readOnly/>
                                </div>
                                <div>
                                    <div className="profileMenu">부서</div>
                                    {this.state.profileUser.userDept === null ? 
                                        <input name="dept" type="text" value={this.state.dept} placeholder="ex) 디자인팀" onChange={this.onChangeDept.bind(this)}/> : 
                                        <input name="dept" type="text" value={this.state.dept} placeholder={this.state.profileUser.userDept} onChange={this.onChangeDept.bind(this)} />}
                                </div>
                                <div>
                                    <div className="profileMenu">직함</div>
                                    {this.state.profileUser.userTitle === null ? 
                                        <input name="title" type="text" value={this.state.title} placeholder="ex) 웹디자이너" onChange={this.onChangeTitle.bind(this)} /> : 
                                        <input name="title" type="text" value={this.state.title} placeholder={this.state.profileUser.userTitle} onChange={this.onChangeTitle.bind(this)} />}
                                </div>
                                <div>
                                    <div className="profileMenu">전화번호</div>
                                    {this.state.profileUser.userNumber === null ? 
                                        <input name="number" type="text" value={this.state.number} placeholder="ex) 000-0000-000" onChange={this.onChangeNumber.bind(this)} /> : 
                                        <input name="number" type="text" value={this.state.number} placeholder={this.state.profileUser.userNumber} onChange={this.onChangeNumber.bind(this)} />}
                                </div>
                                {this.state.validNumber ? <div style={{color:'red'}}> 전화번호 형식이 올바르지 않습니다. </div> : null}
                                <div className="profileBirth">
                                    <div className="profileMenu">생년월일</div>
                                    <div className="profileBirth-input">
                                        {this.state.profileUser.userBirth === null ? 
                                            <input name="birth" value={this.state.birth} placeholder="ex) 1900-01-01" onChange={this.onChangeBirth.bind(this)}></input> : 
                                            <input name="birth" value={this.state.birth} placeholder={this.state.profileUser.userBirth} onChange={this.onChangeBirth.bind(this)}></input>}
                                    </div>
                                </div>
                                {this.state.validDate ? <div style={{color:'red'}}> 생년월일이 올바르지 않습니다. </div> : null}
                            </div>
                            <div className="profileSave">
                                {this.state.change ? 
                                    <button className={this.state.validDate || this.state.validNumber ? "profileButton-false" : "profileButton-true"} onClick={this.onClickprofileSave.bind(this)} disabled={this.state.validDate || this.state.validNumber} >변경사항 저장</button> :
                                    <button className="profileButton" disabled>업데이트됨</button>
                                }
                            </div>
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
                profileUser:response.data.data,
                name:response.data.data.userName,
                dept:response.data.data.userDept,
                title:response.data.data.userTitle,
                number:response.data.data.userNumber,
                birth:response.data.data.userBirth,
                photo:response.data.data.userPhoto
            })
        })
    }
}


export default Profile;