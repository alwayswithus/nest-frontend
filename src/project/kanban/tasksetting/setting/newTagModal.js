import React, { Component, Fragment } from 'react'
import './TagModal.scss';
import { CirclePicker } from 'react-color';

class TagModal extends Component {

    onKeyPressEnter(event){
        if(event.key == "Enter"){
            event.preventDefault();
            this.props.settingCallbacks.add(event.target.value);
            event.target.value='';
            this.props.onClicknewTagModal();
        }
    }

    render() {
        return (
            <Fragment>
            {this.props.closeTag ? 
                <div style={{display:'block'}}>
                    <div style={{position:'relative', marginLeft:'20%', right: '198px'}}></div>
                        <div className="container card-member" id="tagModal" style={{ position: 'absolute', left: '0', top: '0', display: 'block' }}>
                            <div className="card-header">
                                <h6 className='back' onClick={this.props.onClicknewTagModal}> 
                                    <i className="fas fa-chevron-left"></i>
                                </h6>
                                <h6 style={{ display: "inline-block", fontSize: "14px", fontWeight: "bold" }}> 태그 추가</h6>
                                <hr style={{ marginTop: "5px", marginBottom: "10px", borderColor: "#E3E3E3" }} />
                            </div>
                            <div className="card-body">
                                <input 
                                    type="text"
                                    onKeyPress = {this.onKeyPressEnter.bind(this)}
                                    className="form-control find-member" 
                                    placeholder="태그 추가" 
                                />
                            </div>
                            <div className="tagColorPicker">
                                <CirclePicker />
                            </div>
                        </div>
                    </div> : 
                    <div style={{display:'none'}}>
                         <div style={{position:'relative', marginLeft:'20%', right: '198px'}}></div>
                        <div className="container card-member" id="tagModal" style={{ position: 'absolute', left: '0', top: '0', display: 'block' }}>
                            <div className="card-header">
                                <h6 className='back' onClick={this.props.onClickModal}> 
                                    <i className="fas fa-chevron-left"></i>
                                </h6>
                                <h6 style={{ display: "inline-block", fontSize: "14px", fontWeight: "bold" }}> 태그 추가</h6>
                                <hr style={{ marginTop: "5px", marginBottom: "10px", borderColor: "#E3E3E3" }} />
                            </div>
                            <div className="card-body">
                                <input type="text" className="form-control find-member" placeholder="태그 추가" />
                            </div>
                            <div className="tagColorPicker">
                                <CirclePicker />
                            </div>
                        </div>
                    </div>
                    }
                
            </Fragment>
        )
    }
}

export default TagModal;