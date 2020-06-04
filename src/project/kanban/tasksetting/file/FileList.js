import React, {Component} from 'react';
import './file.scss';
import Dropzone from 'react-dropzone-uploader'
import 'react-dropzone-uploader/dist/styles.css'
import moment from 'moment';
const API_URL = "http://localhost:8080/nest";

class FileList extends Component{
    
    downloadEmployeeData(originName){
        // fetch( `${API_URL}/api/download/${originName}`, {
        //     method:'GET',
        //     headers:API_HEADERS,
        //     responseType: 'blob'
        // })
        // .then(response => {
        //     var blob = new Blob(['Hello world!'], {rt})
        //     FileSaver.saveAs(new Blob(["http://localhost:8080/nest/assets/upimages/20205445428440.jpg"]),"test.jpg")
        // })
        // .then(response => {
        //     console.log("Response", response.headers['content-disposition'])
        //     this.setState({
        //         download:false
        //     })
        //     var filename=this.extractFileName(response.headers['content-disposition']);
        //     console.log("File name",filename);

        //     const url = window.URL.createObjectURL(new Blob([response.data]));
        //     console.log(new Blob([response.data]))
        //     const link = document.createElement('a');
        //     console.log(link)
        //     link.href = url;
        //     link.setAttribute('download', 'file.jpg'); //or any other extension
        //     document.body.appendChild(link);
        //     link.click();


        //     response.blob().then(blob => {
        //         let url = window.URL.createObjectURL(blob);
        //         console.log(url)
        //         let a = document.createElement('a');
        //         a.href = url;
        //         a.download = 'employees.json';
        //         a.click();
        //     });
        // })
    }
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
                                        <li><a href="#" onClick={this.downloadEmployeeData.bind(this, file.originName)}>다운로드</a></li>
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