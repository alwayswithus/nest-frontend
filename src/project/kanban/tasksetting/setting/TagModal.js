import React, { Component, Fragment } from 'react'
import './TagModal.scss';
import SettingTag from './SettingTag';
import NewTagModal from './newTagModal'

class TagModal extends Component {

    constructor() {
        super(...arguments)
        this.state = {
            keyword: ''
        }
    }
    // 새태그 만들기 클릭
    onClickTagInsert() {
        this.props.taskCallbacks.tagModalStateUpdate()
        this.props.onClicknewTagModal()
    }

    onChangeTagSearch(event) {
        console.log(event.target.value)
        this.setState({
            keyword: event.target.value
        })
    }

    //checkbox를 클릭했을 때 tag를 추가하기.
    onCheckBox(event, tagNo, tagName) {

        if (event.target.className === 'far fa-square') {
            this.props.taskCallbacks.addtag(
                tagNo,
                tagName,
                this.props.taskListNo,
                this.props.taskNo);
        } else {
            this.props.taskCallbacks.deletetag(
                tagNo,
                this.props.taskListNo,
                this.props.taskNo)
        }
    }

    //tag 삭제
    onClickTagModify() {
        this.props.settingTagCallbakcs.delete(this.props.tagParams.tagNo)
    }

    render() {
        return (
            <Fragment>
                {/* 새태그 만들기 */}
                <NewTagModal
                    closeTag={this.props.closeTag}
                    onClicknewTagModal={this.props.onClicknewTagModal}
                    key={this.props.taskNo}
                    taskListNo={this.props.taskListNo}
                    taskNo={this.props.taskNo}
                    taskItem={this.props.taskItem}
                    tags={this.props.tags}
                    taskCallbacks={this.props.taskCallbacks}
                    settingTagCallbakcs={this.props.settingTagCallbakcs} />

                {/* 태그 검색하기 */}
                {this.props.tagModal ? <div className="container card-member" id="tagModal" style={{ position: 'absolute', left: '0', top: '0', display: 'block' }}>
                    <div className="card">
                        <div className="card-header">
                            <h6 style={{ display: "inline-block", fontSize: "14px", fontWeight: "bold" }}>태그 추가</h6>
                            <button type="button" onClick={this.props.taskCallbacks.tagModalStateUpdate} className="close" style={{ lineHeight: "35px" }}>&times;</button>
                            <hr style={{ marginTop: "5px", marginBottom: "10px", borderColor: "#E3E3E3" }} />
                        </div>
                        <div className="card-body">
                            <input
                                onChange={this.onChangeTagSearch.bind(this)}
                                type="text"
                                className="form-control find-member"
                                placeholder="태그 검색하기" />

                            {/* tagList */}
                            <div className="invite-card-tag-list">
                                <ul>
                                    {this.props.tags && this.props.tags
                                        .filter((element) => element.tagName.indexOf(this.state.keyword) !== -1)
                                        .map(tag =>
                                            <li key={tag.tagNo} className="SettingTag" style={{ margin: '5% 0% 0% 0%' }}>
                                                {this.props.taskTagNo && this.props.taskTagNo.indexOf(tag.tagNo) !== -1 ?
                                                    <i onClick={(e) => this.onCheckBox(e, tag.tagNo, tag.tagName)} className="fas fa-check-square"></i> : <i onClick={(e) => this.onCheckBox(e, tag.tagNo, tag.tagName)} className="far fa-square"></i>
                                                }
                                                <div className="tag">{tag.tagName}</div>
                                                <div onClick={this.onClickTagModify.bind(this, tag.tagNo)} className="modify"><i className="fas fa-pencil-alt"></i></div>
                                            </li>
                                        )}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div onClick={this.onClickTagInsert.bind(this)} className="tagInsert">
                        <span><i className="far fa-plus-square"></i>&nbsp;&nbsp;새 태그 만들기</span>
                    </div>
                </div> : <div className="container card-member" id="tagModal" style={{ position: 'absolute', left: '0', top: '0', display: 'none' }}>
                        <div className="card">
                            <div className="card-header">
                                <h6 style={{ display: "inline-block", fontSize: "14px", fontWeight: "bold" }}>태그 추가</h6>
                                <button type="button" onClick={this.props.onClickTag} className="close" style={{ lineHeight: "35px" }}>&times;</button>
                                <hr style={{ marginTop: "5px", marginBottom: "10px", borderColor: "#E3E3E3" }} />
                            </div>
                            <div className="card-body">
                                <input
                                    onChange={this.onChangeTagSearch.bind(this)}
                                    type="text"
                                    className="form-control find-member"
                                    placeholder="태그 검색하기" />

                                {/* tagList */}
                                <div className="invite-card-tag-list">
                                    <ul>
                                        {this.props.tags && this.props.tags
                                            .filter((element) => element.tagName.indexOf(this.state.keyword) !== -1)
                                            .map(tag =>
                                                <li key={tag.tagNo} className="SettingTag" style={{ margin: '5% 0% 0% 0%' }}>
                                                    {this.props.taskTagNo && this.props.taskTagNo.indexOf(tag.tagNo) !== -1 ?
                                                        <i onClick={(e) => this.onCheckBox(e, tag.tagNo, tag.tagName)} className="fas fa-check-square"></i> : <i onClick={(e) => this.onCheckBox(e, tag.tagNo, tag.tagName)} className="far fa-square"></i>
                                                    }
                                                    <div className="tag">{tag.tagName}</div>
                                                    <div onClick={this.onClickTagModify.bind(this, tag.tagNo)} className="modify"><i className="fas fa-pencil-alt"></i></div>
                                                </li>
                                            )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div onClick={this.onClickTagInsert.bind(this)} className="tagInsert">
                            <span><i className="far fa-plus-square"></i>&nbsp;&nbsp;새 태그 만들기</span>
                        </div>
                    </div>}
            </Fragment>
        )
    }
}

export default TagModal;