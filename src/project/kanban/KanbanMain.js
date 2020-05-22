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
      // no: this.state.taskList[TaskListIndex].tasks.length,
      no:Date.now()+"",
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
      no: this.state.taskList[TaskListIndex].tasks.length + Date.now() + "",
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
  callbackDoneTask(taskListId, taskId, checked, index, firstTrueIndex) {
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
    console.log("=========")
    console.log(newTaskList[TaskListIndex].tasks);
    console.log("taskListId : " + taskListId);
    console.log("taskId : " + taskId);
    console.log("index : " + index );
    console.log("TaskIndex : " + TaskIndex );
    console.log("checked : " + checked);
    console.log("firstTrueIndex : " + firstTrueIndex);


    newTaskList[TaskListIndex].tasks.splice(index, 1);
    newTaskList[TaskListIndex].tasks.splice(firstTrueIndex, 0,this.state.taskList[TaskListIndex].tasks[TaskIndex]);
    

    // newTaskList[TaskListIndex].tasks.splice(0, 1);
    // newTaskList[TaskListIndex].tasks.splice(3, 0,newTaskList[1].tasks[0]);
    

    // console.log(newTaskList[TaskListIndex].tasks);
    this.setState({
      taskList: newTaskList,
    });

    this.test(TaskListIndex, TaskIndex)

  }
  
  test(TaskListIndex, TaskIndex){
    console.log(this.state.taskList[TaskListIndex].tasks)
    console.log("////////")
  }
  // task list 추가
  callbackAddTaskList(taskListTitle) {
    let newTaskList = {
      no: Date.now()+"",
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

  }

  //task에 tag 삭제하기
  callbackDeleteTag(tagNo, taskListNo, taskNo){
    const taskListIndex = this.state.taskList.findIndex(taskList => taskList.no == taskListNo)
    const taskIndex = this.state.taskList[taskListIndex].tasks.findIndex(task => task.no == taskNo)
    const tagIndex = this.state.taskList[taskListIndex].tasks[taskIndex].tag.findIndex(
      (tag) => tag.id == tagNo
    )

    let newTaskList = update(this.state.taskList, {
      [taskListIndex] : {
        tasks:{
          [taskIndex] :{
            tag:{
              $splice : [[tagIndex,1]]
            }
          }
        }
      }
    });

    this.setState({
      taskList:newTaskList
    })

  }

  //task todo check 업데이트
  callbackTodoCheckUpdate(taskListNo, taskNo, todoId, todoCheck) {
    const taskListIndex = this.state.taskList.findIndex(taskList => taskList.no == taskListNo)
    const taskIndex = this.state.taskList[taskListIndex].tasks.findIndex(task => task.no == taskNo)
    const todoIndex = this.state.taskList[taskListIndex].tasks[taskIndex].todoList.findIndex(todo => todo.id == todoId)

    console.log("KanbanMain + " + todoIndex + " : " + todoCheck)

    let newTaskList = update(this.state.taskList, {
      [taskListIndex] : {
        tasks:{
          [taskIndex]:{
            todoList :{
              [todoIndex] :{
                checked : {
                  $set : !todoCheck
                } 
              }
            }
          }
        }
      }
    });

    this.setState({
      taskList:newTaskList
    })
  }

  //task todo text 업데이트
  callbackTodoTextUpdate(taskListNo, taskNo, todoId, text){
    const taskListIndex = this.state.taskList.findIndex(taskList => taskList.no == taskListNo)
    const taskIndex = this.state.taskList[taskListIndex].tasks.findIndex(task => task.no == taskNo)
    const todoIndex = this.state.taskList[taskListIndex].tasks[taskIndex].todoList.findIndex(todo => todo.id == todoId)

    let newTaskList = update(this.state.taskList, {
      [taskListIndex] : {
        tasks:{
          [taskIndex]:{
            todoList :{
              [todoIndex] :{
                text : {
                  $set : text
                } 
              }
            }
          }
        }
      }
    });

    this.setState({
      taskList:newTaskList
    })
  }


  // Drag and Drop
  onDragEnd = (result) =>{
    const { destination, source, draggableId , type} = result;

    // console.log(destination); // 도착 인덱스
    // console.log(source); // 출발 인덱스
    // console.log("draggableId : " + draggableId);

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
    if(type === 'column'){
      const newColumnOrder = Array.from(this.state.columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      const newState= {
        ...this.state,
        columnOrder:newColumnOrder
      };
      this.setState(newState)
      return;
    }

    // data.json에서 원하는 taskList의 아이디를 찾음
    const start = this.state.columns[source.droppableId];
    const finish = this.state.columns[destination.droppableId];

    if(start === finish) {
      // 기존 task의 배열을 가져옴
      const newTaskIds = Array.from(start.taskIds);
      // taskList에서 출발된 인덱스를 찾아 지움
      newTaskIds.splice(source.index, 1);
      // 도착한 인덱스에 삭제 없이 이동한 task의 아이디를 추가
      newTaskIds.splice(destination.index, 0, draggableId);

      // 새로운 taskList를 만듬
      const newColumn = {
        // 기존 taskList를 가져오고
        ...start,
        // taskList의 순서배열을 덮어 씌움
        taskIds: newTaskIds,
      };

      // 새로운 state를 만듬
      const newState = {
        ...this.state,
        columns: {
          ...this.state.columns,
          [newColumn.id]: newColumn,
        },
      };

      this.setState(newState);
      return;
    }

    /* 한 목록에서 다른 목록으로 이동 */
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index,1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0 , draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    const newState = {
      ...this.state,
      columns:{
        ...this.state.columns,
        [newStart.id] : newStart,
        [newFinish.id] : newFinish,
      },
    };
    this.setState(newState);

  // comment like 수 증가
  callbackCommentLikeUpdate(taskListNo, taskNo, commentNo){
    const taskListIndex = this.state.taskList.findIndex(taskList => taskList.no == taskListNo)
    const taskIndex = this.state.taskList[taskListIndex].tasks.findIndex(task => task.no == taskNo)
    const commentIndex = this.state.taskList[taskListIndex].tasks[taskIndex].comments.findIndex(comment => comment.commentNo == commentNo)

    // console.log(this.state.taskList[taskListIndex].tasks[taskIndex].comments[commentIndex].commentLike)
    let newTaskList = update(this.state.taskList, {
      [taskListIndex] : {
        tasks : {
          [taskIndex] : {
            comments : {
              [commentIndex] : {
                commentLike: {
                  $set : this.state.taskList[taskListIndex].tasks[taskIndex].comments[commentIndex].commentLike + 1
                }
              }
            }
          }
        }
      }
    })

    this.setState({
      taskList:newTaskList
    })
  }

  //comment contents 수정
  callbakcCommentContentsUpdate(taskListNo, taskNo, commentNo, commentContents){
    const taskListIndex = this.state.taskList.findIndex(taskList => taskList.no == taskListNo)
    const taskIndex = this.state.taskList[taskListIndex].tasks.findIndex(task => task.no == taskNo)
    const commentIndex = this.state.taskList[taskListIndex].tasks[taskIndex].comments.findIndex(comment => comment.commentNo == commentNo)

    console.log("KanbanMain + " + commentContents)
    let newTaskList = update(this.state.taskList, {
      [taskListIndex] : {
        tasks : {
          [taskIndex] : {
            comments : {
              [commentIndex] : {
                commentContents: {
                  $set : commentContents
                }
              }
            }
          }
        }
      }
    })

    this.setState({
      taskList:newTaskList
    })
    

  }
  render() {

    return (
      <ScrollContainer
        className="scroll-container"
        hideScrollbars={false}
        ignoreElements=".navibar, .topBar, .input-group, .taskPanel, .addTaskListBtn, .taskListInsertForm, .completeArea, .task, .project-setting-dialog"
        style={{ backgroundImage: `url(${this.state.url})` }}
        >
        <div className="container-fluid kanbanMain">
          <div
            className="row content "
            
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
                  todoCheckUpdate: this.callbackTodoCheckUpdate.bind(this), // todo check 업데이트
                  todoTextUpdate: this.callbackTodoTextUpdate.bind(this), // todo text 업데이트
                  addtodo: this.callbackAddTodo.bind(this), //업무에 todo 추가하기
                  addtag: this.callbackAddTag.bind(this), // 업무에 tag 추가하기
                  deletetag:this.callbackDeleteTag.bind(this), //업무에 tag 삭제하기
                  commentLikeUpdate: this.callbackCommentLikeUpdate.bind(this), // 코멘트 좋아요 수 증가하기
                  commentContentsUpdate:this.callbakcCommentContentsUpdate.bind(this), //코멘트 내용 업데이트
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
