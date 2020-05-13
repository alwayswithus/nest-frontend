import React, { Component, Fragment } from "react";
import CommentList from './CommentList'
import CommentInput from "./CommentInput";
import Navigation from "../tasksetting/Navigation";
const Comment = () => {
    return (
        <div className="TaskSetComment">
            <Navigation />
            <div className="Comment">
                <CommentList />
                <CommentInput />
            </div>
        </div>
    );
}

export default Comment;
