
import React, { Component, Fragment } from 'react';
import Button from 'react-bootstrap/Button';
import './Setting.scss';
import Important from './Important';
import Header from '../file/Header';
import ModalCalendar from '../../../../modalCalendar/ModalCalendar2';
import CheckList from './CheckList';
import ColorPicker from './ColorPicker';
import TagModal from './TagModal';

class Setting extends Component {
    constructor (){
        super(...arguments)
        this.state ={
            open:false,
            todo:'',
            tagOpen:false
        }
    }
    onOpenCalendar() {
        this.setState({
            open:!this.state.open
        })
    };

    onTodoInsert(event){
        console.log("SEtting : " + this.props.taskListNo)
        this.setState({
            todo:event.target.value
        })
    }
    
    onKeypress(event){
        if(event.key == 'Enter'){
            event.preventDefault()
            this.props.taskCallbacks.addtodo(event.target.value,this.props.task.no, this.props.taskListNo)
        }
        this.setState({
            todo:''
        })
    }

    //tag 모달 창 켜기.
    onCallOpenClose(open){
        this.setState({
            tagOpen:open
        })
        console.log(this.state.tagOpen)
    }

    onClickTagPlus() {
        this.setState({
            tagOpen:!this.state.tagOpen
        })
    }

    render() {
        const taskItem = this.props.task;
        return (
            <>
                <div style={{ height: '100%' }}>
                    {/* 업무속성 헤더 */}
                    <div style={{ float: 'right' }}>
                        <Header path= {this.props.path} onCallbackSetting={this.props.onCallbackSetting} name='김우경' date='2020.05.06' taskContents = {taskItem.contents}/>
                    </div>

                    {/* 업무속성 리스트 */}
                    <div className="Home">
                        <div style={{ fontSize: '1.3rem', margin: '4%', color: '#27B6BA' }}><b>설명 추가</b></div>
                        <hr style={{ marginBottom: '20px', color: '#555555' }} />
                        <ul>
                            {/* 업무 마감일 */}
                            <li>
                                <div style={{ display: 'inline-block' }}><i className="fas fa-calendar-week"></i></div>
                                <div style={{ display: 'inline-block' }}><h5><b>업무마감일</b></h5></div>
                                <div style={{ display: 'inline-block' }}>
                                    <Button variant="" onClick={this.onOpenCalendar.bind(this)}> <i className="fas fa-plus fa-1x"></i> </Button>
                                    {this.state.open ? <ModalCalendar /> : ""}
                                </div>
                                <div className="Date" style={{ display: 'inline-block' }}>
                                    {}
                                </div>
                            </li>
                            {/* 배정된 멤버 */}
                            <li>
                                <div style={{ float: 'left', marginTop: '10px' }}><i className="fas fa-user-plus"></i></div>
                                <div style={{ float: 'left' }}><h5><b>배정된멤버</b></h5></div>
                                <div style={{ float: 'left' }}>
                                    <Button variant=""><i className="fas fa-plus fa-1x"></i></Button>
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
                                <div style={{ display: 'inline-block' }}><i className="fas fa-tags"></i></div>
                                <div style={{ display: 'inline-block' }}><h5><b>태그</b></h5></div>

                                <div style={{ display: 'inline-block' }} className="link">
                                    <Button onClick = {this.onClickTagPlus.bind(this)} variant=""><i className="fas fa-plus fa-1x"></i> </Button>
                                </div>
                                {taskItem.tag.map(tag => 
                                    <div key={tag.id} style={{ display: 'inline-block' }} className = "TagList">
                                        <div className = "tag">
                                            <span className="label label-default tagLabel" style={{backgroundColor:`${tag.color}`, fontSize:'1.25rem', cursor:'default'}}>{tag.name}</span>
                                        </div>
                                    </div>
                                )}
                                <div key = {this.props.taskListNo} style={{position:'relative', marginLeft:'20%'}}>
                                    {this.state.tagOpen ? <TagModal 
                                                                key={this.props.task.no} 
                                                                taskListNo = {this.props.taskListNo}
                                                                taskNo = {this.props.task.no}
                                                                taskCallbacks={this.props.taskCallbacks} 
                                                                onCallbacks={this.onCallOpenClose.bind(this)}/> : null}
                                </div>
                            </li>

                            {/* 중요도 */}
                            <li>
                                <div style={{ display: 'inline-block' }}><i className="fas fa-star"></i></div>
                                <div style={{ display: 'inline-block' }}><h5><b>중요도</b></h5></div>
                                <div style={{ display: 'inline-block' }} className="link">
                                    <Important />
                                </div>
                            </li>
                            {/* 색상라벨 */}
                            <li>
                                <div style={{ display: 'inline-block' }}><i className="fas fa-palette" /></div>
                                <div style={{ display: 'inline-block' }}><h5><b>색상라벨</b></h5></div>
                                <div style={{ display: 'inline-block' }}> <ColorPicker /></div>
                            </li>

                            {/* 하위 할일 */}
                            <li>
                                <form className="TodoInsert">

                                    <div className="todoList">
                                        {taskItem.todoList && taskItem.todoList.map(todo =>
                                            <div key={todo.id} className="todo">
                                                    <input type="checkbox" className="doneCheck"></input>
                                                        <div style={{borderLeft:'3px solid #F8BCB6'}}/>
                                                            <CheckList todo={todo} key={todo.id}/>
                                                        </div>)}
                                        <div className = "insert">

                                            <button type="submit">
                                                <i style = {{marginLeft: '40%'}} className="fas fa-plus fa-2x"></i>
                                            </button>
                                            <div className = "checkListInput">
                                                <input 
                                                    onChange={this.onTodoInsert.bind(this)} 
                                                    style = {{marginLeft: '5%'}} 
                                                    value = {this.state.todo} 
                                                    placeholder={this.state.todo}
                                                    onKeyPress={this.onKeypress.bind(this)} />
                                            </div>
                                        </div>
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

