import React, {Component} from 'react';
import Button from 'react-bootstrap/Button';
import './Main.scss';
import Important from './Important';
import Navigation from './Navigation';
import Header from '../file/Header';


class Setting extends Component {
    
    render(){
        const ButtonStyle = {
            background: 'none'
        }
    
    console.log("------->", this.props.taskContents);

    return (
        <div style={{ height: '100%'}}>
            <div style={{ float:'right'}}>
                <Header name='김우경' date='2020.05.06' taskContents={this.props.taskContents} />
            </div>
            <div className="Home">
                <div style={{ fontSize: '1.3rem', margin: '4%', color: '#27B6BA' }}><b>설명 추가</b></div>
                <hr style={{ marginBottom: '20px', color: '#555555' }} />
                <ul>
                    <li>
                        <div style={{ display: 'inline-block' }}><i class="fas fa-calendar-week"></i></div>
                        <div style={{ display: 'inline-block' }}><h5><b>업무마감일</b></h5></div>
                        <div style={{ display: 'inline-block' }}><Button variant=""> <i class="fas fa-plus fa-1x"></i> </Button> </div>
                    </li>
                    <li>
                        <div style={{ float: 'left',marginTop:'10px' }}><i class="fas fa-user-plus"></i></div>
                        <div style={{ float: 'left' }}><h5><b>배정된멤버</b></h5></div>
                        <div style={{ float: 'left' }}>
                            <Button variant=""><i class="fas fa-plus fa-1x"></i></Button>
                        </div>
                        <div className="Member-list" style={{ display: 'inline-block' }}>
                            <div className="Member">
                                <img src="/images/unnamed.jpg" className="img-circle" alt="Cinque Terre" />
                                <span>김우경</span>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div style={{ display: 'inline-block' }}><i class="fas fa-tags"></i></div>
                        <div style={{ display: 'inline-block' }}><h5><b>태그</b></h5></div>
                        <div style={{ display: 'inline-block' }} className="link"><Button variant=""><i class="fas fa-plus fa-1x"></i> </Button></div>
                    </li>
                    <li>
                        <div style={{ display: 'inline-block' }}><i class="fas fa-star"></i></div>
                        <div style={{ display: 'inline-block' }}><h5><b>중요도</b></h5></div>
                        <div style={{ display: 'inline-block' }} className="link">
                            <Important />
                        </div>
                    </li>

                    <li>
                        <div style={{ display: 'inline-block' }}><i class="fas fa-palette" /></div>
                        <div style={{ display: 'inline-block' }}><h5><b>색상라벨</b></h5></div>
                        <div style={{ display: 'inline-block' }} className="link"><Button variant=""><i class="fas fa-plus fa-1x"></i></Button></div>
                    </li>
                    <li>
                        <form className="TodoInsert">
                            <button type="submit"><i class="fas fa-plus fa-1x"></i></button>
                            <input placeholder="  할 일을 입력" />
                        </form>
                    </li>
                </ul>
            </div>
        </div>

    )
    }
}
export default Setting;

