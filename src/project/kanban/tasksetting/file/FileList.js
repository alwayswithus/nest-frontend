import React, {Component} from 'react';
import './file.scss';
// import Dropzone from 'react-dropzone-uploader'
// import 'react-dropzone-uploader/dist/styles.css'
// import moment from 'moment';
// import Viewer from 'react-viewer'
import FileComponent from './FileComponent'

const API_URL = "http://localhost:8080/nest";
const API_HEADERS = {
    "Context-Type": "application/json",
}

class FileList extends Component{

    render(){
        return (
            <div className="FileList">
                <table>
                    <tbody>
                        {this.props.taskItem.commentList.map(file => 
                            file.fileNo == null ? null :
                            <FileComponent
                                key={file.fileNo}
                                taskListNo={this.props.taskListNo}
                                taskNo={this.props.taskNo}
                                taskCallbacks={this.props.taskCallbacks} 
                                file = {file}
                            />
                        )}
                    </tbody>
                </table>

            </div>
        )
    }
}

export default FileList;