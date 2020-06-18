import React, { Component, Fragment } from "react";
import CommentList from './CommentList'
import CommentInput from "./CommentInput";
import Header from '../file/Header';

class Comment extends Component {

    

    render() {
        if (!this.props.task) {
            return <></>;
        }

        const taskList = this.props.task;
        let Indexs = []
        taskList.map( (taskList,taskListIndex) => 
            taskList.tasks.map((task,taskIndex) => 
                task.taskNo === this.props.match.params.taskNo
                    ?Indexs.push({taskListIndex, taskIndex})
                    :null
        ))
        const taskItem = taskList[Indexs[0].taskListIndex].tasks[Indexs[0].taskIndex]
        const taskListNo = taskList[Indexs[0].taskListIndex].taskListNo
        return (
            <div className="TaskSetComment">
                <Header
                    authUserRole={this.props.authUserRole}
                    name={taskItem.userName}
                    date={taskItem.taskRegdate}
                    taskItem={taskItem}
                    taskCallbacks={this.props.taskCallbacks}
                    params={this.props.match.params}
                    projectNo={this.props.projectNo}
                    taskListNo = {taskListNo} />
                <div className="Comment">
                    {/* 코멘트 내용 */}
                    <CommentList
                        authUserRole={this.props.authUserRole}
                        taskListNo={taskListNo}
                        taskItem={taskItem}
                        taskCallbacks={this.props.taskCallbacks} />
                </div>
            </div>
        );
    }
}

export default Comment;
