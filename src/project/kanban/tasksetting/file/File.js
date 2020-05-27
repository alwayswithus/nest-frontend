import React, { Component, Fragment } from 'react';
import './file.scss';
import FileList from './FileList'
import Header from './Header';

class File extends Component {
    render(){
        const taskList = this.props.task;
        const taskListIndex = taskList.findIndex(taskList => taskList.no == this.props.match.params.taskListNo);
        const taskIndex = taskList[taskListIndex].tasks.findIndex(task => task.no == this.props.match.params.taskNo);
        const taskItem = taskList[taskListIndex].tasks[taskIndex]
    return (
            <div className="SettingFile">
                <Header taskContents = {taskItem.taskContents} params={this.props.match.params}/>
                <div className="File">
                    <div className="FileMenu">
                        <form className="navbar-form navbar-left">
                                <div className="input-group">
                                    <input type="text" className="form-control" placeholder="Search" name="search" />
                                    <div className="input-group-btn"></div>
                                </div>
                            </form>
                        <button className="btn btn-info" style={{margin:'8px 0px'}}>파일첨부</button>
                    </div>
                    <hr/>
                    <table>
                        <tr>
                            <td>이름</td>
                            <td>공유한날짜</td>
                            <td>공유한사람</td>
                        </tr>
                    </table>
                    <hr style={{paddingLeft:'10px'}}/>
                    <FileList />
                </div>
            </div>
        )
    }
}

export default File;