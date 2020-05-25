import React from 'react';
import './file.scss';

const FileList = () => {
    return (
        <div className="FileList">
            <table>
                <tr>
                    <td>파일이름</td>
                    <td>2020.05.06</td>
                    <td>김우경</td>
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

                <tr>
                    <td>20200510.사아아아ㅏ아아아진.jpg</td>
                    <td>2020.05.06</td>
                    <td>김우경</td>
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
            </table>
        </div>
    )
}

export default FileList;