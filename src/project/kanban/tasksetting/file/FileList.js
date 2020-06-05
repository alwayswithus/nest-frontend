import React, {Component} from 'react';
import './file.scss';
import Dropzone from 'react-dropzone-uploader'
import 'react-dropzone-uploader/dist/styles.css'
import moment from 'moment';

const API_URL = "http://localhost:8080/nest";
const API_HEADERS = {
    "Context-Type": "application/json",
}

class FileList extends Component{

    downloadEmployeeData(fileNo){
        //blob : 이미지, 사운드, 비디오와 같은 멀티미디어 데이터를 다룰 때 사용, MIME 타입을 알아내거나, 데이터를 송수신
        fetch( `${API_URL}/api/download/${fileNo}`)
        .then(response => {
            const filename =  response.headers.get('Content-Disposition').split('filename=')[1];
            response.blob().then(blob => {
                console.log(blob.type)
              let url = window.URL.createObjectURL(blob);
              let a = document.createElement('a');
              a.href = url;
              a.download = filename;
              a.click();
          });
       });
    }

    //파일 삭제하기
    onClickDeleteFile(fileNo, commentNo){
        if(window.confirm("파일을 삭제하시겠습니까?")){
            this.props.taskCallbacks.deleteComment(fileNo, this.props.taskListNo, this.props.taskNo, commentNo);
        }
    }
    render(){
        return (
            <div className="FileList">
                <table>
                    <tbody>
                        {this.props.taskItem.commentList.map(file => 
                            file.fileNo == null ? null :
                            <>
                            <tr key={file.fileNo} className="FileList-tr">
                                <td>
                                    {file.originName.split('.')[1] === 'csv' || file.originName.split('.')[1] === 'xlxs' ? 
                                        <img style={{width:'50px', paddingRight:'3%', paddingBottom:'1%'}} src='/assets/images/excel.png' alt={file.originName} ></img> :
                                        <>{file.originName.split('.')[1] === 'txt' ? <img style={{width:'50px', paddingRight:'3%', paddingBottom:'1%'}} src='/assets/images/txt.png' alt={file.originName} ></img> :
                                            <>{file.originName.split('.')[1] === 'png' || file.originName.split('.')[1] === 'jpg' ? <img style={{width:'50px', paddingRight:'3%', paddingBottom:'1%'}} src={`${API_URL}${file.filePath}`} alt={file.originName} ></img> :
                                                <img style={{width:'50px', paddingRight:'3%', paddingBottom:'1%'}} src='/assets/images/attach.png' alt={file.originName} ></img>
                                            }</>
                                        }</>
                                    }
                                    {file.originName}</td>
                                <td>{moment(file.fileRegDate).format('YYYY년 MM월 DD일')}</td>
                                <td>{file.userName}</td>
                                <li>
                                    <button className="btn btn-default" type="submit">
                                        <i className="fas fa-ellipsis-v"></i>
                                    </button>
                                    <ul>
                                        <li><a href="#" onClick={this.downloadEmployeeData.bind(this,file.fileNo)}>다운로드</a></li>
                                        <li><a href="#">이름변경</a></li>
                                        <li><a href="#" onClick={this.onClickDeleteFile.bind(this,file.fileNo, file.commentNo)} style={{color:'red'}}>삭제</a></li>
                                    </ul>
                                </li>
                            </tr>
                            <div style={{height:'3px'}}/>
                            </>
                        )}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default FileList;