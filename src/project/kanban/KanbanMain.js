import React, { Component } from "react";
import update from "react-addons-update";
import KanbanBoard from "./KanbanBoard";
import Navigator from "../../navigator/Navigator";
import TopBar from "../topBar/TopBar";
import "./KanbanMain.scss";
import ScrollContainer from "react-indiana-drag-scroll";
import { DragDropContext } from "react-beautiful-dnd";
import ApiService from "../../ApiService";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import Setting from "../kanban/tasksetting/setting/Setting";
import Comment from "../kanban/tasksetting/comment/Comment";
import File from "../kanban/tasksetting/file/File";

const API_URL = "http://localhost:8080/nest";
const API_HEADERS = {
  "Content-Type": "application/json",
};
class KanbanMain extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      taskList: null,
      url: "",
    };
  }

  // Drag and Drop
  onDragEnd = (result) => {
    const { destination, source, type } = result;

    // task의 도착지가 null일 경우
    if (!destination) {
      return;
    }

    // task의 도착지와 출발지가 같을경우
    if (
      destination.draggableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // list 재정렬
    if (type === "column") {
      const newTaskList = Array.from(this.state.taskList);
      newTaskList.splice(source.index, 1);
      newTaskList.splice(
        destination.index,
        0,
        this.state.taskList[source.index]
      );
      this.setState({
        taskList: newTaskList,
      });
      return;
    }

    // 출발한 list의 인덱스 번호와 도착한 list의 인덱스 번호를 저장
    let startIndex = 0;
    let finishIndex = 0;
    this.state.taskList.map((taskList, index) =>
      taskList.taskListNo === source.droppableId ? (startIndex = index) : null
    );
    this.state.taskList.map((taskList, index) =>
      taskList.taskListNo === destination.droppableId
        ? (finishIndex = index)
        : null
    );

    // 위의 인덱스를 가지고 출발list, 도착list를 생성
    const start = this.state.taskList[startIndex];
    const finish = this.state.taskList[finishIndex];

    /* 같은 목록에서의 Task 이동 */
    if (start === finish) {
      // tasks 가공
      const newTasks = Array.from(start.tasks);
      newTasks.splice(source.index, 1);
      newTasks.splice(
        destination.index,
        0,
        this.state.taskList[startIndex].tasks[source.index]
      );

      let newTaskList = update(this.state.taskList, {
        [startIndex]: {
          tasks: {
            $set: newTasks,
          },
        },
      });

      this.setState({
        taskList: newTaskList,
      });
      return;
    }

    /* 한 목록에서 다른 목록으로 이동 */

    // 출발 tasks 가공
    const startTasks = Array.from(start.tasks);
    startTasks.splice(source.index, 1);

    // 도착 tasks 가공
    const finishTasks = Array.from(finish.tasks);
    finishTasks.splice(
      destination.index,
      0,
      this.state.taskList[startIndex].tasks[source.index]
    );

    let newTaskList = update(this.state.taskList, {
      [startIndex]: {
        tasks: {
          $set: startTasks,
        },
      },
      [finishIndex]: {
        tasks: {
          $set: finishTasks,
        },
      },
    });

    this.setState({
      taskList: newTaskList,
    });
  };

  // 배경화면 변경
  callbackChangeBackground(url) {
    // console.log(url);
    this.setState({
      url: url,
    });
  }

  // task 추가
  callbackAddTask(taskListNo, taskContents) {
    const TaskListIndex = this.state.taskList.findIndex(
      (taskList) => taskList.taskListNo === taskListNo
    );

    let newTask = {
      // no: this.state.taskList[TaskListIndex].tasks.length,
      no: Date.now() + "",
      contents: taskContents,
      checkList: [],
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
  callbackDeleteTask(taskListNo, taskId) {
    const TaskListIndex = this.state.taskList.findIndex(
      (taskList) => taskList.taskListNo === taskListNo
    );

    const TaskIndex = this.state.taskList[TaskListIndex].tasks.findIndex(
      (task) => task.taskNo === taskId
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
  callbackCopyTask(taskListNo, taskId) {
    const TaskListIndex = this.state.taskList.findIndex(
      (taskList) => taskList.taskListNo === taskListNo
    );

    const TaskIndex = this.state.taskList[TaskListIndex].tasks.findIndex(
      (task) => task.taskNo === taskId
    );
    const task = this.state.taskList[TaskListIndex].tasks[TaskIndex];
    let newTask = {
      // tagList: task.tagList,
      // commentList: [],
      taskStart: task.taskStart,
      taskState: task.taskState,
      taskContents: task.taskContents,
      taskNo: null,
      // checkList: task.checkList,
      taskEnd: task.taskEnd,
      taskPoint: task.taskPoint,
      taskLabel: task.taskLabel,
      taskOrder: null,
    };
    fetch(`${API_URL}/api/task/copy`, {
      method: "post",
      headers: API_HEADERS,
      body: JSON.stringify(newTask),
    })
      .then((response) => response.json())
      .then((json) => {
        let newTasks = this.state.taskList[TaskListIndex].tasks;
        newTasks.splice(TaskIndex + 1, 0, {});
        newTasks = update(newTasks, {
          [TaskIndex + 1]: {
            $set: {
              tagList: task.tagList,
              commentList: [],
              taskStart: task.taskStart,
              taskState: task.taskState,
              taskContents: task.taskContents,
              taskNo: json.data.taskNo+"",
              checkList: task.checkList,
              taskEnd: task.taskEnd,
              taskPoint: task.taskPoint,
              taskLabel: task.taskLabel,
              taskOrder: json.data.taskOrder,
            },
          },
        });

        let newTaskList = update(this.state.taskList, {
          [TaskListIndex]: {
            tasks: {
              $set: newTasks,
            },
          },
        });

        this.setState({
          taskList: newTaskList,
        });
      });
  }

  // task 완료 체크
  callbackDoneTask(taskListNo, taskId, checked) {
    const TaskListIndex = this.state.taskList.findIndex(
      (taskList) => taskList.taskListNo === taskListNo
    );

    const TaskIndex = this.state.taskList[TaskListIndex].tasks.findIndex(
      (task) => task.taskNo === taskId
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
  callbackAddTaskList(taskListName,projectNo) {

    let newTaskList = {
      taskListNo: null,
      taskListName: taskListName,
      taskListOrder: null,
      projectNo:projectNo
    };

    fetch(`${API_URL}/api/taskList/add`, {
      method: "post",
      headers: API_HEADERS,
      body: JSON.stringify(newTaskList),
    })
    .then((response) => response.json())
    .then((json) => {
      // console.log(json.data) //taskList 하나

      newTaskList = update(json.data, {
        $set: {
          taskListNo: json.data.taskListNo+"",
          taskListName: json.data.taskListName,
          taskListOrder: json.data.taskListOrder,
          projectNo:json.data.projectNo,
          tasks:[]
        }
      })

      console.log(newTaskList);

      let pushTaskList = update(this.state.taskList, {
        $push: [newTaskList],
      });

      this.setState({
        taskList: pushTaskList,
      });
    })



  }

  // task list 삭제
  callbackDeleteTaskList(taskListNo) {
    const TaskListIndex = this.state.taskList.findIndex(
      (taskList) => taskList.taskListNo === taskListNo
    );

    let newTaskList = update(this.state.taskList, {
      $splice: [[TaskListIndex, 1]],
    });

    this.setState({
      taskList: newTaskList,
    });
  }

  // checkList 체크
  callbackCheckListCheck(taskListNo, taskId, checkListNo, checklistState) {
    const TaskListIndex = this.state.taskList.findIndex(
      (taskList) => taskList.taskListNo === taskListNo
    );

    const TaskIndex = this.state.taskList[TaskListIndex].tasks.findIndex(
      (task) => task.taskNo === taskId
    );

    const ChecklistIndex = this.state.taskList[TaskListIndex].tasks[
      TaskIndex
    ].checkList.findIndex((checkList) => checkList.checklistNo === checkListNo);

    let newTaskList = update(this.state.taskList, {
      [TaskListIndex]: {
        tasks: {
          [TaskIndex]: {
            checkList: {
              [ChecklistIndex]: {
                checklistState: {
                  $set: checklistState === "done" ? "do" : "done",
                },
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

  //checkList 추가하기
  callbackAddCheckList(contents, taskNo, taskListNo) {
    // console.log("contents : " + contents)
    // console.log("taskNo : " + taskNo)
    // console.log("taskListNo : " + taskListNo)
    // console.log(this.state.taskList)
    const taskListIndex = this.state.taskList.findIndex(
      (taskList) => taskList.taskListNo == taskListNo
    );

    const taskIndex = this.state.taskList[taskListIndex].tasks.findIndex(
      (task) => task.taskNo == taskNo
    );

    const checkListLength = this.state.taskList[taskListIndex].tasks[taskIndex]
      .checkList.length;

    let newCheckList = {
      checklistNo: checkListLength + 1,
      checklistContents: contents,
      checklistState: "do",
      taskNo: taskNo,
    };

    let newTaskList = update(this.state.taskList, {
      [taskListIndex]: {
        tasks: {
          [taskIndex]: {
            checkList: {
              $push: [newCheckList],
            },
          },
        },
      },
    });

    this.setState({
      taskList: newTaskList,
    });
  }

  //task에 tag 추가하기
  callbackAddTag(tagNo, tagName, taskListNo, taskNo) {
    const taskListIndex = this.state.taskList.findIndex(
      (taskList) => taskList.taskListNo == taskListNo
    );
    const taskIndex = this.state.taskList[taskListIndex].tasks.findIndex(
      (task) => task.taskNo == taskNo
    );
    // console.log("KanbanMain + " + taskIndex)

    let newTag = {
      tagNo: tagNo,
      tagName: tagName,
      tagColor: "RGB(255, 160, 160)",
    };

    let newTagData = update(this.state.taskList, {
      [taskListIndex]: {
        tasks: {
          [taskIndex]: {
            tagList: {
              $push: [newTag],
            },
          },
        },
      },
    });

    this.setState({
      taskList: newTagData,
    });
  }

  //task에 tag 삭제하기
  callbackDeleteTag(tagNo, taskListNo, taskNo){
    console.log("KanbanMain : "+tagNo + ":" + taskListNo + ":" + taskNo)
    const taskListIndex = this.state.taskList.findIndex(taskList => taskList.taskListNo == taskListNo)
    const taskIndex = this.state.taskList[taskListIndex].tasks.findIndex(task => task.taskNo == taskNo)
    const tagIndex = this.state.taskList[taskListIndex].tasks[taskIndex].tagList.findIndex(
      (tag) => tag.tagNo == tagNo
    )

    let newTaskList = update(this.state.taskList, {
      [taskListIndex] : {
        tasks:{
          [taskIndex] :{
            tagList:{
              $splice : [[tagIndex,1]]
            }
          }
        }
      }
    });

    this.setState({
      taskList: newTaskList,
    });
  }

  //task checkList check 업데이트
  callbackCheckListStateUpdate(
    taskListNo,
    taskNo,
    checklistNo,
    checklistState
  ) {
    const taskListIndex = this.state.taskList.findIndex(
      (taskList) => taskList.taskListNo == taskListNo
    );
    const taskIndex = this.state.taskList[taskListIndex].tasks.findIndex(
      (task) => task.taskNo == taskNo
    );
    const checklistIndex = this.state.taskList[taskListIndex].tasks[
      taskIndex
    ].checkList.findIndex((checklist) => checklist.checklistNo == checklistNo);

    // console.log("KanbanMain + " + checklistIndex + " : " + checklistState)

    let newTaskList = update(this.state.taskList, {
      [taskListIndex]: {
        tasks: {
          [taskIndex]: {
            checkList: {
              [checklistIndex]: {
                checklistState: {
                  $set: checklistState === "done" ? "do" : "done",
                },
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

  //task checkList text 업데이트
  callbackCheckListContentsUpdate(
    taskListNo,
    taskNo,
    checklistNo,
    checklistContents
  ) {
    const taskListIndex = this.state.taskList.findIndex(
      (taskList) => taskList.taskListNo == taskListNo
    );
    const taskIndex = this.state.taskList[taskListIndex].tasks.findIndex(
      (task) => task.taskNo == taskNo
    );
    const checkListIndex = this.state.taskList[taskListIndex].tasks[
      taskIndex
    ].checkList.findIndex((checkList) => checkList.checklistNo == checklistNo);

    let newTaskList = update(this.state.taskList, {
      [taskListIndex]: {
        tasks: {
          [taskIndex]: {
            checkList: {
              [checkListIndex]: {
                checklistContents: {
                  $set: checklistContents,
                },
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

  // comment like 수 증가
  callbackCommentLikeUpdate(taskListNo, taskNo, commentNo) {
    const taskListIndex = this.state.taskList.findIndex(
      (taskList) => taskList.taskListNo == taskListNo
    );
    const taskIndex = this.state.taskList[taskListIndex].tasks.findIndex(
      (task) => task.taskNo == taskNo
    );
    const commentIndex = this.state.taskList[taskListIndex].tasks[
      taskIndex
    ].comments.findIndex((comment) => comment.commentNo == commentNo);

    // console.log(this.state.taskList[taskListIndex].tasks[taskIndex].comments[commentIndex].commentLike)
    let newTaskList = update(this.state.taskList, {
      [taskListIndex]: {
        tasks: {
          [taskIndex]: {
            comments: {
              [commentIndex]: {
                commentLike: {
                  $set:
                    this.state.taskList[taskListIndex].tasks[taskIndex]
                      .comments[commentIndex].commentLike + 1,
                },
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

  //comment contents 수정
  callbackCommentContentsUpdate(
    taskListNo,
    taskNo,
    commentNo,
    commentContents
  ) {
    const taskListIndex = this.state.taskList.findIndex(
      (taskList) => taskList.taskListNo == taskListNo
    );
    const taskIndex = this.state.taskList[taskListIndex].tasks.findIndex(
      (task) => task.taskNo == taskNo
    );
    const commentIndex = this.state.taskList[taskListIndex].tasks[
      taskIndex
    ].comments.findIndex((comment) => comment.commentNo == commentNo);

    // console.log("KanbanMain + " + commentContents)
    let newTaskList = update(this.state.taskList, {
      [taskListIndex]: {
        tasks: {
          [taskIndex]: {
            comments: {
              [commentIndex]: {
                commentContents: {
                  $set: commentContents,
                },
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

  //comment 글 쓰기

  callbackAddComment(commentContents, taskListNo, taskNo){
    const taskListIndex = this.state.taskList.findIndex(taskList => taskList.taskListNo == taskListNo)
    const taskIndex = this.state.taskList[taskListIndex].tasks.findIndex(task => task.taskNo == taskNo)
    const commentLength = this.state.taskList[taskListIndex].tasks[taskIndex].commentList
    // console.log("KanbanMain + " +commentLength)
    
    let newComment = {
      commentNo: commentLength + 1,
      commentRegdate: "2020-05-25",
      commentContents: commentContents,
      commentLike:0,
      userNo:21,
      taskNo:taskNo,
      fileNo:null
    }

    let newTaskList = update(this.state.taskList, {
      [taskListIndex]: {
        tasks: {
          [taskIndex]: {
            commentList: {
              $push: [newComment],
            },
          },
        },
      },
    });

    this.setState({
      taskList: newTaskList,
    });
  }
  render() {
    // console.log("KanbanMain + " + this.props.match.path)
    return (
      <>
      {/* taskSetting 띄우는 route */}
      <Switch>
          <Route 
            path="/nest/kanbanMain/:taskListNo/task/:taskNo" exact
            render={(match) => 
              <Setting 
                {...match}
                taskCallbacks={{
                  checklistCheck: this.callbackCheckListCheck.bind(this), // checklist 체크
                  checklistStateUpdate: this.callbackCheckListStateUpdate.bind(this), // checklist state 업데이트
                  checklistContentsUpdate: this.callbackCheckListContentsUpdate.bind(this), // checklist contents 업데이트
                  addCheckList: this.callbackAddCheckList.bind(this), //업무에 checklist 추가하기
                  addtag: this.callbackAddTag.bind(this), // 업무에 tag 추가하기
                  deletetag:this.callbackDeleteTag.bind(this), //업무에 tag 삭제하기
                }}
                task={this.state.taskList} />} />
          <Route 
            path="/nest/kanbanMain/:taskListNo/task/:taskNo/comment" 
            render={(match) => 
              <Comment 
                  {...match}
                  task={this.state.taskList} 
                  taskCallbacks={{
                    commentLikeUpdate: this.callbackCommentLikeUpdate.bind(this), // 코멘트 좋아요 수 증가하기
                    commentContentsUpdate:this.callbackCommentContentsUpdate.bind(this), //코멘트 내용 업데이트
                    addComment: this.callbackAddComment.bind(this) // 코멘트 글 쓰기
                  }} />} />

          <Route 
            path="/nest/kanbanMain/:taskListNo/task/:taskNo/file" 
            render={(match) => 
              <File 
                {...match} 
                task={this.state.taskList} 
                 />} />    
            </Switch>
      <ScrollContainer
        className="scroll-container"
        hideScrollbars={false}
        ignoreElements=".navibar, .topBar, .input-group, .taskPanel, .addTaskListBtn, .taskListInsertForm, .completeArea, .task, .project-setting-dialog"
        style={{ backgroundImage: `url(${this.state.url})` }}
        >
          <div className="container-fluid kanbanMain">
            <div className="row content ">
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
                <DragDropContext
                  onDragEnd={this.onDragEnd}
                  onDragStart={this.onDragStart}
                >
                  <KanbanBoard
                    tasks={this.state.taskList}
                    taskCallbacks={{
                      add: this.callbackAddTask.bind(this), // task 추가
                      delete: this.callbackDeleteTask.bind(this), // task 삭제
                      copy: this.callbackCopyTask.bind(this), // task 복사
                      doneTask: this.callbackDoneTask.bind(this), // task 완료 체크
                      addList: this.callbackAddTaskList.bind(this), // taskList 추가
                      deleteList: this.callbackDeleteTaskList.bind(this), // taskList 삭제
                      checklistCheck: this.callbackCheckListCheck.bind(this), // checklist 체크
                      checklistStateUpdate: this.callbackCheckListStateUpdate.bind(
                        this
                      ), // checklist check 업데이트
                      checklistTextUpdate: this.callbackCheckListContentsUpdate.bind(
                        this
                      ), // checklist contents 업데이트
                      addchecklist: this.callbackAddCheckList.bind(this), //업무에 checklist 추가하기
                      addtag: this.callbackAddTag.bind(this), // 업무에 tag 추가하기
                      deletetag: this.callbackDeleteTag.bind(this), //업무에 tag 삭제하기
                      commentLikeUpdate: this.callbackCommentLikeUpdate.bind(
                        this
                      ), // 코멘트 좋아요 수 증가하기
                      commentContentsUpdate: this.callbackCommentContentsUpdate.bind(
                        this
                      ), //코멘트 내용 업데이트
                      addComment: this.callbackAddComment.bind(this), // 코멘트 글 쓰기
                    }}
                  />
                </DragDropContext>
              </div>
            </div>
          </div>
        </ScrollContainer>
      </>
    );
  }

  componentDidMount() {
    ApiService.fetchKanbanMain().then((response) => {
      this.setState({
        taskList: response.data.data.allTaskList,
      });
    });
  }
}

export default KanbanMain;
