import React, { Component } from 'react'
import './DropZone.scss';

class DropZone extends Component {
  dropRef = React.createRef()
  
  state = {
    drag: false
  }

  handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }
  handleDragIn = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.dragCounter++  
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
        this.setState({drag: true})
      }
  }

  handleDragOut = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.dragCounter--
    if (this.dragCounter === 0) {
        this.setState({drag: false})
      }
  }

  handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.setState({drag: false})
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        this.props.handleDrop(e.dataTransfer.files)
        e.dataTransfer.clearData()
        this.dragCounter = 0
    }
  }

  componentDidMount() {
    this.dragCounter = 0
    let div = this.dropRef.current
    div.addEventListener('dragenter', this.handleDragIn)
    div.addEventListener('dragleave', this.handleDragOut)
    div.addEventListener('dragover', this.handleDrag)
    div.addEventListener('drop', this.handleDrop)
  }

  componentWillUnmount() {
    let div = this.dropRef.current
    div.removeEventListener('dragenter', this.handleDragIn)
    div.removeEventListener('dragleave', this.handleDragOut)
    div.removeEventListener('dragover', this.handleDrag)
    div.removeEventListener('drop', this.handleDrop)
  }
  render() {
    return (
        <div
        style={{display: 'inline-block', position: 'relative', height:'100%'}}
        ref={this.dropRef}
      >
          <div 
            className={this.state.drag ? "dragging-border" : null}
          >
            <div 
              className={this.state.drag ? "dragging-text-style" : null}
            >
              <div 
                className={this.state.drag ? "dragging-text" : "dragging-text-false"}
              ><img className="animated bounce" style={{width:'30%'}} src='/nest/assets/images/upload.png'></img>
              </div>
              <span className="dragging-text-span">파일을 업로드 하시려면 여기에 드롭해주세요</span>
            </div>
          </div>
        {this.props.children}
      </div>
    )
  }
}
export default DropZone