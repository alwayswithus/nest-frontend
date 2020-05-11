import React, { Component, Fragment } from "react";
import CommentList from './CommentList'
import CommentInput from "./CommentInput";
const Comment = () => {
    return (
        <div className="Comment">
            <CommentInput />
            <CommentList />
        </div>
    );
}

export default Comment;
