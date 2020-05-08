import React from 'react';
import './file.scss';

const FileList = () => {
    return (
        <table>
            <tr>
                <td>파일이름</td>
                <td>2020.05.06</td>
                <td>김우경</td>
                <button className="btn btn-default" type="submit">
                    <i class="fas fa-ellipsis-v"></i>
                </button>
            </tr>
        </table>
    )
}

export default FileList;