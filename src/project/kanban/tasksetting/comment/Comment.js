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
        const taskListIndex = taskList.findIndex(taskList => taskList.taskListNo === this.props.match.params.taskListNo);
        const taskIndex = taskList[taskListIndex].tasks.findIndex(task => task.taskNo === this.props.match.params.taskNo);
        const taskItem = taskList[taskListIndex].tasks[taskIndex]
        return (
            <div className="TaskSetComment">
                <Header
                    authUserRole={this.props.authUserRole}
                    name={taskItem.userName}
                    date={taskItem.taskRegdate}
                    taskItem={taskItem}
                    taskCallbacks={this.props.taskCallbacks}
                    params={this.props.match.params}
                    projectNo={this.props.projectNo} />
                <div className="Comment">
                    {/* 코멘트 내용 */}
                    <CommentList
                        authUserRole={this.props.authUserRole}
                        taskListNo={this.props.match.params.taskListNo}
                        taskItem={taskItem}
                        taskCallbacks={this.props.taskCallbacks} />
                </div>
            </div>
        );
    }
}

export default Comment;
