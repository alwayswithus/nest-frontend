import React, { Component, Fragment } from "react";
import CommentList from './CommentList'
import CommentInput from "./CommentInput";
import Header from '../file/Header';

class Comment extends Component  {
    render(){
        console.log(this.props.match)
        const taskList = this.props.task;
        const taskListIndex = taskList.findIndex(taskList => taskList.taskListNo == this.props.match.params.taskListNo);
        const taskIndex = taskList[taskListIndex].tasks.findIndex(task => task.taskNo == this.props.match.params.taskNo);
        const taskItem = taskList[taskListIndex].tasks[taskIndex]
        return (
            <div className="TaskSetComment">
                 <Header 
                    name='김우경' 
                    date='2020.05.06' 
                    taskContents = {taskItem.taskContents}
                    params={this.props.match.params}/>
                <div className="Comment">
                    {/* 코멘트 내용 */}
                    <CommentList 
                        taskListNo={this.props.match.params.taskListNo} 
                        taskItem={taskItem} 
                        taskCallbacks={this.props.taskCallbacks}/>
    
                    {/* 코멘트 입력창 */}
                    <CommentInput 
                        taskCallbacks = {this.props.taskCallbacks}
                        taskItem = {taskItem}
                        taskListNo = {this.props.match.params.taskListNo}/>
                </div>
            </div>
        );
    }
}

export default Comment;
