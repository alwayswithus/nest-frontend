import React, { Component, Fragment } from "react";
import CommentList from './CommentList'
import CommentInput from "./CommentInput";
import Header from '../file/Header';

class Comment extends Component  {
    render(){
        return (
            <div className="TaskSetComment">
                <Header />
                <div className="Comment">
                    {/* 코멘트 내용 */}
                    <CommentList />
    
                    {/* 코멘트 입력창 */}
                    <CommentInput />
                </div>
            </div>
        );
    }
}

export default Comment;
