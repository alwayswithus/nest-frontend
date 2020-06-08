import React from 'react';
import './profileset.scss';
import ProfileNav from './ProfileNav';
import Navigator from '../navigator/Navigator';
import SettingList from './SettingList';

const ProfileSetting = (props) => {
 
    return (
        <>
            <Navigator callbackChangeBackground = {props.callbackChangeBackground}/>
            <div style={{ textAlign: 'center'}}>
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

