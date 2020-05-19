import React, { Component } from "react";
import update from "react-addons-update";
import KanbanBoard from "./KanbanBoard";
import Navigator from "../../navigator/Navigator";
import TopBar from "../topBar/TopBar";
import data from "./data.json";
import "./KanbanMain.scss";

class KanbanMain extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      taskList: data,
      url: "",
    };
  }

  callbackChangeBackground(url) {
    console.log(url);
    this.setState({
      url: url,
    });
  }

  // task 추가
  callbackAddTask(taskListId, taskContents) {
    const TaskListIndex = this.state.taskList.findIndex(
      (taskList) => taskList.no === taskListId
    );

    let newTask = {
      no: this.state.taskList[TaskListIndex].tasks.length+1,
      contents: taskContents,
      todoList: [],
      tag: [],
    };

    let newTaskList = update(this.state.taskList, {
      [TaskListIndex]: {
        tasks: {
          $push: [newTask],
        },
      },
    });

    this.setState({
      taskList: newTaskList,
    });
  }
  // task 삭제
  callbackDeleteTask(taskListId, taskId) {


    const TaskListIndex = this.state.taskList.findIndex(
      (taskList) => taskList.no === taskListId
    );

    const TaskIndex = this.state.taskList[TaskListIndex].tasks.findIndex(
      (task) => task.no === taskId
    );

    let newTaskList = update(this.state.taskList, {
      [TaskListIndex]: {
        tasks: {
          $splice: [[TaskIndex, 1]],
        },
      },
    });
    this.setState({
      taskList: newTaskList,
    });
  }
 
  // task 복사
  callbackCopyTask() {
    console.log("!!");
    
    // const TaskListIndex = this.state.taskList.findIndex(
    //   (taskList) => taskList.no === taskListId
    // );

    // const TaskIndex = this.state.taskList[TaskListIndex].tasks.findIndex(
    //   (task) => task.no === taskId
    // );

    // console.log(TaskListIndex , TaskIndex)

    // let newTask = {
    //   no: this.state.taskList[TaskListIndex].tasks.length,
    //   contents: this.state.taskList[TaskListIndex].tasks[TaskIndex].contents,
    //   todoList: this.state.taskList[TaskListIndex].tasks[TaskIndex].todoList,
    //   tag: this.state.taskList[TaskListIndex].tasks[TaskIndex].tag,
    //   startDate:this.state.taskList[TaskListIndex].tasks[TaskIndex].startDate,
    //   endDate:this.state.taskList[TaskListIndex].tasks[TaskIndex].endDate,
    //   checked:this.state.taskList[TaskListIndex].tasks[TaskIndex].checked,
    //   label:this.state.taskList[TaskListIndex].tasks[TaskIndex].label
    // };

    // let newTaskList = update(this.state.taskList, {
    //   [TaskListIndex]: {
    //     tasks: {
    //       $push: [],
    //     },
    //   },
    // });
    // this.setState({
    //   taskList: newTaskList,
    // });

  }

  // task list 추가
  callbackAddTaskList() {}

  // task list 삭제
  callbackDeleteTaskList(taskListId) {
    const TaskListIndex = this.state.taskList.findIndex(
      (taskList) => taskList.no === taskListId
    );

    let newTaskList = update(this.state.taskList, {
      $splice: [[TaskListIndex, 1]],
    });

    this.setState({
      taskList: newTaskList,
    });
  }
  render() {
    return (
      <div className="container-fluid kanbanMain">
        <div
          className="row content "
          style={{ backgroundImage: `url(${this.state.url})` }}
        >
          {/* 네비게이션바 */}
          <div className="navibar">
            <Navigator
              callbackChangeBackground={{
                change: this.callbackChangeBackground.bind(this),
              }}
            />
          </div>
          {/*상단바*/}
          <TopBar />
          {/* 메인 영역 */}
          <div className="mainArea">
            {/*칸반보드*/}
            <KanbanBoard
              tasks={this.state.taskList}
              taskCallbacks={{
                add: this.callbackAddTask.bind(this),
                delete: this.callbackDeleteTask.bind(this),
                copy: this.callbackCopyTask.bind(this),
                addList: this.callbackAddTaskList.bind(this),
                deleteList: this.callbackDeleteTaskList.bind(this),
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default KanbanMain;
