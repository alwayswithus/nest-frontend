import React, { Component, Fragment } from "react";
import './comment.scss';
import CommentContents from './CommentContents'
import Editor from "./Editor";
import ReactQuill from 'react-quill';

import SockJsClient from "react-stomp";

class CommentList extends Component {

    constructor() {
        super(...arguments)
        this.state = {
            editorHtml: '', 
            theme: 'snow',
            commentList:[],
        }
        this.handleChange = this.handleChange.bind(this)
    }

    onClickThumsUp(commentNo){
        this.props.taskCallbacks.commentLikeUpdate(
            this.props.taskListNo, 
            this.props.taskItem.taskNo,
            commentNo );
    }

    onClickModifyText() {
        this.setState({
            change: !this.state.change
        })
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

    handleChange (html) {
        
        this.setState({ 
           editorHtml: html ,
        });
    }

    componentDidMount(){
        window.jQuery(document.getElementsByClassName("media")).scrollTop(1000000000000000000000);
    
    }
    componentDidUpdate(){
        window.jQuery(document.getElementsByClassName("media")).scrollTop(1000000000000000000000);
    }

    render(){
        return (
            <>
            <div className="CommentList">
                {/* comment List */}
                <div className="media">
                    {/* comment */}
                    {this.props.taskItem.commentList.map(comment =>
                        <CommentContents 
                            authUserRole={this.props.authUserRole}
                            key={comment.commentNo}
                            comment = {comment}
                            taskListNo = {this.props.taskListNo}
                            taskNo = {this.props.taskItem.taskNo}
                            taskCallbacks = {this.props.taskCallbacks}
                        />
                    )}
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
                                placeholder={this.props.placeholder}
                                style={{ height: '80px' }}
                            />
                        </div>
                    </div>
                </form>
                <div className="Bottom-bar">
                    {this.props.authUserRole === 3 ? 
                        <button 
                            style={{backgroundColor:'#CCCCCC'}}
                            className="pull-right" 
                            type="submit"
                            disabled='true'>보내기</button> :

                        <button 
                            onClick={this.onClickSubmit.bind(this)} 
                            className="pull-right" 
                            type="submit">보내기</button>

                    }
                    <ul className="list-unstyled list-inline media-detail pull-left">
                        <li><a href="#"><i className="fas fa-paperclip"></i></a></li>
                        <li style={{ verticalAlign: 'text-bottom' }}><a href="#"><b>@</b></a></li>
                        <li><a href="#"><i className="far fa-smile-beam"></i></a></li>
                    </ul>
                </div>
            </div>
            </>
        )
    };
}

export default CommentList;