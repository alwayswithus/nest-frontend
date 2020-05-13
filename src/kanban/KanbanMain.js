import React, { Component } from "react";
import update from "react-addons-update";
import KanbanBoard from "./KanbanBoard";
import Navigator from "../dashboard/navigator/Navigator";
import TopBar from "./topBar/TopBar";
import data from "./data.json";
import "./KanbanMain.scss";

class KanbanMain extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      taskList: data,
    };
  }

  callbackAddTask(taskListId, taskContents) {
    const TaskListIndex = this.state.taskList.findIndex(
      (taskList) => taskList.no == taskListId
    );

    let newTask = {
      no: this.state.taskList[TaskListIndex].tasks.length,
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
  callbackDeleteTaskList(taskListId) {
    const TaskListIndex = this.state.taskList.findIndex(
      (taskList) => taskList.no == taskListId
    );
    let newTaskList = update(this.state.taskList, {
      $splice: [[TaskListIndex, 1]],
    });
    console.log(newTaskList);

    this.setState({
      taskList: newTaskList,
    });
  }
  render() {
    return (
      <div className="container-fluid kanbanMain">
        <div className="row content ">
          {/* 네비게이션바 */}
          <div className="navibar">
            <Navigator />
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
                delete: this.callbackDeleteTaskList.bind(this),
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default KanbanMain;
