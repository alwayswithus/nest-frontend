import React, { Component, Fragment,useState } from "react";
import TextareaAutoSize from 'react-textarea-autosize';

const CommentInput = () => {

    return (
        <div className = "Comment-input">
            <form>
                <div className="InputForm">
                    <TextareaAutoSize
                        minRows={3}
                        maxRows={6}
                        placeholder="보낼 메시지를 입력하세요"/>
                </div>
            </form>
            <div className="Bottom-bar">
                <button className="pull-right" type="submit">보내기</button>
                <ul className="list-unstyled list-inline media-detail pull-left">
                    <li><a href=""><i class="fas fa-paperclip"></i></a></li>
                    <li><a href="">@</a></li>
                    <li><a href=""><i class="far fa-smile-beam"></i></a></li>
                </ul>
            </div>
        </div>
    );
}

export default CommentInput;
