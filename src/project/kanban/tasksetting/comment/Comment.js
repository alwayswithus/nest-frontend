import React, { Component, Fragment } from "react";
import CommentList from './CommentList'
import CommentInput from "./CommentInput";
import Header from '../file/Header';
import {Link} from 'react-router-dom';

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
            <>
            <div className = "tasksetting-commnet">
            
            <div className="TaskSetComment">
                {taskItem.taskState === "del" ? 
                    <div className="task-delete"> 
                        <div className ="task-delete-warning">
                        <span>삭제된 업무입니다.</span>
                            <Link style= {{color:'black', textDecoration:'none'}} to = {`/nest/dashboard/${this.props.projectNo}/kanbanboard`} >
                                <div className="setting-close">닫기</div>
                            </Link>
                        </div>
                    </div> : null }
                    <div style={{float:'right'}}>
                        <Header
                            location={this.props.match.url}
                            authUserRole={this.props.authUserRole}
                            name={taskItem.userName}
                            date={taskItem.taskRegdate}
                            taskItem={taskItem}
                            taskCallbacks={this.props.taskCallbacks}
                            params={this.props.match.params}
                            projectNo={this.props.projectNo}
                            taskListNo = {taskListNo} />
                    </div>
                    <div className="Comment">
                        {/* 코멘트 내용 */}
                        <CommentList
                            authUserRole={this.props.authUserRole}
                            taskListNo={taskListNo}
                            taskNo={this.props.match.params.taskNo}
                            taskItem={taskItem}
                            taskCallbacks={this.props.taskCallbacks} />
                    </div>
                </div>
            </div>
            
            </>
        );
    }
}

export default Comment;
