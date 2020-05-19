import React, { Component, Fragment } from "react";
import './comment.scss';

const CommentList = () => {
    return (
        <div className="CommentList">
            <div className="media">
                <a class="pull-left" href="#"><img class="img-circle" src="/images/unnamed.jpg" alt="" /></a>
                {/* 코멘트 내용 시작 - 1 */}
                <div className="media-body">
                    <span className="media-heading"><b>이름</b></span>
                    <span className="media-heading">2분전</span>
                    <ul className="list-unstyled list-inline media-detail pull-right">
                    <li class="">
                            <span data-tooltip-text="공감하기">
                                <i class="far fa-thumbs-up thumsup"/>
                            </span>
                        </li>
                        <li class="">
                            <span data-tooltip-text="수정하기">
                                <i class="fas fa-pen" />
                            </span>
                        </li>

                        <li class="">
                            <span data-tooltip-text="삭제하기">
                                <i class="far fa-trash-alt" />
                            </span>
                        </li>
                    </ul>
                    <p>
                        vvvvvvcccccccccccccccccccccccccccccccccccccccccccccccccccd<br/>
                        vvvvvv<br/>
                        vvvvvv<br/>
                        vvvvvv<br/>
                    </p>
                    <ul className="list-unstyled list-inline media-detail pull-left">
                        <li><i class="fa fa-thumbs-up"></i>13</li>
                    </ul>
                </div>
            </div>
            {/* 코멘트 내용 시작 - 2*/}
            <div className="media">
                <a class="pull-left" href="#"><img class="img-circle" src="/images/unnamed.jpg" alt="" /></a>
                <div className="media-body">
                    <span className="media-heading"><b>이름</b></span>
                    <span className="media-heading">2분전</span>
                    <ul className="list-unstyled list-inline media-detail pull-right">
                        <li class="">
                            <span data-tooltip-text="공감하기">
                                <i class="far fa-thumbs-up thumsup"/>
                            </span>
                        </li>
                        <li class="">
                            <span data-tooltip-text="수정하기">
                                <i class="fas fa-pen" />
                            </span>
                        </li>

                        <li class="">
                            <span data-tooltip-text="삭제하기">
                                <i class="far fa-trash-alt" />
                            </span>
                        </li>
                    </ul>
                    <p>
                        vvvvvvcccccccccccccccccccccccccccccccccccccccccccccccccccd<br/>
                        vvvvvv<br/>
                        vvvvvv<br/>
                        vvvvvv<br/>
                    </p>
                    <ul className="list-unstyled list-inline media-detail pull-left">
                        <li><i class="fa fa-thumbs-up"></i>13</li>
                    </ul>
                </div>
            </div>
            <div className="media">
                <a class="pull-left" href="#"><img class="img-circle" src="/images/unnamed.jpg" alt="" /></a>
                <div className="media-body">
                    <span className="media-heading"><b>이름</b></span>
                    <span className="media-heading">2분전</span>
                    <ul className="list-unstyled list-inline media-detail pull-right">
                    <li class="">
                            <span data-tooltip-text="공감하기">
                                <i class="far fa-thumbs-up thumsup"/>
                            </span>
                        </li>
                        <li class="">
                            <span data-tooltip-text="수정하기">
                                <i class="fas fa-pen" />
                            </span>
                        </li>

                        <li class="">
                            <span data-tooltip-text="삭제하기">
                                <i class="far fa-trash-alt" />
                            </span>
                        </li>
                    </ul>
                    <p>
                        vvvvvvcccccccccccccccccccccccccccccccccccccccccccccccccccd<br/>
                        vvvvvv<br/>
                        vvvvvv<br/>
                        vvvvvv<br/>
                    </p>
                    <ul className="list-unstyled list-inline media-detail pull-left">
                        <li><i class="fa fa-thumbs-up"></i>13</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default CommentList;