import React, { Component, Fragment } from 'react';
import './file.scss';
import FileList from './FileList'
import Header from './Header';
import { AlertList } from "react-bs-notifier";
import Dropzone from './DropZone';
import {Link} from 'react-router-dom';

const API_URL = "http://192.168.1.223:8080/nest";
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
            fileSearch:'',
        }
    }

    // 파일 선택 했을 때.
    onChangeFileUpload(event, taskListNo) {
       
        this.setState({
            selectedFile: event.target.files[0],
        })

        if (event.target.files.length !== 0 && (event.target.files[0].type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            || event.target.files[0].type === 'image/png' || event.target.files[0].type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
            || event.target.files[0].type === 'text/plain' || event.target.files[0].type === 'image/jpeg' || event.target.files[0].type === 'application/vnd.ms-excel'
            || event.target.files[0].type === "application/x-zip-compressed")) {

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
                        taskListNo,
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
        let taskList = this.props.task;

        const projectIndex = this.props.task.findIndex(taskList => taskList.projectNo == this.props.match.params.projectNo)
        taskList = this.props.task[projectIndex].allTaskList

        let Indexs = []
        taskList.map( (taskList,taskListIndex) => 
        taskList.tasks.map((task,taskIndex) => 
        task.taskNo === this.props.match.params.taskNo
        ?Indexs.push({taskListIndex, taskIndex})
        :null
        ))
        const taskListNo = taskList[Indexs[0].taskListIndex].taskListNo
        
        this.setState({
            selectedFile: files[0]
        })
        
        if (files[0].length !== 0 && (files[0].type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            || files[0].type === 'image/png' || files[0].type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
            || files[0].type === 'text/plain' || files[0].type === 'image/jpeg' || files[0].type === 'application/vnd.ms-excel'
            || files[0].type === "application/x-zip-compressed")) {
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
                    taskListNo,
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

    //파일검색
    searchFile(event){
        this.setState({
            fileSearch:event.target.value
        })
    }

    render() {
        if(!this.props.task || this.props.task.length == 0){
            return <></>;
        }

        let taskList=[];
        let authUserRole = null;
        if(this.props.match.url.indexOf("calendar") !== -1){
            
            const projectIndex = this.props.task.findIndex(taskList => taskList.projectNo == this.props.match.params.projectNo)
            taskList = this.props.task[projectIndex].allTaskList
            authUserRole = this.props.task[projectIndex].authUserRole

        } else{
            taskList = this.props.task;
            authUserRole = this.props.authUserRole
        }
        let Indexs = []
        taskList.map( (taskList,taskListIndex) => 
            taskList.tasks.map((task,taskIndex) => 
                task.taskNo == this.props.match.params.taskNo
                    ?Indexs.push({taskListIndex, taskIndex})
                    :null
        ))
        const taskItem = taskList[Indexs[0].taskListIndex].tasks[Indexs[0].taskIndex]
        const taskListNo = taskList[Indexs[0].taskListIndex].taskListNo

        return (
            <div className="SettingFile">
                {taskItem.taskState == "del" ? 
                    <div className="task-delete"> 
                        <div className ="task-delete-warning">
                            <span>삭제된 업무입니다.</span>
                            {this.props.match.url.indexOf("calendar") === -1 ? 
                                <Link style= {{color:'black', textDecoration:'none'}} to = {`/nest/dashboard/${this.props.projectNo}/kanbanboard`} >
                                    <div className="setting-close">닫기</div>
                                </Link> :
                                <Link style= {{color:'black', textDecoration:'none'}} to = {`/nest/calendar`} >
                                    <div className="setting-close" onClick={this.props.taskCallbacks.onCloseSettingHTML}>닫기</div>
                                </Link>
                            }
                        </div>
                    </div> : null }
                <AlertList
                    style={{ top: '70px' }}
                    position={this.state.position}
                    alerts={this.state.alerts}
                    timeout={this.state.timeout}
                    dismissTitle="cancel"
                    onDismiss={this.onAlertDismissed.bind(this)}
                />
                <Header
                    location={this.props.match.url}
                    authUserRole={authUserRole}
                    taskItem={taskItem}
                    name={taskItem.userName}
                    date={taskItem.taskRegdate}
                    taskCallbacks={this.props.taskCallbacks}
                    params={this.props.match.params}
                    projectNo={this.props.projectNo}
                    taskListNo = {taskListNo} />
                <div className="File">
                    {taskItem.taskState == "del" || authUserRole === 3 ? 
                    // 삭제된 업무이거나 권한이 3인경우
                        <div style={{height:'100%'}} ><div
                        style={{display: 'inline-block', position: 'relative', height:'100%'}}><div className="FileMenu">
                            <form className="navbar-form navbar-left">
                                <div className="input-group">
                                    <input 
                                         type="text" 
                                         className="form-control" 
                                         value={this.state.fileSearch} 
                                         placeholder="파일 이름 검색" 
                                         name="search"
                                         onChange={this.searchFile.bind(this)}
                                         readOnly />
                                    <div className="input-group-btn"></div>
                                </div>
                            </form>
                            {taskItem.taskState == "del" || authUserRole === 3 ?
                                <button className="disabled-submit-button"> 파일첨부</button>
                                :
                                <>
                                <label htmlFor="fileUpload" className="fileUplaod-label">
                                    <div className="fileUpload"> 파일첨부</div>
                                </label>
                                <input
                                    id="fileUpload"
                                    onChange={(e) => this.onChangeFileUpload(e,taskListNo)}
                                    type='file'
                                    style={{display:'none'}} />
                                    </>
                            }
                        </div>
                        <hr style={{marginTop: '11%'}} />
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
                            searchFile={this.state.fileSearch}
                            authUserRole={authUserRole}
                            taskListNo={taskListNo}
                            taskNo={this.props.match.params.taskNo}
                            taskCallbacks={this.props.taskCallbacks}
                            taskItem={taskItem} /> </div></div>
                     :
                     // 삭제된 업무가 아니고 권한이 있는경우 
                     <div style={{height:'100%'}} ><Dropzone handleDrop={this.handleDrop.bind(this)}>
                        <div className="FileMenu">
                            <form className="navbar-form navbar-left">
                                <div className="input-group">
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={this.state.fileSearch} 
                                        placeholder="파일 이름 검색" 
                                        name="search"
                                        onChange={this.searchFile.bind(this)} />
                                    <div className="input-group-btn"></div>
                                </div>
                            </form>
                            {taskItem.taskState == "del" || authUserRole === 3 ?
                                <button className="disabled-submit-button"> 파일첨부</button>
                                :
                                <>
                                <label htmlFor="fileUpload" className="fileUplaod-label">
                                    <div className="fileUpload"> 파일첨부</div>
                                </label>
                                <input
                                    id="fileUpload"
                                    onChange={(e) => this.onChangeFileUpload(e,taskListNo)}
                                    type='file'
                                    style={{display:'none'}} />
                                    </>
                            }
                        </div>
                        <hr style={{marginTop: '11%'}} />
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
                            searchFile={this.state.fileSearch}
                            authUserRole={authUserRole}
                            taskListNo={taskListNo}
                            taskNo={this.props.match.params.taskNo}
                            taskCallbacks={this.props.taskCallbacks}
                            taskItem={taskItem} />
                    </Dropzone></div>
                    }
                    
                </div>
            </div>
        )
    }
}

export default File;