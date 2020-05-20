import React, { Component } from "react";
import ReactTooltip from "react-tooltip";
import Task from "./Task";
import DragonDrop from "drag-on-drop";

import "./TaskList.scss";

class TaskList extends Component {
  // constructor() {
  //   super(...arguments);
  //   this.state = {
  //     title: this.props.taskList.title,
  //     keyword: this.props.taskList.title,
  //     showEditNameInput: false,
  //     viewTaskInsertArea: false,
  //     taskInsertState: false,
  //     taskContents: "",
  //     oldTaskListName: "",
  //     showComplete: false,
  //   };
  // }

  // // Task List 이름 수정(input 태그) 상태 변경
  // editNameInputState() {
  //   this.setState({
  //     showEditNameInput: !this.state.showEditNameInput,
  //     oldTaskListName: this.state.keyword,
  //   });
  // }

  // // Task List 이름 수정시 글자 수 limit
  // onInputChanged(event) {
  //   this.setState({
  //     keyword: event.target.value.substr(0, 13),
  //   });
  // }

  // // Task List 이름 수정시 엔터키로 수정
  // onInputKeyPress(event) {
  //   if (event.key === "Enter") {
  //     this.editNameInputState();
  //   }
  // }

  // // Task List 이름 수정 취소 버튼
  // listEditCancel() {
  //   this.setState({
  //     keyword: this.state.oldTaskListName,
  //   });
  //   this.editNameInputState();
  // }

  // // Task, List 영역 UI 상태
  // showTaskInsertArea() {
  //   this.setState({
  //     taskInsertState: !this.state.taskInsertState,
  //   });
  // }

  // // Task List, Task 입력 이벤트
  // onTextAreaChanged(event) {
  //   this.setState({
  //     taskContents: event.target.value,
  //   });
  // }

  // // taskList 삭제
  // deleteTaskList() {
  //   if (window.confirm("업무 목록을 삭제하시겠습니까?")) {
  //     this.props.taskCallbacks.deleteList(this.props.taskList.no);
  //     this.setState({
  //       keyword: this.props.taskList.title,
  //     });
  //   }
  // }

  // // task 추가
  // addTask() {
  //   this.props.taskCallbacks.add(
  //     this.props.taskList.no,
  //     this.state.taskContents
  //   );
  //   this.setState({
  //     taskContents: "",
  //   });
  //   this.showTaskInsertArea();
  // }

  // // 완료된 Task List 목록 상태
  // showCompleteTaskList() {
  //   this.setState({
  //     showComplete: !this.state.showComplete,
  //   });
  // }


   componentDidUpdate() {
    const { dragonDrop } = this.state;
    // this public method allows dragon drop to
    // reassess the updated items and handles
    dragonDrop.initElements(this.dragon);
  }

  render() {
    return (
      <div className="dragon" ref={(el) => (this.dragon = el)}>
        
      <button>AA</button>
   
      <button>비비</button>
    
      <button>**</button>
    
  </div>
    );
  }
  componentDidMount() {
    this.setState({
      dragonDrop: new DragonDrop(this.dragon),
    });
  }
}

export default TaskList;
