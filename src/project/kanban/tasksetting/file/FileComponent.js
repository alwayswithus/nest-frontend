import React, { Component } from 'react'
import Viewer from 'react-viewer'
import moment from 'moment';

const API_URL = "http://localhost:8080/nest";

class FileComponent extends Component {

    constructor() {
        super(...arguments)
        this.state = {
            visible: false,
            loading: false,
            rotatable: false
        }
    }

    componentDidMount() {
        this.setState({
            loading: true
        });


    }

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
            this.props.taskCallbacks.deleteComment(fileNo, this.props.taskListNo, this.props.taskNo, commentNo);
        }
    }

    onClickImage() {
        this.setState({
            visible: !this.state.visible
        })
    }

    onClickFile(fileNo) {
        if (window.confirm("파일을 다운로드 하시겠습니까?")) {
            this.downloadEmployeeData(fileNo)
        }
    }

    render() {
        return (
            <>
                <tr key={this.props.file.fileNo} className="FileList-tr">
                    <td>
                        {this.props.file.originName.split('.')[1] === 'csv' || this.props.file.originName.split('.')[1] === 'xlxs' ?
                            <img style={{ width: '50px', paddingRight: '3%', paddingBottom: '1%' }} src='/nest/assets/images/excel.png' alt={this.props.file.originName} onClick={this.onClickFile.bind(this, this.props.file.fileNo)}></img> :
                            <>{this.props.file.originName.split('.')[1] === 'txt' ?
                                <img style={{ width: '50px', paddingRight: '3%', paddingBottom: '1%' }}
                                    src='/nest/assets/images/txt.png'
                                    alt={this.props.file.originName}
                                    onClick={this.onClickFile.bind(this, this.props.file.fileNo)}></img>
                                :
                                <>{this.props.file.originName.split('.')[1] === 'png' || this.props.file.originName.split('.')[1] === 'jpg' ?
                                    <img style={{ width: '50px', paddingRight: '3%', paddingBottom: '1%' }}
                                        src={`${API_URL}${this.props.file.filePath}`}
                                        alt={this.props.file.originName}
                                        onClick={this.onClickImage.bind(this)}></img> :
                                    <img style={{ width: '50px', paddingRight: '3%', paddingBottom: '1%' }} src='/nest/assets/images/attach.png' alt={this.props.file.originName} onClick={this.onClickFile.bind(this, this.props.file.fileNo)}></img>
                                }</>
                            }</>
                        }
                        <div className="filelist-orginName">{this.props.file.originName}</div></td>
                    <td>{moment(this.props.file.fileRegDate).format('YYYY년 MM월 DD일')}</td>
                    <td>{this.props.file.userName}</td>
                    <li>
                        <div className="contents-dropdown">
                            {this.props.taskItem.taskState == "del" || this.props.authUserRole === 3 ? null : 
                            <div className="dropdown">
                                <button className="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">
                                    <i className="fas fa-ellipsis-v"></i>
                                </button>
                                    <ul className="dropdown-menu">
                                        <li><a href="#" onClick={this.downloadEmployeeData.bind(this, this.props.file.fileNo)}>다운로드</a></li>

                                        {this.props.file.userNo == sessionStorage.getItem("authUserNo") ? 
                                            <li><a href="#" onClick={this.onClickDeleteFile.bind(this, this.props.file.fileNo, this.props.file.commentNo)} style={{ color: 'red' }}>삭제</a></li> : null
                                        }
                                    </ul>
                            </div>
                                }
                        </div>
                    </li>
                </tr>
                <div style={{ height: '3px' }} />
                {/* 이미지 미리보기 */}
                <Viewer
                    visible={this.state.visible}
                    onClose={() => this.setState({ visible: false })}
                    downloadable='true'
                    rotatable={this.state.rotatable}
                    images={[{ src: API_URL + this.props.file.filePath }]} />
            </>
        )
    }
}

export default FileComponent;