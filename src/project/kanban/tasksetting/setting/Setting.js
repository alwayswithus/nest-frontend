import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import './Setting.scss';
import Important from './Important';
import Header from '../file/Header';
import ModalCalendar from '../../../../modalCalendar/ModalCalendar';
import CheckList from './CheckList';
import ColorPicker from './ColorPicker';
import TagModal from './TagModal';
import update from "react-addons-update";
import ApiService from '../../../../ApiService'

const API_URL = "http://localhost:8080/nest";
const API_HEADERS = {
    'Content-Type' : 'application/json'
}

class Setting extends Component {
    constructor (){
        super(...arguments)
        this.state ={
            open:false, // 캘린더 모달
            checklist:'',
            tags:null,
            closeValue:false, // 태그 모달
            closeTag: false, // 새태그만들기 모달
        }
    }
    onOpenCalendar() {
        this.setState({
            open:!this.state.open
        })
    };

    //업무등록 onChange
    onChecklistChange(event){
        this.setState({
            checklist:event.target.value
        })
    }
    
    // 업무등록
    onKeypress(event){
        if(event.key === 'Enter'){
            event.preventDefault()
            this.props.taskCallbacks.addCheckList(event.target.value, this.props.match.params.taskNo, this.props.match.params.taskListNo)
            this.setState({
                checklist:''
            })
        }
    }

    //click check box
    clickCheckBox(checklistNo, checklistState){
        this.props.taskCallbacks.checklistStateUpdate(this.props.match.params.taskListNo, this.props.match.params.taskNo, checklistNo, checklistState);
    }
    
    //태그 + 버튼 클릭.(모달창 띄우기)
    onClickTag(){
        this.setState({
            closeValue:!this.state.closeValue
        })
        var array = [...this.props.taskTagNo]
        this.props.taskCallbacks.updateTaskTag(array, this.props.task, this.props.match.params.taskListNo, this.props.match.params.taskNo)
    }

    onClickCalendar(){
        console.log(this.state.open)
        this.setState({
            open:!this.state.open
        })
    }

    

    onSetStateTaskTagNo(array){
        this.setState({
            taskTagNo:array
        })
    }
    //새태그 만들기 click
    onClicknewTagModal(){
        this.setState({
            closeTag:!this.state.closeTag
        })
        this.onClickTag()
    }

    //새 태그 만들기
    callbackAddTags(tagName){
        console.log("Setting : " + tagName)
        
        let newTag = {
            tagNo : null,
            tagName : tagName,
            tagColor: '#FFE0E0'
        }

        fetch(`${API_URL}/api/taglist/add`, {
            method:'post',
            headers:API_HEADERS,
            body:JSON.stringify(newTag)
        })
        .then((response) => response.json())
        .then((json) => {
            let newTags= update(this.state.tags, {
                $push : [json.data]
            })
            this.setState({
                tags:newTags
            })
        })

    }

