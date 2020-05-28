import React, { Component, Fragment } from "react";
import './comment.scss';
import moment from 'moment';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';

class commentContents extends Component {

    constructor() {
        super(...arguments)

        this.state = {
            change:false,
            keyword: this.props.comment.commentContents
        }
    }

    //공감하기 클릭
    onClickThumsUp(commentNo){
        this.props.taskCallbacks.commentLikeUpdate(
            this.props.taskListNo, 
            this.props.taskNo,
            commentNo );
    }

    //수정하기 클릭
    onClickModifyText() {
        this.setState({
            change: !this.state.change
        })
    }

    //comment 내용 변경
    onChangeContents(event){
        console.log("CommentContents : " + event.target.value)
        this.setState({
            keyword:event.target.value
        })
    }

    //comment 작성 후 enter
    onKeyPressEnter(event) {
        console.log("CommentContents + " + event.target.value)
        if(event.key === 'Enter'){ 
            event.preventDefault()
            this.setState({
                change:!this.state.change,
                keyword:event.target.value
            })
            this.props.taskCallbacks.commentContentsUpdate(this.props.taskListNo, this.props.taskNo, this.props.comment.commentNo,event.target.value)
        }
    }
    render(){
        return (
            <Fragment>
                <div key = {this.props.comment.commentNo} style={{height:'20px'}}/>
                        <a className="pull-left" href="#"><img className="img-circle" src={this.props.comment.memberPhoto} alt="" /></a>
                        <div className="media-body">
                            <span className="media-heading"><b>{this.props.comment.memberName}</b></span>
                            <span className="media-heading">{moment(this.props.comment.commentRegdate).format('YYYY-MM-DD hh:mm:ss')}</span>
                            <ul className="list-unstyled list-inline media-detail pull-right">
                                <li>
                                    <span data-tooltip-text="공감하기">
                                        <i onClick = {this.onClickThumsUp.bind(this, this.props.comment.commentNo)} className="far fa-thumbs-up thumsup"/>
                                    </span>
                                </li>
                                <li>
                                    <span data-tooltip-text="수정하기">
                                        <i onClick= {this.onClickModifyText.bind(this)} className="fas fa-pen" />
                                    </span>
                                </li>
        
                                <li>
                                    <span data-tooltip-text="삭제하기">
                                        <i className="far fa-trash-alt" />
                                    </span>
                                </li>
                            </ul>
                        {this.state.change ? 
                            <p>
                                <input type="text"
                                       value = {this.state.keyword} 
                                       onKeyPress={this.onKeyPressEnter.bind(this)} 
                                       onChange={this.onChangeContents.bind(this)} 
                                       placeholder={this.props.comment.commentContents} >
                                </input>
                            </p> : 
                                <ReactQuill 
                                theme = "bubble"
                                value= {this.props.comment.commentContents}
                                readOnly
                               />
                        }
                    <ul className="list-unstyled list-inline media-detail pull-left">
                        {this.props.comment.commentLike === '0' ? null : <li><i className="fa fa-thumbs-up"></i>&nbsp;{this.props.comment.commentLike}</li> }
                    </ul>
                </div>
            </Fragment>
        )
    };
}

export default commentContents;