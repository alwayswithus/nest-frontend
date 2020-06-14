import React, { Component, Fragment } from 'react'
import './TagModal.scss';
import { GithubPicker } from 'react-color';

class NewTagModal extends Component {
    constructor(){
        super(...arguments)
        this.state = {
            tagColor:''
        }
    }
    onKeyPressEnter(event){
        if(event.key === "Enter"){
            event.preventDefault();
            this.props.settingTagCallbakcs.add(event.target.value, this.state.tagColor);
            event.target.value='';
            this.props.onClicknewTagModal();
        }
    }

    handleChange = (color) => {
        this.setState({
            tagColor: color.hex
        })
    }

    render() {
        return (
            <Fragment>
            {this.props.closeTag ? 
                <div className="newtagmodal" style={{display:'block'}}>
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
                                <GithubPicker 
                                    width='214px'
                                    color={this.state.tagColor}
                                    onChange={ this.handleChange }
                                />
                            </div>
                        </div>
                    </div> : null
                    }
                
            </Fragment>
        )
    }
}

export default NewTagModal;