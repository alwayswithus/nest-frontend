import React, {Component} from 'react'
import './SettingTag.scss';

class SettingTag extends Component {

    constructor(){
        super(...arguments)
        this.state = {
            checked:false
        }
    }
    //checkbox를 클릭했을 때 tag를 추가하기.
    onCheckBox(event){
        
        console.log( event.target.checked )
        this.setState({
            checked:event.target.checked
        })
        if(event.target.checked){
            this.props.taskCallbacks.addtag(
                this.props.tagParams.tagNo, 
                this.props.tagParams.tagName, 
                this.props.tagParams.taskListNo, 
                this.props.tagParams.taskNo);
        } else{
            this.props.taskCallbacks.deletetag(
                this.props.tagParams.tagNo,
                this.props.tagParams.taskListNo,
                this.props.tagParams.taskNo)
        }
    }

    render(){
        return(
            <li className="SettingTag" style={{ margin:'5% 0% 0% 0%'}}>
                <input 
                    onClick = {this.onCheckBox.bind(this)} 
                    type="checkbox" 
                    className="tagCheck"
                    checked={this.state.checked}
                    readOnly
                    ></input>
                <div className="tag">{this.props.tagParams.tagName}</div> 
            </li>
        )
    }
}

export default SettingTag;