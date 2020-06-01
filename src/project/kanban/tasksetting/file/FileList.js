import React, {Component} from 'react';
import './file.scss';
import Dropzone from 'react-dropzone-uploader'
import 'react-dropzone-uploader/dist/styles.css'
import moment from 'moment';
const API_URL = "http://localhost:8080/nest";

class FileList extends Component{
    render(){
        return (
            <div className="FileList">
                <table>
                    <tbody>
                        {this.props.taskItem.commentList.map(file => 
                            file.fileNo == null ? null :
                            <>
                            <tr className="FileList-tr">
                                <td>
                                    <img style={{width:'50px', paddingRight:'3%', paddingBottom:'1%'}} src={`${API_URL}${file.filePath}`} alt={file.originName} ></img>
                                    {file.originName}</td>
                                <td>{moment(file.fileRegDate).format('YYYY년 MM월 DD일')}</td>
                                <td>{file.userName}</td>
                                <li>
                                    <button className="btn btn-default" type="submit">
                                        <i className="fas fa-ellipsis-v"></i>
                                    </button>
                                    <ul>
                                        <li><a href="#">다운로드</a></li>
                                        <li><a href="#">이름변경</a></li>
                                        <li><a href="#" style={{color:'red'}}>삭제</a></li>
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