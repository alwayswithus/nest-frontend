import React, { Component } from 'react';
import './CheckList.scss'
class CheckList extends Component {

    constructor (){
        super(...arguments)
        this.state ={
            click:true,
            keyword:this.props.checklist.checklistContents
        }
    }

    onClickText() {
        this.setState({
            click:!this.state.click
        })
    }

    // checklist content update
    onEnter(event) {
        if(event.key === 'Enter'){
            this.setState({
                click:!this.state.click
            })
            this.props.taskCallbacks.checklistContentsUpdate(this.props.taskListNo, this.props.params.taskNo, this.props.checklist.checklistNo, event.target.value)
        }
    }

    onInputChange(event){
        this.setState({
            keyword:event.target.value
        })
    }

    render() {
        const checklist = this.props.checklist;
        return (
            <ul className="CheckList">
                {this.props.params.authUserRole === 3 ? 
                    <li style={{margin:'2% 0 0 0', cursor:'default'}} key={checklist.checklistNo}>
                        {checklist.checklistState === "done" ? <del>{this.state.keyword}</del> :  this.state.keyword }
                        <i className="fas fa-pen fa-1x" />
                    </li> : 
                    <>
                    {this.state.click ? 
                        <>
                            <li style={{margin:'2% 0 0 0'}} key={checklist.checklistNo} onClick = {this.onClickText.bind(this)}>
                                {checklist.checklistState === "done" ? <del>{this.state.keyword}</del> :  this.state.keyword }
                                <i className="fas fa-pen fa-1x" />
                            </li>
                        </> :
                        <input 
                            type="text" 
                            key={checklist.checklistNo} 
                            value={this.state.keyword} 
                            onChange={this.onInputChange.bind(this)} 
                            onKeyPress={this.onEnter.bind(this)}></input> }
                    </>}
                </ul>
            )
        }
    }
export default CheckList;