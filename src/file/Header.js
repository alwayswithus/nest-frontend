import React from 'react';
import './file.scss';

const Header = (props) => {
    return (
        <div>
            <div>
                <h1>Project Name</h1>
                작성자 : {props.name} • &nbsp;&nbsp;&nbsp; 작성일 : {props.date}
            </div>
            <hr style={{marginTop:'10px'}}/>
        </div>
    )
}

export default Header;