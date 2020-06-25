import React, { Component, Fragment } from "react";
import CommentList from './CommentList'
import CommentInput from "./CommentInput";
import Header from '../file/Header';
import {Link} from 'react-router-dom';

class Comment extends Component {

    render() {
        if(!this.props.task || this.props.task.length == 0){
            return <></>;
        }
        
        let taskList=[];
        let authUserRole = null;
        if(this.props.match.url.indexOf("calendar") !== -1){
            
            const projectIndex = this.props.task.findIndex(taskList => taskList.projectNo == this.props.match.params.projectNo)
            taskList = this.props.task[projectIndex].allTaskList
            authUserRole = this.props.task[projectIndex].authUserRole

        } else{
            taskList = this.props.task;
            authUserRole = this.props.authUserRole
        }

        let Indexs = []
        taskList.map( (taskList,taskListIndex) => 
            taskList.tasks.map((task,taskIndex) => 
                task.taskNo === this.props.match.params.taskNo
                    ?Indexs.push({taskListIndex, taskIndex})
                    :null
        ))
        const taskItem = taskList[Indexs[0].taskListIndex].tasks[Indexs[0].taskIndex]
        const taskListNo = taskList[Indexs[0].taskListIndex].taskListNo

        console.log(taskItem.taskState)
        return (
            <>
            <div className = "tasksetting-commnet">
            
            <div className="TaskSetComment">
                {taskItem.taskState === "del" ? 
                    <div className="task-delete"> 
                        <div className ="task-delete-warning">
                        <span>삭제된 업무입니다.</span>
                        {this.props.match.url.indexOf("calendar") === -1 ? 
                                <Link style= {{color:'black', textDecoration:'none'}} to = {`/nest/dashboard/${this.props.projectNo}/kanbanboard`} >
                                    <div className="setting-close">닫기</div>
                                </Link> :
                                <Link style= {{color:'black', textDecoration:'none'}} to = {`/nest/calendar`} >
                                    <div className="setting-close" onClick={this.props.taskCallbacks.onCloseSettingHTML}>닫기</div>
                                </Link>
                            }
                        </div>
                    </div> : null }
                    <div style={{float:'right'}}>
                        <Header
                            location={this.props.match.url}
                            authUserRole={authUserRole}
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
                            authUserRole={authUserRole}
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
