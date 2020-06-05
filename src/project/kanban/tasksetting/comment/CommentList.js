import React, { Component, Fragment } from "react";
import './comment.scss';
import moment from 'moment';
import CommentContents from './CommentContents'

class CommentList extends Component {

    scrollToChange = (param) => {
        console.log("!!!!!")
        const{ scrollHeight, clientHeight } = this.box;
        this.box.scrollTop = scrollHeight - clientHeight;
        // if(param === 'd') {
        //     this.box.scrollTop = scrollHeight - clientHeight;
        // } else{
        //     this.box.scrollTop = 0;
        // }
    }

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
        // const commentListLength = this.props.taskItem.commentList.length;
        
        return (
            <div className="CommentList">
                {/* comment List */}
                <div
                    ref={(ref) => {this.box=ref}}
                    className="media">
                    {/* comment */}
                    {this.props.taskItem.commentList.map(comment =>
                        <CommentContents 
                            authUserRole={this.props.authUserRole}
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