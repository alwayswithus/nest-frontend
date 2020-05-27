import React, { Component, Fragment,useState } from "react";
import Editor from "./Editor";

class CommentInput extends Component {
    constructor() {
        super(...arguments)
        this.state = {
            contents : ''
        }
    }
    onClickSubmit(){
        this.props.taskCallbacks.addComment(this.state.contents,this.props.taskListNo, this.props.taskItem.taskNo)
    }
    
    onClickSubmit2(commentContents){
        this.setState({
            contents : commentContents
        })
    }
    
    render(){
        return (
            <div className = "Comment-input">
                <form>
                    <div className="InputForm">
                        <Editor 
                            taskCallbacks = {this.props.taskCallbacks}
                            taskItem = {this.props.taskItem}
                            taskListNo = {this.props.taskListNo}
                            onClickSubmit = {this.onClickSubmit2.bind(this)}/>
                    </div>
                </form>
                <div className="Bottom-bar">
                    <button onClick={this.onClickSubmit.bind(this)} className="pull-right" type="submit">보내기</button>
                    <ul className="list-unstyled list-inline media-detail pull-left">
                        <li><a href="#"><i className="fas fa-paperclip"></i></a></li>
                        <li style={{verticalAlign: 'text-bottom'}}><a href="#"><b>@</b></a></li>
                        <li><a href="#"><i className="far fa-smile-beam"></i></a></li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default CommentInput;
