import React, { Component } from 'react';
import './header.scss';
import Navigation from '../TaskSetNav';
import {Link} from 'react-router-dom';

class Header extends Component {
    constructor(){
        super(...arguments)
        this.state = {
            input : false,
            keyword:''
        }
    }
    onClickTaskContents(){
        this.setState({
            input:!this.state.input,
            keyword: this.props.taskContents
        })
    }

    onKeyPressEnter(event){
        if(event.key == 'Enter'){
            this.setState({
                input: !this.state.input
            })
            this.props.taskCallbacks.updateTaskContents()
        }
    }
    render(){
    return (
        <div style={{display:'block'}} id= "taskSettingHeader" className="Header">
            <Link 
                style= {{color:'black'}}
                to = {`/nest/dashboard/${this.props.projectNo}/kanbanboard`} 
                onClick={this.props.onClickTag}><i className="fas fa-times fa-1x"></i></Link>
            <div className="Header-list">
                {/* 업무 내용 수정 */}
                {this.state.input ? 
                    <h2>
                        <input
                            value={this.state.keyword} 
                            onKeyPress={this.onKeyPressEnter.bind(this)} className="Header-input"></input>
                    </h2> : 
                    <h2 onClick={this.onClickTaskContents.bind(this)}>
                        <b>{this.props.taskContents}</b>
                        <i className="far fa-edit Icon"></i>
                    </h2>
                } 
                <span>작성자 : {this.props.name} • &nbsp;&nbsp;&nbsp; 작성일 : {this.props.date}</span>
            </div>
            <Navigation params = {this.props.params} projectNo={this.props.projectNo} />
        </div>
    )
    }
}

export default Header;