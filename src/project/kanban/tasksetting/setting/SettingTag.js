import React, { Component, Fragment } from 'react'
import './SettingTag.scss';
import { GithubPicker } from 'react-color';

class SettingTag extends Component {

    constructor(){
        super(...arguments)
        this.state = {
            tagKeyword:'',
            tagColor:'',
        }
    }

    // 태그 이름 수정
    onChangeTag(event){
        this.props.onChangeTag(event.target.value)
    }

    onKeyPressEnter(event){
        if(event.key === "Enter"){
            event.preventDefault();
            this.props.settingTagCallbakcs.add(event.target.value);
            event.target.value='';
            this.props.onClicknewTagModal();
        }
    }

    // 색 수정
    handleChange(color) {
        this.props.handleChange(color.hex)
    }

    //수정하기 클릭
    onClickModify(){
        this.props.settingTagCallbakcs.update(this.props.tagName, this.props.tagColor, this.props.tagNo)
    }

    //삭제하기 클릭
    onClickDelete(){
        this.props.settingTagCallbakcs.delete(this.props.tagNo)
        // if(window.confirm("모든 업무에서 해당 태그가 삭제됩니다. 그래도 삭제하시겠습니까?")){
        // }
    }
    render() {
        return (
            <Fragment>
                {/* 태그편집 */}
                {this.props.closeModifyTag ? <div className="setting-tag" style={{ display: 'block' }}>
                    <div style={{ position: 'relative', marginLeft: '20%', right: '198px' }}></div>
                    <div className="container card-member" id="tagModal" style={{ position: 'absolute', left: '0', top: '0', display: 'block' }}>
                        <div className="card-header">
                            <h6 className='back' >
                                <i onClick={this.props.onClickModifyTagModal} className="fas fa-chevron-left"></i>
                            </h6>
                            <h6 style={{ display: "inline-block", fontSize: "14px", fontWeight: "bold" }}> 태그 수정하기</h6>
                            <hr style={{ marginTop: "5px", marginBottom: "10px", borderColor: "#E3E3E3" }} />
                        </div>
                        <div className="card-body">
                            <input
                                type="text"
                                value={this.props.tagName}
                                onChange={this.onChangeTag.bind(this)}
                                className="form-control find-member"
                                placeholder={this.props.tagName}
                            />
                        </div>
                        <div className="tagColorPicker">
                            <GithubPicker
                                color={this.props.tagColor}
                                onChange={ this.handleChange.bind(this) }
                                width='214px'
                            />
                        </div>
                        <div className="setting-tag-button">
                            <div onClick={this.onClickModify.bind(this)} className="setting-tag-modify">수정하기</div>
                            <div onClick={this.onClickDelete.bind(this)} className="setting-tag-delete">삭제하기</div>
                        </div>
                    </div>
                </div> : null }
                
            </Fragment>
        )
    }
}

export default SettingTag;