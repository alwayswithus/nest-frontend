import React, { Component, Fragment } from "react";
import './comment.scss';
import CommentContents from './CommentContents'
import Editor from "./Editor";
import ReactQuill from 'react-quill';
import ProfileModal from './ProfileModal';

class CommentList extends Component {

    constructor() {
        super(...arguments)
        this.state = {
            editorHtml: '', 
            theme: 'snow',
            commentList:[],
            modal:false
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

    onClickUserImg(){
        this.setState({
            modal:!this.state.modal
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
        console.log(this.state.modal)
        return (
            <>
            <div className="CommentList">
                {/* comment List */}
                <div className="media">
                    {/* comment */}
                    {this.props.taskItem.commentList.map(comment =>
                        comment.fileState === 'T' || comment.commentState === 'T' ?
                            <CommentContents 
                                onClickUserImg={this.onClickUserImg.bind(this)}
                                modal={this.state.modal}
                                authUserRole={this.props.authUserRole}
                                key={comment.commentNo}
                                comment = {comment}
                                taskListNo = {this.props.taskListNo}
                                taskNo = {this.props.taskItem.taskNo}
                                taskCallbacks = {this.props.taskCallbacks}
                            /> : null
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
                </div>
            </div>
            </>
        )
    };
}

export default CommentList;