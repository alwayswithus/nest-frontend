import React, { Component, Fragment } from "react";
import CommentList from './CommentList'
import CommentInput from "./CommentInput";
import Header from '../file/Header';

class Comment extends Component {
    constructor() {
        super(...arguments)
        this.state = {
            upDown: 'd'
                , value: 'To Bottom'
        }
    }
    updownChange = () => {
        if (this.state.upDown === 'd') {
            this.setState({
                upDown: 'u'
                , value: 'To Top'
            });
        } else {
            this.setState({
                upDown: 'd'
                , value: 'To Bottom'
            });
        }
    }

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
                    name='김우경'
                    date='2020.05.06'
                    taskItem={taskItem}
                    taskCallbacks={this.props.taskCallbacks}
                    params={this.props.match.params}
                    projectNo={this.props.projectNo} />
                <div className="Comment">
                    {/* 코멘트 내용 */}
                    <CommentList
                        ref={(ref) => this.CommentList = ref}
                        authUserRole={this.props.authUserRole}
                        taskListNo={this.props.match.params.taskListNo}
                        taskItem={taskItem}
                        taskCallbacks={this.props.taskCallbacks} />

                    {/* 코멘트 입력창 */}
                    <CommentInput
                        authUserRole={this.props.authUserRole}
                        taskCallbacks={this.props.taskCallbacks}
                        taskItem={taskItem}
                        taskListNo={this.props.match.params.taskListNo} />
                </div>
            </div>
        );
    }
}

export default Comment;
