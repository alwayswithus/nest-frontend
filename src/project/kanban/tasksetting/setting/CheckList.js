import React, { Component } from 'react';
import './Setting.scss'
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
        }
    }

    onInputChange(event){
        this.setState({
            keyword:event.target.value
        })
        console.log(this.state.keyword)

    }

    render() {
        const todo = this.props.todo;
        return (
            <>
                {this.state.click ? 
                    <li key={todo.id} onClick = {this.onClickText.bind(this)}>{this.state.keyword} <i class="fas fa-pen fa-1x" /></li> :
                    <input type="text" key={todo.id} value={this.state.keyword} onChange={this.onInputChange.bind(this)} onKeyPress={this.onEnter.bind(this)}></input> }
            </>
            )
        }
    }
export default CheckList;