import React, { Component } from "react";
import update from "react-addons-update";
import KanbanBoard from "./KanbanBoard";
import Navigator from "../../navigator/Navigator";
import TopBar from "../topBar/TopBar";
import data from "./data.json";
import "./KanbanMain.scss";

import ScrollContainer from "react-indiana-drag-scroll";

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
      no: this.state.taskList[TaskListIndex].tasks.length + 1,
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
  callbackCopyTask(taskListId, taskId) {
    const TaskListIndex = this.state.taskList.findIndex(
      (taskList) => taskList.no === taskListId
    );

    const TaskIndex = this.state.taskList[TaskListIndex].tasks.findIndex(
      (task) => task.no === taskId
    );

    let newTask = {
      no: this.state.taskList[TaskListIndex].tasks.length + Date.now(),
      contents: this.state.taskList[TaskListIndex].tasks[TaskIndex].contents,
      todoList: this.state.taskList[TaskListIndex].tasks[TaskIndex].todoList,
      tag: this.state.taskList[TaskListIndex].tasks[TaskIndex].tag,
      startDate: this.state.taskList[TaskListIndex].tasks[TaskIndex].startDate,
      endDate: this.state.taskList[TaskListIndex].tasks[TaskIndex].endDate,
      checked: this.state.taskList[TaskListIndex].tasks[TaskIndex].checked,
      label: this.state.taskList[TaskListIndex].tasks[TaskIndex].label,
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

  // task 완료 체크
  callbackDoneTask(taskListId, taskId, checked) {
    const TaskListIndex = this.state.taskList.findIndex(
      (taskList) => taskList.no === taskListId
    );

    const TaskIndex = this.state.taskList[TaskListIndex].tasks.findIndex(
      (task) => task.no === taskId
    );

    let newTaskList = update(this.state.taskList, {
      [TaskListIndex]: {
        tasks: {
          [TaskIndex]: {
            checked: { $set: !checked },
          },
        },
      },
    });
    this.setState({
      taskList: newTaskList,
    });
  }

  // task list 추가
  callbackAddTaskList(taskListTitle) {
    let newTaskList = {
      no: Date.now(),
      title: taskListTitle,
      tasks: [],
    };

    let pushTaskList = update(this.state.taskList, {
      $push: [newTaskList],
    });

    this.setState({
      taskList: pushTaskList,
    });
  }

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

  // todo 체크
  callbackTodoCheck(taskListId, taskId, todoId, checked) {
    const TaskListIndex = this.state.taskList.findIndex(
      (taskList) => taskList.no === taskListId
    );

    const TaskIndex = this.state.taskList[TaskListIndex].tasks.findIndex(
      (task) => task.no === taskId
    );

    const TodoIndex = this.state.taskList[TaskListIndex].tasks[
      TaskIndex
    ].todoList.findIndex((todo) => todo.id === todoId);

    let newTaskList = update(this.state.taskList, {
      [TaskListIndex]: {
        tasks: {
          [TaskIndex]: {
            todoList: {
              [TodoIndex]: {
                checked: { $set: !checked },
              },
            },
          },
        },
      },
    });
    this.setState({
      taskList: newTaskList,
    });
  }

  //todo 추가하기
  callbackAddTodo(text, taskNo, taskListNo){
    const taskListIndex = this.state.taskList.findIndex(taskList => taskList.no == taskListNo)
    const taskIndex = this.state.taskList[taskListIndex].tasks.findIndex(task => task.no == taskNo)

    const checkListLength = this.state.taskList[taskListIndex].tasks[taskIndex].todoList.length
    
    let newTodoList = {
      id:  checkListLength + 1,
      text: text,
      checked: false
    }
    
    let newTaskList = update(this.state.taskList, {
      [taskListIndex] : {
        tasks : {
          [taskIndex] : {
            todoList:{
              $push:[newTodoList]
            },
          },
        },
      },
    });

    this.setState({
      taskList:newTaskList
    })

  }

  //task에 tag 추가하기
  callbackAddTag(tagNo, tagName, taskListNo, taskNo){
    const taskListIndex = this.state.taskList.findIndex(taskList => taskList.no == taskListNo)
    const taskIndex = this.state.taskList[taskListIndex].tasks.findIndex(task => task.no == taskNo)

    
    const checkListLength = this.state.taskList[taskListIndex].tasks[taskIndex].tag.length
    console.log("KanbanMain : " + checkListLength)
    
    let newTag = {
      id:  tagNo,
      name: tagName,
      color: "RGB(255, 160, 160)"
    }

    let newTagData = update(this.state.taskList, {
      [taskListIndex] : {
        tasks : {
          [taskIndex] : {
            tag:{
              $push : [newTag]
            },
          },
        },
      }
    });

    this.setState({
      taskList:newTagData
    })

    console.log(this.state.taskList[taskListIndex].tasks[taskIndex].tag)

  }
  render() {
    return (
      <ScrollContainer
        className="scroll-container"
        hideScrollbars={false}
        ignoreElements=".navibar, .topBar, .input-group, .taskPanel, .addTaskListBtn, .task, .project-setting-dialog"
        >
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
                  add: this.callbackAddTask.bind(this), // task 추가
                  delete: this.callbackDeleteTask.bind(this), // task 삭제
                  copy: this.callbackCopyTask.bind(this), // task 복사
                  doneTask: this.callbackDoneTask.bind(this), // task 완료 체크
                  addList: this.callbackAddTaskList.bind(this), // taskList 추가
                  deleteList: this.callbackDeleteTaskList.bind(this), // taskList 삭제
                  todoCheck: this.callbackTodoCheck.bind(this), // todo 체크
                  addtodo: this.callbackAddTodo.bind(this),
                  addtag: this.callbackAddTag.bind(this)
                }}
              />
            </div>
          </div>
        </div>
      </ScrollContainer>
    );
  }
}

export default KanbanMain;
