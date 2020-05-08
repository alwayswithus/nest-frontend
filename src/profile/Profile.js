import React from 'react';
import './profile.scss';
import ProfileNav from './ProfileNav';

const Profile = (props) => {
    return (
        <div style={{textAlign:'center'}}>
            <div className="Profile">
                <ProfileNav />
                <div className="profileLayout">
                    <div className="profileImg">
                        <img src="/images/unnamed.jpg" className="img-circle" alt="Cinque Terre" />
                        <button><i class="fas fa-camera icon-camera"></i> &nbsp;사진업데이트</button>
                    </div>
                    <from className='profileInput'>
                        <div>
                            <div className="profileMenu">이름</div>
                            <input type="text" placeholder="ex) xxx"/>
                        </div>
                        <div>
                            <div className="profileMenu">부서</div>
                            <input type="text" placeholder="ex) 디자인팀"/>
                        </div>
                        <div>
                            <div className="profileMenu">직함</div>
                            <input type="text" placeholder="ex) 웹디자이너"/>
                        </div>
                        <div>
                            <div className="profileMenu">전화번호</div>
                            <input type="text" placeholder="000-0000-000"/>
                        </div>
                        <div>
                            <div className="profileMenu">주소</div>
                            <input type="text" placeholder="선택사항"/>
                        </div>
                        <div>
                            <div className="profileMenu">생년월일</div>
                            <input type="text" placeholder="선택사항"/>
                        </div>
                        <div className="profileSave">
                            <button id = "profileButton" type="submit">변경사항 저장</button>
                        </div>
                    </from>
                </div>
            </div>
        </div>
    )
}

export default Profile;