import React from 'react';
import './file.scss';
import FileList from './FileList'
import Button from 'react-bootstrap/Button';
import Navigation from '../tasksetting/Navigation';
import Header from './Header';

const File = (props) => {
    return (
        <>
            <Header taskContents={props.taskContents}/>
            <div className="File">
                <div className="FileMenu">
                    <form className="navbar-form navbar-left">
                            <div className="input-group">
                                <input type="text" className="form-control" placeholder="Search" name="search" />
                                <div className="input-group-btn">
                                    <button className="btn btn-default" type="submit">
                                        <i class="glyphicon glyphicon-search"></i>
                                    </button>
                                </div>
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
        </>
    )
}

export default File;