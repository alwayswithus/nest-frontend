import React, { Component } from "react";
import update from "react-addons-update";
import KanbanBoard from "./KanbanBoard";
import Navigator from "../../navigator/Navigator";
import TopBar from "../topBar/TopBar";
import "./KanbanMain.scss";
import ScrollContainer from "react-indiana-drag-scroll";
import { DragDropContext } from "react-beautiful-dnd";
import ApiService from "../../ApiService";
import { Route, Switch } from "react-router-dom";
import Setting from "../kanban/tasksetting/setting/Setting";
import Comment from "../kanban/tasksetting/comment/Comment";
import File from "../kanban/tasksetting/file/File";
import moment, { now }  from 'moment';

const API_URL = "http://localhost:8080/nest";
const API_HEADERS = {
  "Content-Type": "application/json",
};
class KanbanMain extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      taskList: null,
      authUserRole:null,
      projectTitle:null,
      // url: window.sessionStorage.getItem("authUserBg"),
      taskTagNo:[], //task tag의 no만 모아둔 배열
      modalState:false,
      taskMemberState: false, //task memer modal 상태변수
      point: null, // 업무 중요도 상태변수
      tagModal:false, // 태그 모달 상태변수
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
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // list 재정렬
    if (type === "column") {
      let newTaskList = Array.from(this.state.taskList);
      newTaskList.splice(source.index, 1);
      newTaskList.splice(
        destination.index,
        0,
        this.state.taskList[source.index]
      );

      const endTaskList = this.state.taskList[destination.index];

      newTaskList.map((taskList, index) => {
        if (source.index <= index && destination.index > index) {
          newTaskList = update(newTaskList, {
            [index]: {
              taskListOrder: { $set: taskList.taskListOrder - 1 },
            },
          });
        }
        if (source.index >= index && destination.index < index) {
          newTaskList = update(newTaskList, {
            [index]: {
              taskListOrder: { $set: taskList.taskListOrder + 1 },
            },
          });
        }
      });
      newTaskList = update(newTaskList, {
        [destination.index]: {
          taskListOrder: { $set: endTaskList.taskListOrder },
        },
      });

      fetch(`${API_URL}/api/taskList/reOrder`, {
        method: "post",
        headers: API_HEADERS,
        body: JSON.stringify(newTaskList),
      });

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

      newTasks.map((task, index) => {
        if (source.index <= index && destination.index > index) {
          newTaskList = update(newTaskList, {
            [startIndex]: {
              tasks: {
                [index]: {
                  taskOrder: { $set: task.taskOrder + 1 },
                },
              },
            },
          });
        }
        if (source.index >= index && destination.index < index) {
          newTaskList = update(newTaskList, {
            [startIndex]: {
              tasks: {
                [index]: {
                  taskOrder: { $set: task.taskOrder - 1 },
                },
              },
            },
          });
        }
      });
      newTaskList = update(newTaskList, {
        [finishIndex]: {
          tasks: {
            [destination.index]: {
              taskOrder: { $set: finish.tasks[destination.index].taskOrder },
            },
          },
        },
      });

      fetch(`${API_URL}/api/task/reOrder/sameList`, {
        method: "post",
        headers: API_HEADERS,
        body: JSON.stringify(newTaskList[startIndex].tasks),
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

    newTaskList[startIndex].tasks.map((task, index) => {
      newTaskList = update(newTaskList, {
        [startIndex]: {
          tasks: {
            [index]: {
              taskOrder: {
                $set: newTaskList[startIndex].tasks.length - index,
              },
            },
          },
        },
      });
    });

    newTaskList[finishIndex].tasks.map((task, index) => {
      newTaskList = update(newTaskList, {
        [finishIndex]: {
          tasks: {
            [index]: {
              taskOrder: {
                $set: newTaskList[finishIndex].tasks.length - index,
              },
            },
          },
        },
      });
    });
    const reOrder = {
      startTaskListNo: newTaskList[startIndex].taskListNo,
      endTaskListNo: newTaskList[finishIndex].taskListNo,
      startTasks: newTaskList[startIndex].tasks,
      endTasks: newTaskList[finishIndex].tasks,
      reOrderTask: this.state.taskList[startIndex].tasks[source.index].taskNo,
    };

    fetch(`${API_URL}/api/task/reOrder/otherList`, {
      method: "post",
      headers: API_HEADERS,
      body: JSON.stringify(reOrder),
    });

    this.setState({
      taskList: newTaskList,
    });
  };

  // 배경화면 변경
 

  // task 추가
  callbackAddTask(taskListNo, taskContents, projectNo) {
    const TaskListIndex = this.state.taskList.findIndex(
      (taskList) => taskList.taskListNo === taskListNo
    );
    const task = {
      taskOrder:
        this.state.taskList[TaskListIndex].tasks.length === 0
          ? 1
          : this.state.taskList[TaskListIndex].tasks[0].taskOrder + 1,
      taskListNo: taskListNo,
      taskContents: taskContents,
      projectNo: projectNo,
      taskNo: null,
      taskWriter: sessionStorage.getItem("authUserNo")
    };

    fetch(`${API_URL}/api/task/insert`, {
      method: "post",
      headers: API_HEADERS,
      body: JSON.stringify(task),
    })
      .then((response) => response.json())
      .then((json) => {
        let newTask = {
          commentList: [],
          taskStart: json.data.taskStart,
          taskEnd: json.data.taskEnd,
          taskOrder: json.data.taskOrder,
          tagList: [],
          taskState: "do",
          memberList: [],
          taskContents: json.data.taskContents,
          taskNo: json.data.taskNo+"",
          checkList: [],
          taskPoint: json.data.taskPoint,
          taskLabel: json.data.taskLabel,
          fileList: [],
          taskWriter:json.data.taskWriter
        };

        let newTaskList = this.state.taskList;
        newTaskList[TaskListIndex].tasks.splice(0, 0, newTask);

        this.setState({
          taskList: newTaskList,
        });
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

    const taskListLength = newTaskList[TaskListIndex].tasks.length;
    newTaskList[TaskListIndex].tasks.map((task, index) => {
      newTaskList = update(newTaskList, {
        [TaskListIndex]: {
          tasks: {
            [index]: {
              taskOrder: { $set: taskListLength - index },
            },
          },
        },
      });
    });

    const deleteTask = {
      startTasks: newTaskList[TaskListIndex].tasks,
      reOrderTask: taskId,
    };

    fetch(`${API_URL}/api/task/delete`, {
      method: "post",
      headers: API_HEADERS,
      body: JSON.stringify(deleteTask),
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

    let copyTask = {
      tagList: task.tagList,
      memberList: task.memberList,
      originalTaskNo: task.taskNo,
      taskNo: null,
      checkList: task.checkList,
      taskWriter:sessionStorage.getItem("authUserNo"),
    };

    fetch(`${API_URL}/api/task/copy/insert`, {
      method: "post",
      headers: API_HEADERS,
      body: JSON.stringify(copyTask),
    })
      .then((response) => response.json())
      .then((json) => {
        let newTasks = this.state.taskList[TaskListIndex].tasks;
        newTasks.splice(TaskIndex + 1, 0, {});
        newTasks = update(newTasks, {
          [TaskIndex + 1]: {
            $set: {
              commentList: [],
              taskStart: task.taskStart,
              taskEnd: task.taskEnd,
              taskOrder: null,
              tagList: task.tagList,
              taskState: task.taskState,
              memberList: task.memberList,
              taskContents: `${task.taskContents}_copy`,
              taskNo: json.data.taskNo + "",
              checkList: task.checkList,
              taskPoint: task.taskPoint,
              taskLabel: task.taskLabel,
              fileList: [],
              

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

        const taskListLength = newTaskList[TaskListIndex].tasks.length;
        newTaskList[TaskListIndex].tasks.map((task, index) => {
          newTaskList = update(newTaskList, {
            [TaskListIndex]: {
              tasks: {
                [index]: {
                  taskOrder: { $set: taskListLength - index },
                },
              },
            },
          });
        });

        if (newTaskList[TaskListIndex].tasks[TaskIndex].tagList.length !== 0) {
          newTaskList[TaskListIndex].tasks[TaskIndex].tagList.map(
            (tag, index) => {
              newTaskList = update(newTaskList, {
                [TaskListIndex]: {
                  tasks: {
                    [TaskIndex]: {
                      tagList: {
                        [index]: {
                          taskNo: {
                            $set: json.data.taskNo,
                          },
                        },
                      },
                    },
                  },
                },
              });
            }
          );
        }
        if (
          newTaskList[TaskListIndex].tasks[TaskIndex].checkList.length !== 0
        ) {
          newTaskList[TaskListIndex].tasks[TaskIndex].checkList.map(
            (checkList, index) => {
              newTaskList = update(newTaskList, {
                [TaskListIndex]: {
                  tasks: {
                    [TaskIndex]: {
                      checkList: {
                        [index]: {
                          taskNo: {
                            $set: json.data.taskNo,
                          },
                        },
                      },
                    },
                  },
                },
              });
            }
          );
        }

        fetch(`${API_URL}/api/task/reOrder/sameList`, {
          method: "post",
          headers: API_HEADERS,
          body: JSON.stringify(newTaskList[TaskListIndex].tasks),
        });

        console.log(newTaskList);

        this.setState({
          taskList: newTaskList,
        });
      });
  }

  // task 완료 체크
  callbackDoneTask(taskListNo, taskId) {
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
            taskState: { $set: this.state.taskList[TaskListIndex].tasks[TaskIndex].taskState === 'done' ? 'do' : 'done' },
          },
        },
      },
    });

    fetch(`${API_URL}/api/task/state`, {
      method: "post",
      headers: API_HEADERS,
      body: JSON.stringify(newTaskList[TaskListIndex].tasks[TaskIndex]),
    })

    this.setState({
      taskList: newTaskList,
    });
  }

  // task list 추가
  callbackAddTaskList(taskListName, projectNo) {
    let newTaskList = {
      taskListNo: null,
      taskListName: taskListName,
      taskListOrder: null,
      projectNo: projectNo,
    };

    fetch(`${API_URL}/api/taskList/add`, {
      method: "post",
      headers: API_HEADERS,
      body: JSON.stringify(newTaskList),
    })
      .then((response) => response.json())
      .then((json) => {
        newTaskList = update(json.data, {
          $set: {
            taskListNo: json.data.taskListNo + "",
            taskListName: json.data.taskListName,
            taskListOrder: json.data.taskListOrder,
            projectNo: json.data.projectNo,
            tasks: [],
          },
        });

        let pushTaskList = update(this.state.taskList, {
          $push: [newTaskList],
        });

        this.setState({
          taskList: pushTaskList,
        });
      });
  }

  // task list 삭제
  callbackDeleteTaskList(deleteTaskList) {
    let taskListBody = {
      taskListNo: deleteTaskList.taskListNo,
      taskListOrder: deleteTaskList.taskListOrder,
      projectNo: deleteTaskList.projectNo,
    };

    const TaskListIndex = this.state.taskList.findIndex(
      (taskList) => taskList.taskListNo === taskListBody.taskListNo
    );

    fetch(`${API_URL}/api/taskList/delete`, {
      method: "post",
      headers: API_HEADERS,
      body: JSON.stringify(deleteTaskList),
    })
      .then((response) => response.json())
      .then((json) => {
        const deleteTaskListOrderNo = json.data.taskListOrder;
        let newTaskList = this.state.taskList;

        this.state.taskList.map((taskList, index) => {
          if (taskList.taskListOrder > deleteTaskListOrderNo) {
            newTaskList = update(newTaskList, {
              [index]: {
                taskListOrder: { $set: taskList.taskListOrder - 1 },
              },
            });
          }
        });

        newTaskList = update(newTaskList, {
          $splice: [[TaskListIndex, 1]],
        });

        this.setState({
          taskList: newTaskList,
        });
      });
  }

  //checkList 추가하기
  callbackAddCheckList(contents, taskNo, taskListNo) {
    const taskListIndex = this.state.taskList.findIndex((taskList) => taskList.taskListNo === taskListNo);

    const taskIndex = this.state.taskList[taskListIndex].tasks.findIndex((task) => task.taskNo === taskNo);

    let newCheckList = {
      checklistNo: null,
      checklistContents: contents,
      checklistState: "do",
      taskNo: taskNo,
    };

    fetch(`${API_URL}/api/tasksetting/checklist/add`,{
      method:'post',
      headers: API_HEADERS,
      body:JSON.stringify(newCheckList)
    })
    .then(response => response.json())
    .then(json => {
      let newTaskList = update(this.state.taskList, {
        [taskListIndex]: {
          tasks: {
            [taskIndex]: {
              checkList: {
                $push: [json.data],
              },
            },
          },
        },
      });
  
      this.setState({
        taskList: newTaskList,
      });
    })
  }

  //task에 tag 추가하기
  callbackAddTag(tagNo, tagName, taskListNo, taskNo) {
    const taskListIndex = this.state.taskList.findIndex(
      (taskList) => taskList.taskListNo === taskListNo
    );
    const taskIndex = this.state.taskList[taskListIndex].tasks.findIndex(
      (task) => task.taskNo === taskNo
    );
    
    let newTag = {
      tagNo: tagNo,
      tagName: tagName,
      tagColor: "RGB(255, 160, 160)",
      taskNo:taskNo
    };
    fetch(`${API_URL}/api/tag/add`, {
      method: "post",
      headers: API_HEADERS,
      body: JSON.stringify(newTag),
    })
    .then((response) => response.json())
    .then((json) => {
        let newTagData = update(this.state.taskList, {
          [taskListIndex]: {
            tasks: {
              [taskIndex]: {
                tagList: {
                  $push: [json.data],
                },
              },
            },
          },
        });

        const tagIndex = newTagData[taskListIndex].tasks[taskIndex].tagList.findIndex((tag) => tag.tagNo === json.data.tagNo);
        newTagData = update(newTagData, {
          [taskListIndex]: {
            tasks: {
              [taskIndex]: {
                tagList: {
                  [tagIndex]:{
                    tagName:{$set: tagName},
                    tagColor:{$set: "RGB(255, 160, 160)"}
                  }
                },
              },
            },
          },
        })
        this.onSetStateTaskTagNo(newTagData[taskListIndex].tasks[taskIndex])
        this.setState({
          taskList: newTagData,
        });
      })

  }

  //task에 tag 삭제하기
  callbackDeleteTag(tagNo, taskListNo, taskNo) {
    console.log("KanbanMain : " + tagNo + ":" + taskListNo + ":" + taskNo);
    const taskListIndex = this.state.taskList.findIndex(
      (taskList) => taskList.taskListNo === taskListNo
    );
    const taskIndex = this.state.taskList[taskListIndex].tasks.findIndex(
      (task) => task.taskNo === taskNo
    );
    const tagIndex = this.state.taskList[taskListIndex].tasks[
      taskIndex
    ].tagList.findIndex((tag) => tag.tagNo === tagNo);
    
    fetch(`${API_URL}/api/tag/delete/${taskNo}/${tagNo}`, {
      method: "delete"
    })
    .then(response => response.json())
    .then(json => {
      let newTaskList = update(this.state.taskList, {
        [taskListIndex]: {
          tasks: {
            [taskIndex]: {
              tagList: {
                $splice: [[tagIndex, 1]],
              },
            },
          },
        },
      });
    this.onSetStateTaskTagNo(newTaskList[taskListIndex].tasks[taskIndex])
    this.setState({
      taskList: newTaskList,
    });
  })
}

  //task checkList check 업데이트
  callbackCheckListStateUpdate(
    taskListNo,
    taskNo,
    checklistNo,
    checklistState
  ) 
  {


    const taskListIndex = this.state.taskList.findIndex(
      (taskList) => taskList.taskListNo === taskListNo
    );
    const taskIndex = this.state.taskList[taskListIndex].tasks.findIndex(
      (task) => task.taskNo === taskNo
    );
    const checklistIndex = this.state.taskList[taskListIndex].tasks[
      taskIndex
    ].checkList.findIndex((checklist) => checklist.checklistNo === checklistNo);

    let newCheckList = {
      checklistNo: checklistNo,
      checklistContents: null,
      checklistState: checklistState === "done" ? "do" : "done",
      taskNo: taskNo,
    };

    // console.log("check")

    fetch(`${API_URL}/api/tasksetting/checklist/update`, {
      method: "post",
      headers: API_HEADERS,
      body: JSON.stringify(newCheckList),
    })
    .then(response => response.json())
    .then(json => {
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
  })
  }

  //task checkList text 업데이트
  callbackCheckListContentsUpdate(
    taskListNo,
    taskNo,
    checklistNo,
    checklistContents
  ) {
    const taskListIndex = this.state.taskList.findIndex(
      (taskList) => taskList.taskListNo === taskListNo
    );
    const taskIndex = this.state.taskList[taskListIndex].tasks.findIndex(
      (task) => task.taskNo === taskNo
    );
    const checkListIndex = this.state.taskList[taskListIndex].tasks[
      taskIndex
    ].checkList.findIndex((checkList) => checkList.checklistNo === checklistNo);

    let newCheckList = {
      checklistNo: checklistNo,
      checklistContents: checklistContents,
      checklistState: null,
      taskNo: taskNo,
    };

    console.log("update!!!")
    fetch(`${API_URL}/api/tasksetting/checklist/update`, {
      method: "post",
      headers: API_HEADERS,
      body: JSON.stringify(newCheckList),
    })
    .then((response) => response.json())
    .then((json) => {
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
    })
  }

  //checklist delete
  callbackDeleteCheckList(checklistNo, taskListNo, taskNo){

    const taskListIndex = this.state.taskList.findIndex((taskList) => taskList.taskListNo === taskListNo);
    const taskIndex = this.state.taskList[taskListIndex].tasks.findIndex((task) => task.taskNo === taskNo);
    const checkListIndex =  this.state.taskList[taskListIndex].tasks[taskIndex].checkList.findIndex(checklist => checklist.checklistNo === checklistNo)

    fetch(`${API_URL}/api/tasksetting/checklist/${checklistNo}`, {
      method:'delete'
    })
    .then(response => response.json())
    .then(json => {
      let newTaskList = update(this.state.taskList, {
        [taskListIndex]:{
          tasks:{
            [taskIndex]:{
              checkList:{
                $splice:[[checkListIndex,1]]
              }
            }
          }
        }
      })
      this.setState({
        taskList: newTaskList
      })
    })

  }
  // comment like 수 증가
  callbackCommentLikeUpdate(taskListNo, taskNo, commentNo) {
    const taskListIndex = this.state.taskList.findIndex(
      (taskList) => taskList.taskListNo === taskListNo
      );
      const taskIndex = this.state.taskList[taskListIndex].tasks.findIndex(
        (task) => task.taskNo === taskNo
        );
    const commentIndex = this.state.taskList[taskListIndex].tasks[
      taskIndex
    ].commentList.findIndex((comment) => comment.commentNo === commentNo);
    
    const commentLike = this.state.taskList[taskListIndex].tasks[taskIndex].commentList[commentIndex].commentLike

    let commentData = {
      commentContents: null,
      commentLike:commentLike
    }

    fetch(`${API_URL}/api/comment/${commentNo}`, {
      method:'post',
      headers:API_HEADERS,
      body: JSON.stringify(commentData)
    })
    .then(response => response.json())
    .then((json) => {
      let newTaskList = update(this.state.taskList, {
        [taskListIndex]: {
          tasks: {
            [taskIndex]: {
              commentList: {
                [commentIndex]: {
                  commentLike: {
                    $set:json.data+1,
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
    })


  }

  //comment contents 수정
  callbackCommentContentsUpdate(
    taskListNo,
    taskNo,
    commentNo,
    commentContents
  ) {
    const taskListIndex = this.state.taskList.findIndex(
      (taskList) => taskList.taskListNo === taskListNo
    );
    const taskIndex = this.state.taskList[taskListIndex].tasks.findIndex(
      (task) => task.taskNo === taskNo
    );
    const commentIndex = this.state.taskList[taskListIndex].tasks[
      taskIndex
    ].commentList.findIndex((comment) => comment.commentNo === commentNo);

    // console.log("KanbanMain + " + commentContents)
    let commentData = {
      commentContents: commentContents,
      commentLike:null
    }
    fetch(`${API_URL}/api/comment/${commentNo}`, {
      method:'post',
      headers:API_HEADERS,
      body:JSON.stringify(commentData)
    })
    .then(response => response.json())
    .then((json) => {
      // console.log(json.data)
      let newTaskList = update(this.state.taskList, {
        [taskListIndex]: {
          tasks: {
            [taskIndex]: {
              commentList: {
                [commentIndex]: {
                  commentContents: {
                    $set: json.data,
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
    })
    
  }

  //comment 글 쓰기
  callbackAddComment(file, taskListNo, taskNo, commentContents) {
    const taskListIndex = this.state.taskList.findIndex((taskList) => taskList.taskListNo === taskListNo);
    const taskIndex = this.state.taskList[taskListIndex].tasks.findIndex((task) => task.taskNo === taskNo);
    let newComment = []
    if(file == null){
      newComment = {
        commentNo: null,
        commentRegdate: moment(Date.now()).format('YYYY-MM-DD hh:mm:ss'),
        commentContents: commentContents,
        commentLike: 0,
        userNo: sessionStorage.getItem("authUserNo"),
        taskNo: taskNo,
        fileNo: null,
        originName: null,
        filePath: null
      }
    } else {
      newComment = {
        commentNo: null,
        commentRegdate: moment(Date.now()).format('YYYY-MM-DD hh:mm:ss'),
        commentContents: commentContents,
        commentLike: 0,
        userNo: sessionStorage.getItem("authUserNo"),
        taskNo: taskNo,
        fileNo: file.fileNo,
        originName: file.originName,
        filePath: file.filePath
      };
    }

    fetch(`${API_URL}/api/comment`, {
      method:'post',
      headers:API_HEADERS,
      body:JSON.stringify(newComment)
    })
    .then((response) => response.json())
    .then((json) => {
        let newTaskList= update(this.state.taskList, {
          [taskListIndex]:{
            tasks:{
              [taskIndex]:{
                commentList:{
                  $push:[json.data]

                }
              }
            }
          }
        })

        const commentIndex = newTaskList[taskListIndex].tasks[taskIndex].commentList.findIndex((comment) => comment.commentNo === json.data.commentNo);
        if(file == null){
          newTaskList= update(newTaskList, {
            [taskListIndex]:{
              tasks:{
                [taskIndex]:{
                  commentList:{
                    [commentIndex]:{
                      userName:{$set: sessionStorage.getItem("authUserName")},
                      userPhoto:{$set: sessionStorage.getItem("authUserPhoto")}
                    }
                  }
                }
              }
            }
          })
        }else{
          newTaskList= update(newTaskList, {
            [taskListIndex]:{
              tasks:{
                [taskIndex]:{
                  commentList:{
                    [commentIndex]:{
                      userName:{$set: sessionStorage.getItem("authUserName")},
                      userPhoto:{$set: sessionStorage.getItem("authUserPhoto")},
                      filePath:{$set: file.filePath}
                    }
                  }
                }
              }
            }
          })
        }
            this.setState({
              taskList:newTaskList
          })
    })


}

  //comment 삭제하기
  callbackDeleteComment(fileNo, taskListNo, taskNo, commentNo){
    const taskListIndex = this.state.taskList.findIndex((taskList) => taskList.taskListNo === taskListNo);
    const taskIndex = this.state.taskList[taskListIndex].tasks.findIndex((task) => task.taskNo === taskNo);
    const commentIndex = this.state.taskList[taskListIndex].tasks[taskIndex].commentList.findIndex((comment) => comment.commentNo === commentNo);
    const fileIndex = this.state.taskList[taskListIndex].tasks[taskIndex].fileList.findIndex((file) => file.fileNo === fileNo);

    console.log(commentIndex + " : " +  fileIndex)
    if(fileNo == null){
      fileNo = 0;
    }
    fetch(`${API_URL}/api/comment/${commentNo}/${fileNo}`, {
      method: "delete"
    })
    .then(response => response.json())
    .then(json => {
      let newTaskList = update(this.state.taskList, {
        [taskListIndex]: {
          tasks: {
            [taskIndex]: {
              commentList: {
                $splice: [[commentIndex, 1]],
              },
            },
          },
        },
      });
      if(fileIndex != -1){
        newTaskList = update(newTaskList, {
          [taskListIndex]: {
            tasks: {
              [taskIndex]: {
                fileList: {
                  $splice: [[fileIndex, 1]],
                },
              },
            },
          },
        });

      }

      this.setState({
        taskList:newTaskList
      })
    })
  }

  //file upload 하기
  callbackAddFile(formData, taskListNo, taskNo) {
    const taskListIndex = this.state.taskList.findIndex(
      (taskList) => taskList.taskListNo === taskListNo
    );
    const taskIndex = this.state.taskList[taskListIndex].tasks.findIndex(
      (task) => task.taskNo === taskNo
    );

    let newTaskList = update(this.state.taskList, {
      [taskListIndex]: {
        tasks: {
          [taskIndex]: {
            fileList: {
              $push: [formData],
            },
          },
        },
      },
    });
    this.setState({
      taskList: newTaskList,
    });
    const fileIndex = newTaskList[taskListIndex].tasks[taskIndex].fileList.findIndex(file => file.fileNo == formData.fileNo)
    const file = newTaskList[taskListIndex].tasks[taskIndex].fileList[fileIndex]
    this.callbackAddComment(
      file,
      taskListNo,
      taskNo,
      sessionStorage.getItem("authUserNo"),
      sessionStorage.getItem("authUserName"),
      sessionStorage.getItem("authUserPhoto")
    );
  }

  // 태그가 추가 될 때마다 taskTagNo를 set 해줌.
  onSetStateTaskTagNo(newTaskList){
    let array = []
    array = array.concat(newTaskList.tagList.map(tag => tag.tagNo))
    this.setState({
        taskTagNo:array
    })
  }

  //업무에 멤버 추가 & 삭제
  addDeleteMember(userNo, projectMembers,taskListNo, taskNo){
    const taskListIndex =this.state.taskList.findIndex(taskList => taskList.taskListNo === taskListNo);
    const taskIndex = this.state.taskList[taskListIndex].tasks.findIndex(task => task.taskNo === taskNo);
    const taskItem = this.state.taskList[taskListIndex].tasks[taskIndex]
    const memberIndex= taskItem.memberList.findIndex(member => member.userNo == userNo)
    
    const projectMemberIndex = projectMembers.findIndex(projectMember => projectMember.userNo == userNo);
    
    let member = {
        userNo: userNo,
        taskNo: taskNo
    }

    let newMember = {
      userTitle:null,
      userPhoto:projectMembers[projectMemberIndex].userPhoto,
      userDept:null,
      userNo: userNo,
      userEmail: projectMembers[projectMemberIndex].userEmail,
      userRegdate: projectMembers[projectMemberIndex].userRegdate,
      userBirth: projectMembers[projectMemberIndex].userBirth,
      userName: projectMembers[projectMemberIndex].userName,
      userNumber: null
    }
    if(memberIndex == -1) {
        fetch(`${API_URL}/api/task/member/add`, {
            method:'post', 
            headers:API_HEADERS,
            body: JSON.stringify(member)
        }) 
        .then(response => response.json())
        .then(json => {
          let newTaskList = update(this.state.taskList,{
            [taskListIndex]:{
              tasks:{
                [taskIndex]:{
                  memberList:{
                    $push:[newMember]
                  }
                }
              }
            }
          })
          console.log(newTaskList[taskListIndex].tasks[taskIndex].memberList)
          this.setState({
            taskList:newTaskList
          })
        })
      } else {
        fetch(`${API_URL}/api/task/member/${userNo}/${taskNo}`, {
          method:'delete'
        }) 
        .then(response => response.json())
        .then(json => {
          let newTaskList = update(this.state.taskList,{
            [taskListIndex]:{
              tasks:{
                [taskIndex]:{
                  memberList:{
                    $splice:[[memberIndex, 1]]
                  }
                }
              }
            }
          })

          console.log(newTaskList[taskIndex].tasks[taskIndex].memberList)
          this.setState({
            taskList:newTaskList
          })
        })
      }
  }

// 업무 날짜 수정
callbackTaskDateUpdate(from, to, taskListIndex, taskIndex){
  
  if(from === 'Invalid date'){
    from = undefined;
  }
  if(to === 'Invalid date'){
    to = undefined;
  }

  let newTaskList = update(this.state.taskList, {
    [taskListIndex]: {
      tasks: {
        [taskIndex]: {
          taskStart: {
            $set: from,
          },
          taskEnd: {
            $set: to,
          },
        },
      },
    },
  });
  this.setState({
    taskList:newTaskList
  })

  const task= newTaskList[taskListIndex].tasks[taskIndex]

  fetch(`${API_URL}/api/tasksetting/calendar/update`, {
    method:'post',
    headers:API_HEADERS,
    body:JSON.stringify(task)
  })

  

}

// 설정 화면 중 다른 테스크 클릭 시
modalStateFalse(){
 this.setState({
  modalState : false,
  taskMemberState:false,
  tagModal: false
 })
}
// 모달 상태 변경
modalStateUpdate(){
  this.setState({
    modalState : !this.state.modalState
   })
}

taskMemberState(){
  this.setState({
    taskMemberState: !this.state.taskMemberState
  })
}

//tag modal update
tagModalStateUpdate(){
  this.setState({
    tagModal: !this.state.tagModal
  })
}

//업무 중요도 업데이트
callbackUpdateTaskPoint(point , taskListNo, taskNo){
  const taskListIndex =this.state.taskList.findIndex(taskList => taskList.taskListNo === taskListNo);
  const taskIndex = this.state.taskList[taskListIndex].tasks.findIndex(task => task.taskNo === taskNo);
  
  let newPoint = {
    taskNo:taskNo,
    taskPoint: point
  }
  fetch(`${API_URL}/api/tasksetting/point/update`, {
    method:'post',
    headers:API_HEADERS,
    body: JSON.stringify(newPoint) 
  })
  .then(response => response.json())
  .then(json => {
    // console.log(json.data.taskPoint)
    let newTaskList = update(this.state.taskList, {
      [taskListIndex]:{
        tasks:{
          [taskIndex]:{
            taskPoint:{
              $set:json.data.taskPoint
            }
          }
        }
      }
    })
    this.setState({
      taskList:newTaskList
    })
  })
}

//업무 내용 수정하기
callbackUpdateTaskContents(taskContents, taskListNo, taskNo){
  const taskListIndex =this.state.taskList.findIndex(taskList => taskList.taskListNo === taskListNo);
  const taskIndex = this.state.taskList[taskListIndex].tasks.findIndex(task => task.taskNo === taskNo);
  console.log(taskNo)
  let newTaskList = update(this.state.taskList, {
    [taskListIndex]:{
      tasks:{
        [taskIndex]:{
          taskContents:{
            $set:taskContents
          }
        }
      }
    }
  })
  this.setState({
    taskList:newTaskList
  })

  fetch(`${API_URL}/api/tasksetting/task/${taskNo}`, {
    method:'post',
    headers:API_HEADERS,
    body:taskContents
  })
  .then(response => response.json())

}
  render() {

    return (
      <>
        {/* taskSetting 띄우는 route */}
        <Switch>
          <Route
            path="/nest/dashboard/:projectNo/kanbanboard/:taskListNo/task/:taskNo/"
            exact
            render={(match) => (
              <Setting
                {...match}
                authUserRole={this.state.authUserRole}
                modalState={this.state.modalState}
                tagModal = {this.state.tagModal} // 태그 모달 띄우는 상태변수
                taskMemberState={this.state.taskMemberState}
                projectNo={this.props.match.params.projectNo}
                task={this.state.taskList}
                taskTagNo={this.state.taskTagNo} //업무 태그 번호만 모아둔 상태배열
                taskCallbacks={{
                  checklistStateUpdate: this.callbackCheckListStateUpdate.bind( this), // checklist state 업데이트
                  checklistContentsUpdate: this.callbackCheckListContentsUpdate.bind(this), // checklist contents 업데이트
                  addCheckList: this.callbackAddCheckList.bind(this), //업무에 checklist 추가하기
                  deleteCheckList: this.callbackDeleteCheckList.bind(this), //업무에 checklist 삭제하기
                  addDeletetag: this.callbackAddTag.bind(this), // 업무에 tag 추가하기
                  deletetag: this.callbackDeleteTag.bind(this), //업무에 tag 삭제하기
                  addtag: this.callbackAddTag.bind(this), // 업무에 tag 추가하기
                  updateTaskTag: this.onSetStateTaskTagNo.bind(this),
                  updateTaskDate:this.callbackTaskDateUpdate.bind(this), // 업무 날짜 수정
                  modalStateUpdate:this.modalStateUpdate.bind(this),
                  tagModalStateUpdate: this.tagModalStateUpdate.bind(this), //태그 모달 상태 업데이트
                  taskMemberState: this.taskMemberState.bind(this),
                  addDeleteMember: this.addDeleteMember.bind(this),
                  updateTaskPoint: this.callbackUpdateTaskPoint.bind(this), // 업무 포인트 업뎃
                  updateTaskContents: this.callbackUpdateTaskContents.bind(this), //업무 내용 수정
                }}
              />
            )}
          />
          <Route
            path="/nest/dashboard/:projectNo/kanbanboard/:taskListNo/task/:taskNo/comment"
            render={(match) => (
              <Comment
                {...match}
                authUserRole={this.state.authUserRole}
                projectNo={this.props.match.params.projectNo}
                task={this.state.taskList} 
                taskCallbacks={{
                  commentLikeUpdate: this.callbackCommentLikeUpdate.bind(this), // 코멘트 좋아요 수 증가하기
                  commentContentsUpdate: this.callbackCommentContentsUpdate.bind(this), //코멘트 내용 업데이트
                  addComment: this.callbackAddComment.bind(this), // 코멘트 글 쓰기
                  deleteComment: this.callbackDeleteComment.bind(this), // 코멘트 삭제하기
                  updateTaskContents: this.callbackUpdateTaskContents.bind(this), //업무 내용 수정
                }}
              />)} 
          /> 

          <Route
            path="/nest/dashboard/:projectNo/kanbanboard/:taskListNo/task/:taskNo/file"
            render={(match) => (
              <File
                {...match}
                authUserRole={this.state.authUserRole}
                projectNo={this.props.match.params.projectNo}
                task={this.state.taskList}
                taskCallbacks={{
                  addFile: this.callbackAddFile.bind(this), // 파일 업로드 하기.
                  addComment: this.callbackAddComment.bind(this), // 코멘트 글 쓰기
                  deleteComment: this.callbackDeleteComment.bind(this), // 코멘트 삭제하기
                  updateTaskContents: this.callbackUpdateTaskContents.bind(this), //업무 내용 수정
                }}
              />
            )}
          />
        </Switch>
        <ScrollContainer
          className="scroll-container"
          hideScrollbars={false}
          ignoreElements=".navibar, .topBar, .input-group, .taskPanel, .addTaskListBtn, .taskListInsertForm, .completeArea, .task, .project-setting-dialog"
          // style={{ backgroundImage: `url(${this.state.url})` }}
        >
          <div className="container-fluid kanbanMain">
            <div className="row content ">
              {/* 네비게이션바 */}
              <div className="navibar">
                <Navigator 
                callbackChangeBackground = {this.props.callbackChangeBackground}
                />
              </div>
              {/*상단바*/}
              <TopBar 
                projectNo={this.props.match.params.projectNo}
                activePath={this.props.location.pathname}
                projectTitle={this.state.projectTitle} />
                
              {/* 메인 영역 */}
              <div className="mainArea">
                {/*칸반보드*/}
                <DragDropContext
                  onDragEnd={this.onDragEnd}
                  onDragStart={this.onDragStart}
                >
                  <KanbanBoard
                    authUserRole={this.state.authUserRole}
                    tasks={this.state.taskList}
                    projectNo={this.props.match.params.projectNo}
                    taskCallbacks={{
                      add: this.callbackAddTask.bind(this), // task 추가
                      delete: this.callbackDeleteTask.bind(this), // task 삭제
                      copy: this.callbackCopyTask.bind(this), // task 복사
                      doneTask: this.callbackDoneTask.bind(this), // task 완료 체크
                      addList: this.callbackAddTaskList.bind(this), // taskList 추가
                      deleteList: this.callbackDeleteTaskList.bind(this), // taskList 삭제
                      checklistStateUpdate: this.callbackCheckListStateUpdate.bind( this), // checklist check 업데이트
                      modalStateFalse:this.modalStateFalse.bind(this)
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
    ApiService.fetchKanbanMain(this.props.match.params.projectNo,sessionStorage.getItem("authUserNo")).then(
      (response) => {
        this.setState({
          taskList: response.data.data.allTaskList,
          authUserRole: response.data.data.authUserRole,
          projectTitle: response.data.data.projectTitle
        });
      }
    );
  }
}

export default KanbanMain;
