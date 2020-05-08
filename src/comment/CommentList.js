import React, { Component, Fragment } from "react";
import './comment.scss';

const CommentList = () => {
    return (
        <div className="Comment">
            <div className="profileImg">
                <img src="/images/unnamed.jpg" className="img-circle" alt="Cinque Terre" />
            </div>
            <div className="Frame">
                <div className="CommentLayout">
                    <div className="name">
                        이름
                    </div>
                    <div className="ab">
                        2 분전
                    </div>
                    <div className="button">
                        <li><button><i class="far fa-thumbs-up thumsup"></i></button></li>
                        <li><button><i class="fas fa-pen"></i></button></li>
                        <li><button><i class="far fa-trash-alt"></i></button></li>
                    </div>
                </div>
                <div className="text">
                    dfdfdfd<br/>
                    dfdfdf<br/>
                    dfdfdfd
                </div>
            </div>
        </div>
    );
}

export default CommentList;
