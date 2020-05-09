import React, { Component, Fragment } from "react";
import './comment.scss';

const CommentList = () => {
    return (
        <div className="CommentList">
            <div className="media">
                <a class="pull-left" href="#"><img class="img-circle" src="/images/unnamed.jpg" alt="" /></a>
                <div className="media-body">
                    <span className="media-heading">이름</span>
                    <span className="media-heading">2분전</span>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <ul className="list-unstyled list-inline media-detail pull-left">
                        <li><i class="fa fa-calendar"></i>27/02/2014</li>
                        <li><i class="fa fa-thumbs-up"></i>13</li>
                    </ul>
                    <ul className="list-unstyled list-inline media-detail pull-right">
                        <li class=""><a href="">Like</a></li>
                        <li class=""><a href="">Reply</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default CommentList;
