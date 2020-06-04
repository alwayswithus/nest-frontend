import React, { Component, Fragment, useState } from "react";
import Editor from "./Editor";
// import 'react-quill/dist/quill.snow.css';
import './CommentInput.scss'
import ReactQuill from 'react-quill';
import PropTypes from 'prop-types';

class CommentInput extends Component {
    constructor() {
        super(...arguments)
        this.state = {
            editorHtml: '', 
            theme: 'snow' 
        }
        this.handleChange = this.handleChange.bind(this)
    }

    //보내기 버튼을 눌렀을 때 코멘트 생성
    onClickSubmit() {
        this.props.taskCallbacks.addComment(
            null,
            this.props.taskListNo,
            this.props.taskItem.taskNo,
            this.state.editorHtml
        )

        this.setState({
            editorHtml: ''
        })
    }

    handleChange (html) {
        this.setState({ editorHtml: html });
    }

    render() {
        return (
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
        );
    }
}

CommentInput.modules = {
    toolbar: [
      [{size: []}],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, 
       {'indent': '-1'}, {'indent': '+1'}],
      ['image']
    ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    }
  }
  /* 
   * Quill editor formats
   * See https://quilljs.com/docs/formats/
   */
  CommentInput.formats = [
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'image'
  ]
  
  /* 
   * PropType validation
   */
  CommentInput.propTypes = {
    placeholder: PropTypes.string,
  }

export default CommentInput;
