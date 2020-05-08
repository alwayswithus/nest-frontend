import React, { Component, Fragment } from "react";
import CommentList from './CommentList'
const Comment = () => {
    return (
        <div>
            <CommentList />
            <br />
            <br />
            <br />
            <input placeholder="채팅을 입력하세요"/>
            <button>전송</button>
        </div>
    );
}

export default Comment;
