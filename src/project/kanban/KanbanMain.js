import React, { Component } from "react";
import update from "react-addons-update";
import KanbanBoard from "./KanbanBoard";
import Navigator from "../../navigator/Navigator";
import TopBar from "../topBar/TopBar";
import data from "./data.json";
import "./KanbanMain.scss";
import ScrollContainer from "react-indiana-drag-scroll";
import { DragDropContext } from "react-beautiful-dnd";
import ApiService from '../../ApiService';

class KanbanMain extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      taskList: data.alltaskList,
      url: "",
      
    };
  }

  // Drag and Drop  
  onDragEnd = (result) =>{

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
    if(type === 'column'){
      const newTaskList = Array.from(this.state.taskList);
      newTaskList.splice(source.index, 1);
      newTaskList.splice(destination.index, 0, this.state.taskList[source.index]);
      this.setState({
        taskList:newTaskList
      })
      return;
    }

    // 출발한 list의 인덱스 번호와 도착한 list의 인덱스 번호를 저장
    let startIndex = 0;
    let finishIndex = 0;
    this.state.taskList.map((taskList,index) => taskList.no === source.droppableId ? startIndex = index: null)
    this.state.taskList.map((taskList,index) => taskList.no === destination.droppableId ? finishIndex = index: null)

    // 위의 인덱스를 가지고 출발list, 도착list를 생성
    const start = this.state.taskList[startIndex];
    const finish = this.state.taskList[finishIndex];

    /* 같은 목록에서의 Task 이동 */
    if(start === finish) {
      // tasks 가공
      const newTasks = Array.from(start.tasks);
      newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, this.state.taskList[startIndex].tasks[source.index]);

      let newTaskList = update(this.state.taskList, {
        [startIndex] : {
          tasks:{
            $set : newTasks
          }
        }
      });
 
      this.setState({
        taskList : newTaskList
      });
      return;
    }

    /* 한 목록에서 다른 목록으로 이동 */

    // 출발 tasks 가공
    const startTasks = Array.from(start.tasks);
    startTasks.splice(source.index,1);
  
    // 도착 tasks 가공
    const finishTasks = Array.from(finish.tasks);
    finishTasks.splice(destination.index, 0, this.state.taskList[startIndex].tasks[source.index]);


    let newTaskList = update(this.state.taskList, {
      [startIndex] : {
        tasks:{
          $set : startTasks
        }
      },
      [finishIndex] : {
        tasks:{
          $set : finishTasks
        }
      }
      
    });

    this.setState({
      taskList:newTaskList
    });

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
  callbackDoneTask(taskListId, taskId, checked,) {
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
              <DragDropContext onDragEnd={this.onDragEnd} onDragStart={this.onDragStart}>
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
                // isDropDisabled={this.state.isDropDisabledType}
              />
              </DragDropContext>
            </div>
          </div>
        </div>
      </ScrollContainer>
    );
  }
  componentDidMount() {
    ApiService.fetchKanbanMain()
      .then(response => {
        this.setState({
          projects: response.data.data
        })
      })
  }
}

export default KanbanMain;
