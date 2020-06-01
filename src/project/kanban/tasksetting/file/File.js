import React, { Component, Fragment } from 'react';
import './file.scss';
import FileList from './FileList'
import Header from './Header';
import axios from 'axios';

const API_URL = "http://localhost:8080/nest";
const API_HEADERS = {
    "Context-Type": "application/json",
}

class File extends Component {

    constructor(){
        super(...arguments)
        this.state = {
            selectedFile:null,
        }
    }

    // 파일 선택 했을 때.
    onChangeFileUpload(event) {
        this.setState({
            selectedFile : event.target.files[0]
        })

        const formData = new FormData();
        formData.append('file', event.target.files[0])
        formData.append('taskNo', this.props.match.params.taskNo);
        formData.append('userNo', sessionStorage.getItem("authUserNo"));

        fetch(`${API_URL}/api/upload`, {
            method:'post',
            headers:API_HEADERS,
            body: formData,
          })
          .then((response) => response.json())
          .then((json) => {
                this.props.taskCallbacks.addFile(
                  json.data,
                  this.props.match.params.taskListNo, 
                  this.props.match.params.taskNo)
          })
    }
    render() {
        if (!this.props.task) {
            return <></>;
        }

        const taskList = this.props.task;
        const taskListIndex = taskList.findIndex(taskList => taskList.taskListNo === this.props.match.params.taskListNo);
        const taskIndex = taskList[taskListIndex].tasks.findIndex(task => task.taskNo === this.props.match.params.taskNo);
        const taskItem = taskList[taskListIndex].tasks[taskIndex]
        return (
            <div className="SettingFile">
                <Header taskContents={taskItem.taskContents} params={this.props.match.params} projectNo={this.props.projectNo} />
                <div className="File">
                    <div className="FileMenu">
                        <form className="navbar-form navbar-left">
                            <div className="input-group">
                                <input type="text" className="form-control" placeholder="Search" name="search" />
                                <div className="input-group-btn"></div>
                            </div>
                        </form>
                            <input  
                                onChange={this.onChangeFileUpload.bind(this)} 
                                type='file' className="fileUpload" name="file" />
                    </div>
                    <hr />
                    <table>
                        <thead>
                            <tr>
                                <td>이름</td>
                                <td>공유한날짜</td>
                                <td>공유한사람</td>
                            </tr>
                        </thead>
                    </table>
                    <hr style={{ paddingLeft: '10px' }} />
                    <FileList taskItem={taskItem}/>
                </div>
            </div>
        )
    }
}

export default File;