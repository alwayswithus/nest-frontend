import React, { Component, Fragment } from 'react';
import './CheckList.scss'
class CheckList extends Component {

    constructor (){
        super(...arguments)
        this.state ={
            click:true,
            keyword:this.props.todo.text
        }
    }

    onClickText() {
        this.setState({
            click:!this.state.click
        })
    }

    onEnter(event) {
        if(event.key=='Enter'){
            this.setState({
                click:!this.state.click
            })
            this.props.taskCallbacks.todoTextUpdate(this.props.params.taskListNo, this.props.params.taskNo, this.props.todo.id, event.target.value);
        }
    }

    onInputChange(event){
        this.setState({
            keyword:event.target.value
        })
    }

    render() {
        const todo = this.props.todo;
        return (
            <div className="CheckList">
                {this.state.click ? 
                    <li style={{margin:'1% 0 0 0'}} key={todo.id} onClick = {this.onClickText.bind(this)}>
                        {todo.checked ? <del>{this.state.keyword}</del> :  this.state.keyword }
                        <i className="fas fa-pen fa-1x" />
                    </li> :
                    <input 
                        type="text" 
                        key={todo.id} 
                        value={this.state.keyword} 
                        onChange={this.onInputChange.bind(this)} 
                        onKeyPress={this.onEnter.bind(this)}></input> }
            </div>
            )
        }
    }
export default CheckList;