import React, { Component, Fragment } from "react";
import CommentList from './CommentList'
import CommentInput from "./CommentInput";
const Comment = () => {
    return (
        <div className="Comment">
            <CommentList />
            <CommentInput />
        </div>
    );
}

export default Comment;