    callbackDeleteTags(tagNo){
        console.log("!!!!" + tagNo)

        const tagIndex = this.state.tags.findIndex(tag => tag.tagNo === tagNo);
        fetch(`${API_URL}/api/taglist/delete`, {
            method:'delete',
            headers:API_HEADERS,
            body:tagNo
        })
        .then((response) => response.json())
        .then((json) => {
            let newTags= update(this.state.tags, {
                $splice : [[tagIndex,1]]
            })
            this.setState({
                tags:newTags
            })
        })
    }
    render() {

        if(!this.props.task){
            return <></>;
        }
        const taskList = this.props.task;
        const taskListIndex = taskList.findIndex(taskList => taskList.taskListNo === this.props.match.params.taskListNo);
        const taskIndex = taskList[taskListIndex].tasks.findIndex(task => task.taskNo === this.props.match.params.taskNo);
        const taskItem = taskList[taskListIndex].tasks[taskIndex]
        return (
            <div className = "taskSetting-setting">
                <div style={{ height: '100%', marginTop: '-49px', position: 'absolute', right: '0', zIndex: '999'}}>
                    {/* 업무속성 헤더 */}
                    <div style={{ float: 'right' }}>
                        <Header 
                            name='김우경' 
                            date='2020.05.06' 
                            taskContents = {taskItem.taskContents}
                            projectNo={this.props.projectNo}
                            params={this.props.match.params}/>
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
                                    <Button variant="" onClick={this.onOpenCalendar.bind(this)}> 
                                    <b className="taskDate">{!taskItem.taskStart && !taskItem.taskEnd && <i className="fas fa-plus fa-1x"></i>}
                                        {taskItem.taskStart && !taskItem.taskEnd && `${taskItem.taskStart} ~`}
                                        {taskItem.taskStart && taskItem.taskEnd && `${taskItem.taskStart} ~ ${taskItem.taskEnd}`}
                                    </b>  </Button>
                                    <div style={{position:'relative', marginLeft:'20%', right: '198px'}}>
                                    <ModalCalendar open={this.state.open}
                                    onClickCalendar={this.onClickCalendar.bind(this)}
                                    from = {taskItem.taskStart}
                                    to = {taskItem.taskEnd}/>
                                    </div>
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
                                        <img src="/nest/assets/images/unnamed.jpg" className="img-circle" alt="Cinque Terre" />
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
                                            closeValue = {this.state.closeValue} // 태그 모달 띄우는 상태변수
                                            closeTag = {this.state.closeTag} // 새 태그 만들기 모달 띄우는 상태 변수
                                            onClickTag={this.onClickTag.bind(this, taskItem)} // 태그 모달 띄우는 함수
                                            onClicknewTagModal = {this.onClicknewTagModal.bind(this)} // 새 태그 만들기 모달 띄우는 함수
                                            key={this.props.task.taskNo} 
                                            taskListNo = {this.props.match.params.taskListNo}
                                            taskNo = {this.props.match.params.taskNo}
                                            taskItem = {taskItem}
                                            taskTagNo={this.state.taskTagNo} //task tagNo 배열.
                                            tags = {this.state.tags}
                                            taskTagNo = {this.props.taskTagNo}
                                            taskCallbacks={this.props.taskCallbacks}
                                            settingTagCallbakcs={{
                                                add:this.callbackAddTags.bind(this),
                                                delete: this.callbackDeleteTags.bind(this)
                                            }} />
                                    </div>
                                </div>

                                {/* tag List */}
                                <div style={{ display: 'inline-block' }} className = "TagList">
                                    {taskItem.tagList.map(tag => 
                                        <div key={tag.tagNo} style={{ display: 'inline-block' }} className = "tag">
                                            <span className="label label-default tagLabel" style={{backgroundColor:`${tag.tagColor}`, fontSize:'1.25rem', cursor:'default'}}>{tag.tagName}</span>
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
                                <div style={{ display: 'inline-block' }}> <ColorPicker style={{transForm: 'scale(0.5)'}}/></div>
                            </li>

                            {/* 하위 할일 */}
                            <li className="taskSettingList">
                                <div className="checkList">
                                    {taskItem.checkList && taskItem.checkList.map(checklist =>
                                        <div key={checklist.checklistNo} className="inner-checklist">
                                                <input type="checkbox" className="doneCheck" checked={checklist.checklistState === "done"} onClick={this.clickCheckBox.bind(this,checklist.checklistNo, checklist.checklistState)} readOnly></input>
                                                    <div style={{borderLeft:'3px solid #F8BCB6'}}/>
                                                        <CheckList 
                                                            params={{
                                                                taskListNo : this.props.taskListNo, 
                                                                taskNo : taskItem.taskNo}} 
                                                                taskCallbacks={this.props.taskCallbacks} 
                                                                checklist={checklist} 
                                                                key={checklist.checklistNo}/>
                                                    </div>)}
                                    <div className = "insert">
                                        <button>
                                            <i style = {{marginLeft: '40%'}} className="fas fa-plus fa-2x"></i>
                                        </button>
                                        <div className = "checkListInput">
                                            <input 
                                                type="text"
                                                onChange={this.onChecklistChange.bind(this)} 
                                                style = {{marginLeft: '5%'}} 
                                                value = {this.state.checklist} 
                                                placeholder='체크리스트 아이템 추가하기'
                                                onKeyPress={this.onKeypress.bind(this)} 
                                                autoFocus/>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }

    componentDidMount(){
        ApiService.fetchTagList()
            .then(response => {
                this.setState({
                    tags:response.data.data
                })
            })
    }
}
export default Setting;

