import React, { Component, Fragment } from "react";
import './comment.scss';
import moment from 'moment';
import CommentContents from './CommentContents'

class CommentList extends Component {


    onClickThumsUp(commentNo){
        this.props.taskCallbacks.commentLikeUpdate(
            this.props.taskListNo, 
            this.props.taskItem.taskNo,
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
                    {this.props.taskItem.commentList.map(comment =>
                        <CommentContents 
                            key={comment.commentNo}
                            comment = {comment}
                            taskListNo = {this.props.taskListNo}
                            taskNo = {this.props.taskItem.taskNo}
                            taskCallbacks = {this.props.taskCallbacks}
                        />
                    )}
                </div>
            </div>
        )
    };
}

export default CommentList;