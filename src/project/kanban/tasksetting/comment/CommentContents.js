import React, { Component, Fragment } from "react";
// import './comment.scss';
import moment from 'moment';
import ReactQuill from 'react-quill';
import ProfileModal from './ProfileModal';

const API_URL = "http://localhost:8080/nest";

class commentContents extends Component {

    constructor() {
        super(...arguments)

        this.state = {
            change: false,
            keyword: this.props.comment.commentContents,
            modal: false
        }
    }

    //공감하기 클릭
    onClickThumsUp(commentNo) {
        this.props.taskCallbacks.commentLikeUpdate(
            this.props.taskListNo,
            this.props.taskNo,
            commentNo);
    }

    //수정하기 클릭
    onClickModifyText() {
        this.setState({
            change: !this.state.change
        })
    }

    //comment 내용 변경
    onChangeContents(event) {
        console.log("CommentContents : " + event.target.value)
        this.setState({
            keyword: event.target.value
        })
    }

    handleChange(html) {
        this.setState({ keyword: html });
    }

    // 수정 완료 버튼 누르기
    onClickUpdateComment() {
        console.log(this.state.keyword)
        this.setState({
            change: !this.state.change
        })
        this.props.taskCallbacks.commentContentsUpdate(this.props.taskListNo, this.props.taskNo, this.props.comment.commentNo, this.state.keyword)
    }

    //삭제하기 버튼 누르기
    onClickDeleteContents() {
        if (window.confirm("코멘트를 삭제하시겠습니까?")) {
            this.props.taskCallbacks.deleteComment(this.props.comment.fileNo, this.props.taskListNo, this.props.taskNo, this.props.comment.commentNo)
        }
    }

    //이미지 클릭했을 때
    onClickUserImg() {
        this.setState({
            modal: !this.state.modal
        })
    }

    ProfileModalClose(){
        this.setState({
            modal:false
        })
    }

    render() {
        const today = new Date();
        return (<></>
            // <Fragment>
            //     <div key={this.props.comment.commentNo} style={{ height: '20px' }} />
            //     <a className="pull-left" href="#">
            //         <div onClick={this.onClickUserImg.bind(this)} className="img-circle" style={{ backgroundImage: `url(${this.props.comment.userPhoto})` }} ></div>
            //     </a>
            //     <div className={(this.state.modal) ? "profile-modal" : "profile-modal-none"}>
            //         <ProfileModal
            //             onClickUserImg={this.onClickUserImg.bind(this)}
            //             comment={this.props.comment}
            //         />
            //     </div>
            //     <div className="media-body">
            //         <span className="media-heading"><b>{this.props.comment.userName}</b></span>
            //         {/* 날짜 계산하기 */}
            //         <span className="media-heading">
            //             {
            //                 moment.duration(moment(today, 'YYYY-MM-DD h:mm').diff(moment(this.props.comment.commentRegdate, 'YYYY-MM-DD h:mm'))).days() !== 0
            //                     ? `${moment.duration(moment(today, 'YYYY-MM-DD h:mm').diff(moment(this.props.comment.commentRegdate, 'YYYY-MM-DD h:mm'))).days()} 일 전`
            //                     : moment.duration(moment(today, 'YYYY-MM-DD h:mm').diff(moment(this.props.comment.commentRegdate, 'YYYY-MM-DD h:mm'))).hours() !== 0
            //                         ? `${moment.duration(moment(today, 'YYYY-MM-DD h:mm').diff(moment(this.props.comment.commentRegdate, 'YYYY-MM-DD h:mm'))).hours()} 시간 전`
            //                         : moment.duration(moment(today, 'YYYY-MM-DD h:mm').diff(moment(this.props.comment.commentRegdate, 'YYYY-MM-DD h:mm'))).minutes() !== 0
            //                             ? `${moment.duration(moment(today, 'YYYY-MM-DD h:mm').diff(moment(this.props.comment.commentRegdate, 'YYYY-MM-DD h:mm'))).minutes()} 분 전`
            //                             : `몇 초 전`
            //             }
            //         </span>
            //         {this.props.authUserRole === 3 ? null :
            //             <ul className="list-unstyled list-inline media-detail pull-right">
            //                 <li>
            //                     <span data-tooltip-text="공감하기">
            //                         <i onClick={this.onClickThumsUp.bind(this, this.props.comment.commentNo)} className="far fa-thumbs-up thumsup" />
            //                     </span>
            //                 </li>
            //                 <>{this.props.comment.fileNo === null && this.props.comment.userNo+"" === sessionStorage.getItem("authUserNo") ?
            //                     <li>
            //                         <span data-tooltip-text="수정하기">
            //                             <i onClick={this.onClickModifyText.bind(this)} className="fas fa-pen" />
            //                         </span>
            //                     </li> : null} </>
            //                 <>{this.props.comment.userNo+"" === sessionStorage.getItem("authUserNo") ?
            //                     <li>
            //                         <span data-tooltip-text="삭제하기">
            //                             <i onClick={this.onClickDeleteContents.bind(this)} className="far fa-trash-alt" />
            //                         </span>
            //                     </li> : null}</>
            //             </ul>
            //         }
            //         {this.props.comment.fileNo === null ? null :
            //             this.props.comment.originName.split('.')[1] === 'csv' || this.props.comment.originName.split('.')[1] === 'xlxs' ?
            //                 <img style={{ display: 'block', width: '150px', padding: '2% 3% 0% 3%' }} src='/assets/images/excel.png' alt={this.props.comment.originName} ></img> :
            //                     <>{this.props.comment.originName.split('.')[1] === 'txt' ?
            //                         <img style={{ display: 'block', width: '150px', padding: '2% 3% 0% 3%' }}
            //                             src='/assets/images/txt.png'
            //                             alt={this.props.comment.originName}></img> :
            //                     <>{this.props.comment.originName.split('.')[1] === 'png' || this.props.comment.originName.split('.')[1] === 'jpg' ?
            //                     <img style={{ display: 'block', width: '150px', padding: '2% 3% 0% 3%' }} src={`${API_URL}${this.props.comment.filePath}`} alt={this.props.comment.originName} ></img>
            //                     :<img style={{ display: 'block', width: '150px', padding: '2% 3% 0% 3%' }} src='/assets/images/attach.png' alt={this.props.comment.originName}></img>
            //                 }</>
            //             }</>
            //         }
                        
            //         {this.state.change ?
            //             <p style={{
            //                 border: '4px solid rgb(39, 182, 186)',
            //                 width: '485px',
            //                 background: 'white',
            //                 borderRadius: '16px'
            //             }}>
            //                 <ReactQuill
            //                     theme=''
            //                     value={this.state.keyword}
            //                     onChange={this.handleChange.bind(this)}
            //                 />
            //                 <i onClick={this.onClickUpdateComment.bind(this)} className="fas fa-paper-plane">&nbsp;수정 완료</i>
            //             </p> :
            //             <ReactQuill
            //                 theme="bubble"
            //                 value={this.props.comment.commentContents}
            //                 readOnly
            //                 autoFocus
            //             />
            //         }
            //         <ul className="list-unstyled list-inline media-detail pull-left">
            //             {this.props.comment.commentLike === 0 ? null : <li><i onClick={this.onClickThumsUp.bind(this, this.props.comment.commentNo)} className="fa fa-thumbs-up count"></i>&nbsp;{this.props.comment.commentLike}</li>}
            //         </ul>
            //     </div>
            // </Fragment>
        )
    };
}

export default commentContents;