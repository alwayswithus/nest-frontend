import React,{Component} from 'react';
import './profileset.scss';
import ProfileNav from './ProfileNav';
import Navigator from '../navigator/Navigator';
import SettingList from './SettingList';

class ProfileSetting extends Component{
    constructor(){
        super(...arguments);
        this.state = {
            popoverOpen:false
        }
    }
    onCloseEvent() {
        if(this.state.popoverOpen === true){
          this.setState({
            popoverOpen:false
          })
        } 
      }
    
      onUpdateStatePopOver(){
        this.setState({
          popoverOpen:!this.state.popoverOpen
        })
      }
    render(){
        
        return (
            <>
                <Navigator 
                    onClosePopOver = {this.onCloseEvent.bind(this)}
                    onUpdateStatePopOver = {this.onUpdateStatePopOver.bind(this)}
                    popoverOpen = {this.state.popoverOpen}
                    callbackChangeBackground = {this.props.callbackChangeBackground}/>
                <div style={{ textAlign: 'center'}} onClick={this.onCloseEvent.bind(this)}>
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
}

export default ProfileSetting;

