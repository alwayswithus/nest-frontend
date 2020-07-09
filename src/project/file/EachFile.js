import React, { Component } from 'react'
import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import moment from 'moment';
import update from "react-addons-update";
import Viewer from 'react-viewer'

const API_URL = "http://192.168.1.223:8080/nest";
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
        this.props.onClickDeleteFile(fileNo, commentNo)
    }

    //이미지 뷰어
    onClickImage() {
        this.setState({
            visible: !this.state.visible
        })
    }

    //파일클릭
    onClickFile(fileNo) {
        if (window.confirm("파일을 다운로드 하시겠습니까?")) {
            this.downloadEmployeeData(fileNo)
        }
    }

    render() {
        return (
            <tr className="file-contents" key={this.props.projectFile.fileNo} style={{width: "50%"}}>
                    <td style={{width:"50%"}}>
                        <div className="file-name-cell">
                            <div className="file-name-cell-image">
                            {this.props.projectFile.originName.split('.')[1] === 'csv' || this.props.projectFile.originName.split('.')[1] === 'xlxs' ?
                            <img src='/nest/assets/images/excel.png' alt={this.props.projectFile.originName} onClick={this.onClickFile.bind(this, this.props.projectFile.fileNo)}></img> :
                            <>{this.props.projectFile.originName.split('.')[1] === 'txt' ?
                                <img 
                                    src='/nest/assets/images/txt.png'
                                    alt={this.props.projectFile.originName}
                                    onClick={this.onClickFile.bind(this, this.props.projectFile.fileNo)}></img>
                                :
                                <>{this.props.projectFile.originName.split('.')[1] === 'png' || this.props.projectFile.originName.split('.')[1] === 'jpg' ?
                                    <img 
                                        src={`${API_URL}${this.props.projectFile.filePath}`}
                                        alt={this.props.projectFile.originName}
                                        onClick={this.onClickImage.bind(this)}></img> :
                                    <img src='/nest/assets/images/attach.png' alt={this.props.projectFile.originName} onClick={this.onClickFile.bind(this, this.props.projectFile.fileNo)}></img>
                                }</>
                            }</>
                        }
                            </div>
                                {/* <div className="file-originname">{this.props.projectFile.originName}</div> */}
                            <div className="file-name-and-path">
                                <span className="file-name">{this.props.projectFile.originName}</span>
                            </div>
                            {/* 이미지 미리보기 */}
                            <Viewer
                                visible={this.state.visible}
                                onClose={() => this.setState({ visible: false })}
                                downloadable='true'
                                rotatable={this.state.rotatable}
                                images={[{ src: API_URL + this.props.projectFile.filePath }]} />

                        </div>
                    </td>
                    <td>
                    <div>
                        <Link
                            style={{ color: 'black', textDecoration: 'none' }}
                            to={`/nest/dashboard/${this.props.projectNo}/kanbanboard/task/${this.props.projectFile.taskNo}/file`}>
                            <div className="file-image-location" data-tip="프로젝트로 가기" data-place="bottom" style={{display:"flex"}}>
                            {this.props.projectFile.tasklistName}&nbsp;<i style={{color: "#55c3cf", alignItems: "center", paddingTop:"2px"}} class="fas fa-caret-right"></i>&nbsp;{this.props.projectFile.taskContents}
                            </div>
                            <ReactTooltip />
                        </Link>
                        </div>
                    </td>
                    <td>
                    <div>{moment(this.props.projectFile.fileRegdate).format("MM월 DD일 hh:mm")}
                        </div>
                        </td>
                    <td>
                    <div className="share">
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
                                    {this.props.projectFile.userNo == sessionStorage.getItem("authUserNo") ? 
                                        <li><a href="#" onClick={this.onClickDeleteFile.bind(this, this.props.projectFile.fileNo, this.props.projectFile.commentNo)}>삭제</a></li>
                                        : null}
                                </ul>
                            </div>
                        </div>
                        </div>
                    </td>
            </tr>
        )
    }
}

export default EachFile;