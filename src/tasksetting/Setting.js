import React from 'react';
import Button from 'react-bootstrap/Button';
import './Main.scss';
import Important from './Important';
import Navigation from './Navigation';
import Header from '../file/Header';


const Setting = (props) => {
    const ButtonStyle = {
        backgroundColor:'none'
    }
    return (
        <div className="Home">
            <Header name='김우경' date='2020.05.06'/>
            <Navigation />
            <div style={{fontSize:'1.3rem'}}>설명 추가</div>
            <hr style={{marginBottom:'20px', color:'#555555'}}/>
            <table>
                <tr>
                    <td><i class="fas fa-calendar-week"></i></td>
                    <td><h5><b>업무마감일</b></h5></td>
                    <td><Button style={ButtonStyle} variant=""> <i class="fas fa-plus fa-1x"></i> </Button> </td>
                </tr>
                <br/>
                <tr>
                    <td><i class="fas fa-user-plus"></i></td>
                    <td><h5><b>배정된멤버</b></h5></td>
                    <td><Button variant=""><i class="fas fa-plus fa-1x"></i></Button></td>
                </tr>
                <br/>
                <tr>
                    <td><i class="fas fa-tags"></i></td>
                    <td><h5><b>태그</b></h5></td>
                    <td><Button variant=""><i class="fas fa-plus fa-1x"></i> </Button></td>
                </tr>
                <br/>
                <tr>
                    <td><i class="fas fa-star"></i></td>
                    <td><h5><b>중요도</b></h5></td>
                    <td><Important /></td>
                </tr>
                <br/>
                <tr>
                    <td><i class="fas fa-palette"></i></td>
                    <td><h5><b>색상라벨</b></h5></td>
                    <td><Button variant=""><i class="fas fa-plus fa-1x"></i></Button></td>
                </tr>
            </table>
            <br/>
            <form className="TodoInsert">
                <button type="submit"><i class="fas fa-plus fa-1x"></i></button>
                <input placeholder="  할 일을 입력" />
            </form>
        </div>
    )
}
export default Setting;

