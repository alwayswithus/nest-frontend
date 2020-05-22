import React, { Component, Fragment } from "react";
import CommentList from './CommentList'
import CommentInput from "./CommentInput";
import Header from '../file/Header';

class Comment extends Component  {
    render(){
        const taskItem = this.props.task;
        return (
            <div className="TaskSetComment">
                <Header path={this.props.path} onCallbackSetting = {this.props.onCallbackSetting} taskContents={taskItem.contents}/>
                <div className="Comment">
                    {/* 코멘트 내용 */}
                    <CommentList 
                        taskListNo={this.props.taskListNo} 
                        taskItem={this.props.task} 
                        taskCallbacks={this.props.taskCallbacks}/>
    
                    {/* 코멘트 입력창 */}
                    <CommentInput />
                </div>
            </div>
        );
    }
}

export default Comment;
