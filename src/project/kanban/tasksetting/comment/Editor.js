import React, {Component} from 'react'
import ReactQuill from 'react-quill';
import PropTypes from 'prop-types';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import 'react-quill/dist/quill.core.css';

class Editor extends Component {
    constructor (props) {
      super(props)
      this.state = { editorHtml: '', theme: 'snow' }
      this.handleChange = this.handleChange.bind(this)
    }
    
    handleChange (html) {
        // this.setState({ editorHtml: html });
        console.log("Editor: " + html)
        this.props.onSetStateContents(html)
        this.props.onClickSubmit(this.state.editorHtml)
    }

    // onKeyPressEditor(event){
    //   if(event.shiftKey === true){
    //     console.log("Editor"+event.key)
        
    //   }
    // }

    render () {
      console.log("Editor Render()" + this.props.contents)
      return (
        <div>
          <ReactQuill 
            theme={this.state.theme}
            onChange={this.handleChange.bind(this)}
            value={this.props.contents}
            modules={Editor.modules}
            formats={Editor.formats}
            bounds={'.app'}
            placeholder={this.props.placeholder}
            style={{height:'80px'}}
           />
         </div>
       )
    }
  }
  
  /* 
   * Quill modules to attach to editor
   * See https://quilljs.com/docs/modules/ for complete options
   */
  Editor.modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, ],
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
  Editor.formats = [
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'image'
  ]
  
  /* 
   * PropType validation
   */
  Editor.propTypes = {
    placeholder: PropTypes.string,
  }

  export default Editor;