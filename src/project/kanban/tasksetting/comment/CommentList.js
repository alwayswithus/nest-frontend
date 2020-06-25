import React, { Component, Fragment } from "react";
import './comment.scss';
import Editor from "./Editor";
import ReactQuill from 'react-quill';
import ProfileModal from './ProfileModal';
import moment from 'moment';

const API_URL = "http://localhost:8080/nest";
class CommentList extends Component {

    constructor() {
        super(...arguments)
        this.state = {
            editorHtml: '',
            theme: 'snow',
            commentList: [],
            keyword: '',
            modal: false,
            index: '',
            change: false,
            modifyIndex: ''
        }
        this.handleChange = this.handleChange.bind(this)
    }


    onClickUserImg(e, index) {

        if (e.target.id == this.state.index || this.state.index == "") {
            this.setState({
                modal: !this.state.modal,
                index: e.target.id
            })
        }
        if (this.state.modal == true) {
            this.setState({
                modal: !this.state.modal,
                index: ""
            })
        }
    }

    //보내기 버튼을 눌렀을 때 코멘트 생성
    onClickSubmit() {
        this.props.taskCallbacks.addComment(
            null,
            this.props.taskListNo,
            this.props.taskItem.taskNo,
            this.state.editorHtml,
        )

        this.setState({
            editorHtml: ''
        })
    }

    handleChange(html) {
        this.setState({
            editorHtml: html,
        });
    }

    //공감하기 클릭
    onClickThumsUp(commentNo) {
        this.props.taskCallbacks.commentLikeUpdate(
            this.props.taskListNo,
            this.props.taskNo,
            commentNo);
    }

    //수정하기 클릭
    onClickModifyText(index, commentContents) {
        this.setState({
            change: !this.state.change,
            modifyIndex: index,
            keyword: commentContents
        })
    }

    //comment 내용 변경
    onChangeContents(html) {
        this.setState({
            keyword: html
        })
    }

    // 수정 완료 버튼 누르기
    onClickUpdateComment(commentNo) {
        this.setState({
            change: !this.state.change
        })
        this.props.taskCallbacks.commentContentsUpdate(this.props.taskListNo, this.props.taskNo, commentNo, this.state.keyword)
    }

    //삭제하기 버튼 누르기
    onClickDeleteContents(fileNo, commentNo) {
        if (window.confirm("코멘트를 삭제하시겠습니까?")) {
            this.props.taskCallbacks.deleteComment(fileNo, this.props.taskListNo, this.props.taskNo, commentNo)
        }
    }

    componentDidMount() {
        window.jQuery(document.getElementsByClassName("media")).scrollTop(1000000000000000000000);

    }

    componentDidUpdate() {
        window.jQuery(document.getElementsByClassName("media")).scrollTop(1000000000000000000000);
    }

