import React, { Component, Fragment } from 'react'
import './SettingTag.scss';

class SettingTag extends Component {

    //checkbox를 클릭했을 때 tag를 추가하기.
    onCheckBox() {
        this.props.taskCallbacks.addDeletetag(
            this.props.tagParams.tagNo,
            this.props.tagParams.tagName,
            this.props.tagParams.taskListNo,
            this.props.tagParams.taskNo);
    }

    //tag 삭제
    onClickTagModify() {
        this.props.settingTagCallbakcs.delete(this.props.tagParams.tagNo)
    }

    render() {
        return (
            <Fragment>
                {/* 태그편집 */}
                {/* <div style={{ display: 'block' }}>
                    <div style={{ position: 'relative', marginLeft: '20%', right: '198px' }}></div>
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
                                onKeyPress={this.onKeyPressEnter.bind(this)}
                                className="form-control find-member"
                                placeholder="태그 추가"
                            />
                        </div>
                        <div className="tagColorPicker">
                            <CirclePicker />
                        </div>
                    </div>
                </div> */}
                <li onClick={this.onCheckBox.bind(this)} className="SettingTag" style={{ margin: '5% 0% 0% 0%' }}>
                    {/* {this.props.taskTagNo&&this.props.taskTagNo.indexOf(this.props.tagParams.tagNo) !== -1 ? console.log('true') : console.log('false')} */}
                    <div className="tag">{this.props.tagParams.tagName}</div>
                    <div onClick={this.onClickTagModify.bind(this)} className="modify"><i className="fas fa-pencil-alt"></i></div>
                </li>
            </Fragment>
        )
    }
}

export default SettingTag;