import React, { Component, Fragment } from 'react'
import './TagModal.scss';
import tagData from './tagData.json';
import SettingTag from './SettingTag';
import NewTagModal from './newTagModal'

class TagModal extends Component {
 
    // 새태그 만들기 클릭
    onClickTagInsert(){
        console.log("click!!!!!!!")
        this.props.onClickModal()
        this.props.onClicknewTagModal()
    }

    render() {
        return (
            <Fragment>
                {/* 새태그 만들기 */}
                <NewTagModal 
                    closeTag = {this.props.closeTag}
                    onClicknewTagModal={this.props.onClicknewTagModal}
                    key={this.props.taskNo} 
                    taskListNo = {this.props.taskListNo}
                    taskNo = {this.props.taskNo}
                    taskItem = {this.props.taskItem}
                    tags = {this.props.tags}
                    taskCallbacks={this.props.taskCallbacks}
                    settingCallbacks = {this.props.settingCallbacks}/>

                {/* 태그 검색하기 */}
                {this.props.closeValue ? <div className="container card-member" id="tagModal" style={{ position: 'absolute', left: '0', top: '0', display:'block' }}>
                <div className="card">
                    <div className="card-header">
                        <h6 style={{ display: "inline-block", fontSize: "14px", fontWeight: "bold" }}>태그 추가</h6>
                            <button type="button" onClick={this.props.onClickModal} className="close" style={{ lineHeight: "35px" }}>&times;</button>
                        <hr style={{ marginTop: "5px", marginBottom: "10px", borderColor: "#E3E3E3" }} />
                    </div>
                    <div className="card-body">
                        <input type="text" className="form-control find-member" placeholder="태그 검색하기" />

                        {/* tagList */}
                        <div className="invite-card-tag-list">
                            <ul>
                                {this.props.tags.map(tag =>
                                    <SettingTag
                                        key={tag.tagNo}
                                        taskCallbacks={this.props.taskCallbacks}
                                        tagParams={{
                                            taskItem: this.props.taskItem,
                                            tagNo: tag.tagNo,
                                            tagName: tag.tagName,
                                            taskListNo: this.props.taskListNo,
                                            taskNo: this.props.taskNo
                                        }} />
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
                <div onClick={this.onClickTagInsert.bind(this)} className = "tagInsert">
                    <span><i className="far fa-plus-square"></i>&nbsp;&nbsp;새 태그 만들기</span>
                </div>
            </div> : <div className="container card-member" id="tagModal" style={{ position: 'absolute', left: '0', top: '0', display:'none' }}>
                <div className="card">
                    <div className="card-header">
                        <h6 style={{ display: "inline-block", fontSize: "14px", fontWeight: "bold" }}>태그 추가</h6>
                        <button type="button" onClick={this.props.onClickModal} className="close" style={{ lineHeight: "35px" }}>&times;</button>
                        <hr style={{ marginTop: "5px", marginBottom: "10px", borderColor: "#E3E3E3" }} />
                    </div>
                    <div className="card-body">
                        <input type="text" className="form-control find-member" placeholder="태그 검색하기" />

                        {/* tagList */}
                        <div className="invite-card-tag-list">
                            <ul>
                                {this.props.tags.map(tag =>
                                    <SettingTag
                                        key={tag.tagNo}
                                        taskCallbacks={this.props.taskCallbacks}
                                        tagParams={{
                                            taskItem: this.props.taskItem,
                                            tagNo: tag.tagNo,
                                            tagName: tag.tagName,
                                            taskListNo: this.props.taskListNo,
                                            taskNo: this.props.taskNo
                                        }} />
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
                <div onClick={this.onClickTagInsert.bind(this)} className = "tagInsert">
                    <span><i className="far fa-plus-square"></i>&nbsp;&nbsp;새 태그 만들기</span>
                </div>
            </div>}
        </Fragment>
        )
    }
}

export default TagModal;