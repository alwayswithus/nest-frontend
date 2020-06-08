import React, { Component } from 'react'
import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import moment from 'moment';
import update from "react-addons-update";
import Viewer from 'react-viewer'

const API_URL = "http://localhost:8080/nest";
const API_HEADERS = {
    "Content-Type": "application/json",
};

class EachFile extends Component {

    constructor() {
        super(...arguments)
        this.state = {
            visible: false,
            loading: false,
            rotatable: false
        }
    }

       //파일 다운로드
       downloadEmployeeData(fileNo) {
        //blob : 이미지, 사운드, 비디오와 같은 멀티미디어 데이터를 다룰 때 사용, MIME 타입을 알아내거나, 데이터를 송수신
        fetch(`${API_URL}/api/download/${fileNo}`)
            .then(response => {
                const filename = response.headers.get('Content-Disposition').split('filename=')[1];
                response.blob().then(blob => {
                    let url = window.URL.createObjectURL(blob);
                    let a = document.createElement('a');
                    a.href = url;
                    console.log(a.href)
                    a.download = filename;
                    a.click();
                });
            });
    }

    //파일 삭제하기
    onClickDeleteFile(fileNo, commentNo) {
        if (window.confirm("파일을 삭제하시겠습니까?")) {

            const fileIndex = this.state.projectFiles.findIndex((file) => file.fileNo === fileNo);
    
            fetch(`${API_URL}/api/comment/${commentNo}/${fileNo}`, {
            method: "delete"
            })
            .then(response => response.json())
            .then(json => {
                let newFileList = update(this.state.projectFiles, {
                    $splice: [[fileIndex, 1]],
                });

                this.setState({
                    projectFiles:newFileList
                })
            })
        }
    }
       //이미지 뷰어
       onClickImage() {
        this.setState({
            visible: !this.state.visible
        })
    }
    render() {
        
        return (
            <tr className="file-contents" key={this.props.projectFile.fileNo}>
                <td>
                    <div className="file-name-cell">
                        <div className="file-name-cell-image">
                            <img className="file-image" src={`${API_URL}${this.props.projectFile.filePath}`} onClick={this.onClickImage.bind(this)} />
                            {this.props.projectFile.originName}
                        </div>
                        {/* 이미지 미리보기 */}
                        <Viewer
                            visible={this.state.visible}
                            onClose={() => this.setState({ visible: false })}
                            downloadable='true'
                            rotatable={this.state.rotatable}
                            images={[{ src: API_URL + this.props.projectFile.filePath }]} />

                        <div className="file-name-and-path">
                            <span className="file-name">{this.props.projectFile.fileName}</span>
                        </div>
                    </div>
                </td>
                <td style={{ paddingTop: "23px" }}>
                    <Link
                        style={{ color: 'black', textDecoration: 'none' }}
                        to={`/nest/dashboard/${this.props.projectNo}/kanbanboard/${this.props.projectFile.tasklistNo}/task/${this.props.projectFile.taskNo}/file`}>
                        <div className="file-image-location" data-tip="프로젝트로 가기" data-place="bottom" 
                             style={{whiteSpace: 'nowrap',
                                    width: '50%',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'}}>
                            {this.props.projectFile.tasklistName} > {this.props.projectFile.taskContents}
                        </div>
                        <ReactTooltip />
                    </Link>
                </td>
                <td style={{ paddingTop: "23px" }}>{moment(this.props.projectFile.fileRegdate).format("MM월 DD일 hh:mm")}</td>
                <td style={{ paddingTop: "17px" }}>
                    <div className="share-person">
                        {this.props.projectFile.userName}
                    </div>
                    <div className="contents-dropdown">
                        <div className="dropdown">
                            <button className="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">
                                <i className="fas fa-ellipsis-v"></i>
                            </button>
                            <ul className="dropdown-menu">
                                <li><a href="#" onClick={this.downloadEmployeeData.bind(this, this.props.projectFile.fileNo)}>다운로드</a></li>
                                <li><a href="#" onClick={this.onClickDeleteFile.bind(this, this.props.projectFile.fileNo, this.props.projectFile.commentNo)}>삭제</a></li>
                            </ul>
                        </div>
                    </div>
                </td>
            </tr>
        )
    }
}

export default EachFile;