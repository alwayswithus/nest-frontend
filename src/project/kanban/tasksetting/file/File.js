import React, { Component, Fragment } from 'react';
import './file.scss';
import FileList from './FileList'
import Header from './Header';
import { AlertList } from "react-bs-notifier";
import Dropzone from './DropZone';

const API_URL = "http://localhost:8080/nest";
const API_HEADERS = {
    "Context-Type": "application/json",
}

class File extends Component {

    constructor() {
        super(...arguments)
        this.state = {
            selectedFile: null,
            // danger: false,
            position: "bottom-right",
            alerts: [],
            timeout: 2000,
            newMessage: "지원하지 않는 파일 형식입니다.",
        }
    }

    // 파일 선택 했을 때.
    onChangeFileUpload(event) {
       
        console.log("fileUpload")
        this.setState({
            selectedFile: event.target.files[0],
        })

        if (event.target.files.length !== 0 && (event.target.files[0].type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            || event.target.files[0].type === 'image/png' || event.target.files[0].type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
            || event.target.files[0].type === 'text/plain' || event.target.files[0].type === 'image/jpeg' || event.target.files[0].type === 'application/vnd.ms-excel')) {

            const formData = new FormData();
            formData.append('file', event.target.files[0])
            formData.append('taskNo', this.props.match.params.taskNo);
            formData.append('userNo', sessionStorage.getItem("authUserNo"));

            fetch(`${API_URL}/api/upload`, {
                method: 'post',
                headers: API_HEADERS,
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
        else {
            const newAlert = {
                id: (new Date()).getTime(),
                type: "danger",
                message: this.state.newMessage
            };

            this.setState({
                alerts: [...this.state.alerts, newAlert]
            })
        }
    }

    handleDrop(files) {
        // this.props.onDragDropFileUpload(files[0])
        this.setState({
            selectedFile: files[0]
        })
        if (files[0].length !== 0 && (files[0].type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            || files[0].type === 'image/png' || files[0].type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
            || files[0].type === 'text/plain' || files[0].type === 'image/jpeg' || files[0].type === 'application/vnd.ms-excel')) {
        const formData = new FormData();
        formData.append('file', files[0])
        formData.append('taskNo', this.props.match.params.taskNo);
        formData.append('userNo', sessionStorage.getItem("authUserNo"));

        fetch(`${API_URL}/api/upload`, {
            method: 'post',
            headers: API_HEADERS,
            body: formData,
        })
            .then((response) => response.json())
            .then((json) => {
                this.props.taskCallbacks.addFile(
                    json.data,
                    this.props.match.params.taskListNo,
                    this.props.match.params.taskNo)
            })
        } else {
            const newAlert = {
                id: (new Date()).getTime(),
                type: "danger",
                message: this.state.newMessage
            };

            this.setState({
                alerts: [...this.state.alerts, newAlert]
            })
        }
    }

    // Invite Member Alert Function
    onAlertDismissed(alert) {
        const alerts = this.state.alerts;

        // find the index of the alert that was dismissed
        const idx = alerts.indexOf(alert);

        if (idx >= 0) {
            this.setState({
                // remove the alert from the array
                alerts: [...alerts.slice(0, idx), ...alerts.slice(idx + 1)]
            });
        }
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
                <AlertList
                    style={{ top: '70px' }}
                    position={this.state.position}
                    alerts={this.state.alerts}
                    timeout={this.state.timeout}
                    dismissTitle="cancel"
                    onDismiss={this.onAlertDismissed.bind(this)}
                />
                <Header
                    taskItem={taskItem}
                    taskCallbacks={this.props.taskCallbacks}
                    params={this.props.match.params}
                    projectNo={this.props.projectNo} />
                <div className="File">
                    <Dropzone handleDrop={this.handleDrop.bind(this)}>
                        <div className="FileMenu">
                            <form className="navbar-form navbar-left">
                                <div className="input-group">
                                    <input type="text" className="form-control" placeholder="Search" name="search" />
                                    <div className="input-group-btn"></div>
                                </div>
                            </form>
                            {this.props.authUserRole == 3 ?
                                <button className="disabled-submit-button"> 파일첨부</button>
                                :
                                <input
                                    onChange={this.onChangeFileUpload.bind(this)}
                                    type='file'
                                    className="fileUpload"
                                    name="file" />
                            }
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
                        <FileList
                            taskListNo={this.props.match.params.taskListNo}
                            taskNo={this.props.match.params.taskNo}
                            taskCallbacks={this.props.taskCallbacks}
                            taskItem={taskItem} />
                    </Dropzone>
                </div>
            </div>
        )
    }
}

export default File;