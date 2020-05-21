import React, {Component} from 'react'
import './TagModal.scss';
import tagData from './tagData.json';
import SettingTag from './SettingTag';

class TagModal extends Component {
    constructor() {
        super(...arguments)

        this.state = {
            tags:tagData,
        }
    }

    render(){
        return (
            <div className="container card-member" style={ { position:'absolute', left:'0', top:'0' } }>
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
                            {this.state.tags.map(tag =>
                                <> 
                                    <SettingTag 
                                        key={tag.tagNo}
                                        taskCallbacks={this.props.taskCallbacks}
                                        tagParams={{
                                            tagNo: tag.tagNo,
                                            tagName: tag.tagName,
                                            taskListNo: this.props.taskListNo,
                                            taskNo: this.props.taskNo 
                                        }}/>
                                    {/* <li>
                                        <input 
                                            onClick = {(e) => this.onCheckBox(e, tag.tagNo, tag.tagName)} 
                                            type="checkbox" 
                                            className="tagCheck"
                                            ></input>
                                        <div className="tag" key={tag.tagNo}>{tag.tagName}</div> 
                                    </li> */}
                                </> )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default TagModal;