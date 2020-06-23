import React, {Component } from 'react';
import ReactDOM from 'react-dom'
import './header.scss';
import Navigation from '../TaskSetNav';
import {Link} from 'react-router-dom';
import moment from 'moment';

class Header extends Component {
    constructor(){
        super(...arguments)
        this.state = {
            input : false,
            keyword:''
        }
        this.fileInput = React.createRef();
    }
    onClickTaskContents(){

        this.setState({
            input:!this.state.input,
            keyword: this.props.taskItem.taskContents
        })
    }

    onKeyPressEnter(event){
        
        if(this.state.keyword.length !== 0 && event.key === 'Enter'){
            this.setState({
                input: !this.state.input
            })
            console.log("!!!!!")
            this.props.taskCallbacks.updateTaskContents(this.state.keyword, this.props.taskListNo, this.props.params.taskNo)
        } 
    }

    onChangeInput(event){
        this.setState({
            keyword:event.target.value
        })
    }

    onClickClose = () => {
        this.setState({
            input:false
        })
    }

   componentDidMount(){
       //비제어
       document.addEventListener("click", this.onClickClose, true)
   }

    render(){
        
    return (
        <div style={{display:'block'}} id= "taskSettingHeader" className="Header">
            {this.props.location.indexOf("calendar") === -1 ? <Link 
                style= {{color:'black'}}
                to = {`/nest/dashboard/${this.props.projectNo}/kanbanboard`} 
                ><i className="fas fa-times fa-1x"></i></Link> :

                <Link 
                style= {{color:'black'}}
                to = {`/nest/calendar`}><i className="fas fa-times fa-1x"></i></Link> }
            <div className="Header-list">
                {/* 업무 내용 수정 */}
                {this.state.input ? 
                    <h2>
                        <input
                            value={this.state.keyword} 
                            onKeyPress={this.onKeyPressEnter.bind(this)}
                            onChange={this.onChangeInput.bind(this)}
                            className="Header-input"
                            autoFocus></input>
                    </h2> : 
                   this.props.taskItem.taskState !== "del" && this.props.authUserRole !== 3 ? <h2 onClick={this.onClickTaskContents.bind(this)}>
                        <div className="header-list-div"><b>{this.props.taskItem.taskContents}</b></div>
                        <i className="far fa-edit Icon"></i>
                    </h2> : <h2>
                        <div className="header-list-div"><b>{this.props.taskItem.taskContents}</b></div>
                        <i className="far fa-edit Icon"></i>
                    </h2>
                } 
                <span>작성자 : {this.props.name} • &nbsp;&nbsp;&nbsp; 작성일 : {moment(this.props.date).format("YYYY.MM.DD")}</span>
            </div>
            <Navigation params = {this.props.params} projectNo={this.props.projectNo}/>
        </div>
    )
    }
}

export default Header;