import React, { Component, Fragment } from 'react'
import './SettingTag.scss';

class SettingTag extends Component {

    constructor() {
        super(...arguments)
        this.state = {
            checked: false
        }
    }
    //checkbox를 클릭했을 때 tag를 추가하기.
    onCheckBox(event) {

        console.log(event.target.checked)
        this.setState({
            checked: event.target.checked
        })
        if (event.target.checked) {
            this.props.taskCallbacks.addtag(
                this.props.tagParams.tagNo,
                this.props.tagParams.tagName,
                this.props.tagParams.taskListNo,
                this.props.tagParams.taskNo);
        } else {
            this.props.taskCallbacks.deletetag(
                this.props.tagParams.tagNo,
                this.props.tagParams.taskListNo,
                this.props.tagParams.taskNo)
        }
    }

    //tag 삭제
    onClickTagTrash() {
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
                <li className="SettingTag" style={{ margin: '5% 0% 0% 0%' }}>
                    <input
                        onClick={this.onCheckBox.bind(this)}
                        type="checkbox"
                        className="tagCheck"
                        checked={this.state.checked}
                        readOnly
                    ></input>
                    <div className="tag">{this.props.tagParams.tagName}</div>
                    <div onClick={this.onClickTagTrash.bind(this)} className="modify"><i class="fas fa-pen-square"></i></div>
                </li>
            </Fragment>
        )
    }
}

export default SettingTag;