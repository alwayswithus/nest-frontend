
import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import './Setting.scss';
import Important from './Important';
import Header from '../file/Header';
import ModalCalendar from '../../../../modalCalendar/ModalCalendar';
import CheckList from './CheckList';
import ColorPicker from './ColorPicker';
import TagModal from './TagModal';
import tagData from './tagData.json'
import update from "react-addons-update";

class Setting extends Component {
    constructor (){
        super(...arguments)
        this.state ={
            open:false,
            todo:'',
            tags:tagData
        }
    }
    onOpenCalendar() {
        this.setState({
            open:!this.state.open
        })
    };

    //업무등록 onChange
    onTodoChange(event){
        this.setState({
            todo:event.target.value
        })
    }
    
    // 업무등록
    onKeypress(event){
        if(event.key === 'Enter'){
            event.preventDefault()
            this.props.taskCallbacks.addtodo(event.target.value,this.props.task.no, this.props.taskListNo)
            this.setState({
                todo:''
            })
        }
    }

    //click check box
    clickCheckBox(todoId, todoCheck){
        this.props.taskCallbacks.todoCheckUpdate(this.props.taskListNo, this.props.task.no,todoId, todoCheck)
    }
    
    //태그 + 버튼 클릭.(모달창 띄우기)
    onClickTag(){
        this.props.onClickModal();
    }

    callbackAddTags(tagName){
        console.log("Setting : " + tagName)

        const tagsLength = this.state.tags.length
        let newTag = {
            tagNo : tagsLength + 1,
            tagName : tagName
        }

        let newTags = update(this.state.tags, {
            $push : [newTag]
        });

        this.setState({
            tags:newTags
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
                            <li className="taskSettingList">
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
                            <li className="taskSettingList">
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
                            <li className="taskSettingList">
                                <div style={{ float:'left'}}><i className="fas fa-tags"></i></div>
                                <div style={{ float:'left' }}><h5><b>태그</b></h5></div>

                                <div style={{ float:'left' }} className="link">
                                    <Button onClick ={this.onClickTag.bind(this)} variant=""><i className="fas fa-plus fa-1x"></i> </Button>
                                    <div style={{position:'relative', marginLeft:'20%', right: '198px'}}>
                                        {/* tag 검색창 */}
                                        <TagModal
                                            closeValue = {this.props.closeValue}
                                            closeTag = {this.props.closeTag}
                                            onClickModal={this.props.onClickModal}
                                            onClicknewTagModal = {this.props.onClicknewTagModal}
                                            key={this.props.task.no} 
                                            taskListNo = {this.props.taskListNo}
                                            taskNo = {this.props.task.no}
                                            taskItem = {taskItem}
                                            tags = {this.state.tags}
                                            taskCallbacks={this.props.taskCallbacks}
                                            settingCallbacks = {{
                                                add: this.callbackAddTags.bind(this)
                                            }} />
                                    </div>
                                </div>

                                {/* tag List */}
                                <div style={{ display: 'inline-block' }} className = "TagList">
                                    {taskItem.tag.map(tag => 
                                        <div key={tag.id} style={{ display: 'inline-block', backgroundColor:`${tag.color}`, borderRadius:'3px' }} className = "tag">
                                            <span className="label label-default tagLabel" style={{background: 'none', fontSize:'1.25rem', cursor:'default'}}>{tag.name}</span>
                                        </div>
                                    )}
                                </div>
                                
                            </li>

                            {/* 중요도 */}
                            <li className="taskSettingList">
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
                            <li className="taskSettingList">
                                <div className="checkList">
                                    {taskItem.todoList && taskItem.todoList.map(todo =>
                                        <div key={todo.id} className="todo">
                                                <input type="checkbox" className="doneCheck" checked={todo.checked} onClick={this.clickCheckBox.bind(this,todo.id, todo.checked)} readOnly></input>
                                                    <div style={{borderLeft:'3px solid #F8BCB6'}}/>
                                                        <CheckList 
                                                            params={{
                                                                taskListNo : this.props.taskListNo, 
                                                                taskNo : taskItem.no}} 
                                                            taskCallbacks={this.props.taskCallbacks} 
                                                            todo={todo} 
                                                            key={todo.id}/>
                                                    </div>)}
                                    <div className = "insert">
                                        <sapn><i style = {{marginLeft: '1.4%',verticalAlign:'text-top' }} className="fas fa-plus fa-2x"></i></sapn>
                                        <div className = "checkListInput">
                                            <input 
                                                type="text"
                                                onChange={this.onTodoChange.bind(this)} 
                                                style = {{marginLeft: '5%'}} 
                                                value = {this.state.todo} 
                                                placeholder="체크리스트 아이템 추가하기"
                                                onKeyPress={this.onKeypress.bind(this)} 
                                                autoFocus/>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </>
        )
    }
}
export default Setting;