    render() {
        const today = new Date();
        return (
            <>
                <div className="CommentList">
                    {/* comment List */}
                    <div style={{height:'100%'}}>
                    <div className="media">
                        {/* comment */}
                        {this.props.taskItem.commentList.map((comment, index) =>
                            comment.fileState === 'T' || comment.commentState === 'T' ?

                                <div className="comment-body">
                                    <div key={comment.commentNo} style={{ height: '20px' }} />
                                    <a className="pull-left" href="#">
                                        <div onClick={(e) => this.onClickUserImg(e, index)} className="img-circle" style={{ backgroundImage: `url(${comment.userPhoto})` }} id={index}></div>
                                        <div className={(this.state.modal && index == this.state.index) ? "profile-modal" : "profile-modal-none"} >
                                            <ProfileModal
                                                onClickUserImg={this.onClickUserImg.bind(this)}
                                                commentList={this.props.taskItem.commentList}
                                                comment={comment}
                                            />
                                        </div>
                                    </a>
                                    <div className="media-body">
                                        <span className="media-heading"><b>{comment.userName}</b></span>
                                        {/* 날짜 계산하기 */}
                                        <span className="media-heading">
                                            {
                                                moment.duration(moment(today, 'YYYY-MM-DD h:mm').diff(moment(comment.commentRegdate, 'YYYY-MM-DD h:mm'))).days() !== 0
                                                    ? `${moment.duration(moment(today, 'YYYY-MM-DD h:mm').diff(moment(comment.commentRegdate, 'YYYY-MM-DD h:mm'))).days()} 일 전`
                                                    : moment.duration(moment(today, 'YYYY-MM-DD h:mm').diff(moment(comment.commentRegdate, 'YYYY-MM-DD h:mm'))).hours() !== 0
                                                        ? `${moment.duration(moment(today, 'YYYY-MM-DD h:mm').diff(moment(comment.commentRegdate, 'YYYY-MM-DD h:mm'))).hours()} 시간 전`
                                                        : moment.duration(moment(today, 'YYYY-MM-DD h:mm').diff(moment(comment.commentRegdate, 'YYYY-MM-DD h:mm'))).minutes() !== 0
                                                            ? `${moment.duration(moment(today, 'YYYY-MM-DD h:mm').diff(moment(comment.commentRegdate, 'YYYY-MM-DD h:mm'))).minutes()} 분 전`
                                                            : `몇 초 전`
                                            }
                                        </span>
                                        {this.props.taskItem.taskState == "del" || this.props.authUserRole === 3 ? null :
                                            <ul className="list-unstyled list-inline media-detail pull-right">
                                                <li>
                                                    <span data-tooltip-text="공감하기">
                                                        <i onClick={this.onClickThumsUp.bind(this, comment.commentNo)} className="far fa-thumbs-up thumsup" />
                                                    </span>
                                                </li>
                                                <>{comment.fileNo === null && comment.userNo + "" === sessionStorage.getItem("authUserNo") ?
                                                    <li>
                                                        <span data-tooltip-text="수정하기">
                                                            <i onClick={this.onClickModifyText.bind(this, index, comment.commentContents)} className="fas fa-pen" />
                                                        </span>
                                                    </li> : null} </>
                                                <>{comment.userNo + "" === sessionStorage.getItem("authUserNo") ?
                                                    <li>
                                                        <span data-tooltip-text="삭제하기">
                                                            <i onClick={this.onClickDeleteContents.bind(this, comment.fileNo, comment.commentNo)} className="far fa-trash-alt" />
                                                        </span>
                                                    </li> : null}</>
                                            </ul>
                                        }
                                        {comment.fileNo === null ? null :
                                            comment.originName.split('.')[1] === 'csv' || comment.originName.split('.')[1] === 'xlxs' ?
                                                <img style={{ display: 'block', width: '150px', padding: '2% 3% 0% 3%' }} src='/nest/assets/images/excel.png' alt={comment.originName} ></img> :
                                                <>{comment.originName.split('.')[1] === 'txt' ?
                                                    <img style={{ display: 'block', width: '150px', padding: '2% 3% 0% 3%' }}
                                                        src='/nest/assets/images/txt.png'
                                                        alt={comment.originName}></img> :
                                                    <>{comment.originName.split('.')[1] === 'png' || comment.originName.split('.')[1] === 'jpg' ?
                                                        <img style={{ display: 'block', width: '150px', padding: '2% 3% 0% 3%' }} src={`${API_URL}${comment.filePath}`} alt={comment.originName} ></img>
                                                        : <img style={{ display: 'block', width: '150px', padding: '2% 3% 0% 3%' }} src='/nest/assets/images/attach.png' alt={comment.originName}></img>
                                                    }</>
                                                }</>
                                        }

                                        {this.state.change && this.state.modifyIndex == index ?
                                            <p style={{
                                                border: '4px solid rgb(39, 182, 186)',
                                                width: '485px',
                                                background: 'white',
                                                borderRadius: '16px',
                                            }}>
                                                <ReactQuill
                                                    theme=''
                                                    value={this.state.keyword}
                                                    onChange={this.onChangeContents.bind(this)}
                                                />
                                                <i onClick={this.onClickUpdateComment.bind(this, comment.commentNo)} className="fas fa-paper-plane">&nbsp;수정 완료</i>
                                            </p> :
                                            <ReactQuill
                                                theme="bubble"
                                                value={comment.commentContents}
                                                readOnly
                                                autoFocus
                                            />
                                        }
                                        <ul className="list-unstyled list-inline media-detail pull-left">
                                            {comment.commentLike === 0 ? null : <li><i onClick={this.onClickThumsUp.bind(this, comment.commentNo)} className="fa fa-thumbs-up count"></i>&nbsp;{comment.commentLike}</li>}
                                        </ul>
                                    </div>
                                </div> : null
                        )}
                    </div>
                    </div>
                    
                </div>
                {/* 코멘트 input */}
                <div className="Comment-input">
                    <form>
                        <div className="InputForm">
                            <div>
                                <ReactQuill
                                    theme={this.state.theme}
                                    onChange={this.handleChange.bind(this)}
                                    value={this.state.editorHtml}
                                    modules={Editor.modules}
                                    formats={Editor.formats}
                                    bounds={'.app'}
                                    // placeholder={this.props.placeholder}
                                    style={{ height: '133px' }}
                                />
                            </div>
                        </div>
                    </form>
                    <div className="Bottom-bar">
                        {this.props.taskItem.taskState == "del" || this.props.authUserRole === 3 ?
                            <button
                                style={{ backgroundColor: '#CCCCCC' }}
                                className="pull-right"
                                type="submit"
                                disabled='true'>보내기</button> :

                            <button
                                onClick={this.onClickSubmit.bind(this)}
                                className="pull-right"
                                type="submit">보내기</button>

                        }
                    </div>
                </div>
            </>
        )
    };
}

export default CommentList;