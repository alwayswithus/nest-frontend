import React from 'react';
import Button from 'react-bootstrap/Button';
import './Main.scss';
import Important from './Important';

const Home = (props) => {
    return (
        <div className="Home">
            <div style={{fontSize:'1.3rem'}}>설명 추가</div>
            <hr style={{marginBottom:'20px'}}/>
            <table>
                <tr>
                    <td><i class="fas fa-calendar-week fa-2x"></i></td>
                    <td><h5>업무마감일</h5> </td>
                    <td><Button variant=""> <i class="fas fa-plus fa-2x"></i> </Button> </td>
                </tr>
                <br/>
                <tr>
                    <td><i class="fas fa-user-plus fa-2x"></i></td>
                    <td><h5>배정된멤버</h5></td>
                    <td><Button variant=""><i class="fas fa-plus fa-2x"></i></Button></td>
                </tr>
                <br/>
                <tr>
                    <td><i class="fas fa-tags fa-2x"></i></td>
                    <td> <h5>태그</h5></td>
                    <td><Button variant=""><i class="fas fa-plus fa-2x"></i> </Button></td>
                </tr>
                <br/>
                <tr>
                    <td> <i class="fas fa-star fa-2x"></i></td>
                    <td> <h5>중요도</h5></td>
                    <td><Important /></td>
                </tr>
                <br/>
                <tr>
                    <td><i class="fas fa-palette fa-2x"></i></td>
                    <td> <h5>색상라벨</h5></td>
                    <td><Button variant=""><i class="fas fa-plus fa-2x"></i></Button></td>
                </tr>
            </table>
            <br/>
            <form className="TodoInsert">
                <button type="submit"><i class="fas fa-plus fa-2x"></i></button>
                <input placeholder="할 일을 입력" />
            </form>
        </div>
    )
}

export default Home;