
import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import './Setting.scss';
import Important from './Important';
import Header from '../file/Header';
import ModalCalendar from '../../../../modalCalendar/ModalCalendar2';
class Setting extends Component {
    constructor (){
        super(...arguments)
        this.state ={
            open:false
        }
    }
    onOpenCalendar() {
        this.setState({
            open:!this.state.open
        })
    };
    render() {
        const taskItem = this.props.task;


        return (
            <>
            
                <div style={{ height: '100%' }}>
                    {/* 업무속성 헤더 */}
                    <div style={{ float: 'right' }}>
                        <Header name='김우경' date='2020.05.06' taskContents = {taskItem.contents}/>
                    </div>

                    {/* 업무속성 리스트 */}
                    <div className="Home">
                        <div style={{ fontSize: '1.3rem', margin: '4%', color: '#27B6BA' }}><b>설명 추가</b></div>
                        <hr style={{ marginBottom: '20px', color: '#555555' }} />
                        <ul>
                            {/* 업무 마감일 */}
                            <li>
                                <div style={{ display: 'inline-block' }}><i class="fas fa-calendar-week"></i></div>
                                <div style={{ display: 'inline-block' }}><h5><b>업무마감일</b></h5></div>
                                <div style={{ display: 'inline-block' }}>
                                    <Button variant="" onClick={this.onOpenCalendar.bind(this)}> <i class="fas fa-plus fa-1x"></i> </Button>
                                    {this.state.open ? <ModalCalendar /> : ""}
                                </div>
                                <div className="Date" style={{ display: 'inline-block' }}>
                                    {}
                                </div>
                            </li>
                            {/* 배정된 멤버 */}
                            <li>
                                <div style={{ float: 'left', marginTop: '10px' }}><i class="fas fa-user-plus"></i></div>
                                <div style={{ float: 'left' }}><h5><b>배정된멤버</b></h5></div>
                                <div style={{ float: 'left' }}>
                                    <Button variant=""><i class="fas fa-plus fa-1x"></i></Button>
                                </div>
                                <div className="Member-list" style={{ display: 'inline-block' }}>
                                    <div className="Member">
                                        <img src="assets/images/unnamed.jpg" className="img-circle" alt="Cinque Terre" />
                                        <span>김우경</span>
                                    </div>
                                </div>
                            </li>

                            {/* 태그 */}
                            <li>
                                <div style={{ display: 'inline-block' }}><i class="fas fa-tags"></i></div>
                                <div style={{ display: 'inline-block' }}><h5><b>태그</b></h5></div>
                                <div style={{ display: 'inline-block' }} className="link"><Button variant=""><i class="fas fa-plus fa-1x"></i> </Button></div>
                            </li>

                            {/* 중요도 */}
                            <li>
                                <div style={{ display: 'inline-block' }}><i class="fas fa-star"></i></div>
                                <div style={{ display: 'inline-block' }}><h5><b>중요도</b></h5></div>
                                <div style={{ display: 'inline-block' }} className="link">
                                    <Important />
                                </div>
                            </li>
                            {/* 색상라벨 */}
                            <li>
                                <div style={{ display: 'inline-block' }}><i class="fas fa-palette" /></div>
                                <div style={{ display: 'inline-block' }}><h5><b>색상라벨</b></h5></div>
                                <div style={{ display: 'inline-block' }} className="link"><Button variant=""><i class="fas fa-plus fa-1x"></i></Button></div>
                            </li>

                            {/* 하위 할일 */}
                            <li>
                                <form className="TodoInsert">
                                    <button type="submit"><i class="fas fa-plus fa-1x"></i></button>
                                    <input placeholder="  할 일을 입력" />
                                    <div className="todoList">
                                            <ul>
                                                 {taskItem.todoList && taskItem.todoList.map(todo =>
                                                 <div className="todo">
                                                    <input type="checkbox" className="doneCheck"></input>
                                                    <li key={todo.id}>{todo.text}</li> </div>)} 
                                            </ul>
                                        </div>
                                </form>
                            </li>
                        </ul>
                    </div>
                </div>
            </>
        )
    }
}
export default Setting;

