import React,{useState} from 'react';
import './profileset.scss';
import ProfileNav from './ProfileNav';
import Navigator from '../dashboard/navigator/Navigator';
import TimeZone from './TimeZone';
import Test from './Test';

const ProfileSetting = (props) => {
    const [visible, setVisible] = useState(true);

    const FoldEvent = () => {
        setVisible(!visible);
    }

    return (
        <>
            <Navigator />
            <div style={{ textAlign: 'center', backgroundColor:'#E7E7E7'}}>
                <div className="Profile">
                    <ProfileNav />
                    <div className="profileLayout">
                        <div className='profileSet'>
                            <Test />
                            <div className = "PasswordSet">
                                <div className="password">
                                    <span><h4><b>비밀번호</b></h4></span>
                                    <div onClick={FoldEvent}>
                                        {visible ? 
                                        <i class="fas fa-arrow-circle-down fa-2x" /> : <i class="fas fa-arrow-circle-up fa-2x"/>}
                                    </div>
                                </div>
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
                            <div className = "TimeSet">
                                <h4><b>시간설정</b></h4>
                                <TimeZone />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProfileSetting;