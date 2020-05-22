import React, { Component, Fragment } from "react";
import './comment.scss';
import moment from 'moment';
import CommentContents from './CommentContents'

class CommentList extends Component {


    onClickThumsUp(commentNo){
        this.props.taskCallbacks.commentLikeUpdate(
            this.props.taskListNo, 
            this.props.taskItem.no,
            commentNo );
    }

    onClickModifyText() {
        this.setState({
            change: !this.state.change
        })
    }
    render(){
        return (
            <div className="CommentList">
                {/* comment List */}
                <div className="media">
                    {/* comment */}
                    {this.props.taskItem.comments.map(comment =>
                        <CommentContents 
                            comment = {comment}
                            taskListNo = {this.props.taskListNo}
                            taskNo = {this.props.taskItem.no}
                            taskCallbacks = {this.props.taskCallbacks}
                        />
                    )}
                </div>
            </div>
        )
    };
}

export default CommentList;