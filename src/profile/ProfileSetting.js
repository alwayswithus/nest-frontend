import React,{useState} from 'react';
import './profileset.scss';
import ProfileNav from './ProfileNav';
import Navigator from '../dashboard/navigator/Navigator';
import SettingList from './SettingList';

const ProfileSetting = (props) => {
 
    return (
        <>
            <Navigator />
            <div style={{ textAlign: 'center', backgroundColor:'#E7E7E7'}}>
                <div className="ProfileSetting">
                <ProfileNav />
                    <div className="profileLayout">
                        <div className='profileSet'>
                            <SettingList />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProfileSetting;

