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
import moment from 'moment';
import ApiNotification from '../../notification/ApiNotification'
import SockJsClient from "react-stomp";
import ProjectSetting from '../../dashboard/projectsetting/ProjectSetting';
import '../../dashboard/projectsetting/projectset.scss';
import ApiHistory from "../topBar/ApiHistory";
import CheckList from "./task/CheckList";

const API_URL = "http://localhost:8080/nest";
const API_HEADERS = {
  "Content-Type": "application/json",
};

class KanbanMain extends Component {

  constructor() {
    super(...arguments);
    this.state = {
      taskList: null,
      authUserRole: null,
      projectTitle: null,
      taskTagNo: [], //task tag의 no만 모아둔 배열
      modalState: false,
      taskMemberState: false, //task memer modal 상태변수
      point: null, // 업무 중요도 상태변수
      tagModal: false, // 태그 모달 상태변수
      taskCount: 0,
      completedTask: 0,

      projects: null,                                               // projects data
      users: null,                                                  // user data
      userProject: [],                                              // authUser projectNo and roleNo
      project: [],                                                  // project
      members: [],                                                  // members in project
      message: null,

      details: true,                                                // arrow 
      addProjectUserButton: false,                                  // add project user button
      inviteMember: false,                                          // invite member open & close
      inviteMemberEmail: "",
      inviteMemberName: "",
      setOn: true,                                                  // project setting open & close button
      isMemberEmailValid: false,                                    // member email valid
      isProjectTitleValid: false,                                   // project title valid
      isNotEmptyValid: false,

      position: "top-right",
      alerts: [],
      timeout: 2000,
      newMessage: "초대 메일이 성공적으로 발송되었습니다.",

      projectWriter: "",                                             // project writer
      projectKeyword: "",                                            // project search
      memberKeyword: "",                                             // member search
      loading: false,

      history: [], //히스토리배열
      projectMembers: [] // 프로젝트 멤버
    };

    const { history } = this.props;
    // 세션 체크...
    if (!sessionStorage.getItem("authUserNo")) {
      history.push("/nest/");
      return;
    }
  }

  // onDragStart = (result) => {
  // }

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

      const { destination, source} = result;


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
      this.setState({
        taskList: newTaskList,
      });

      const taskListName = this.state.taskList[source.index].taskListName;

      ApiHistory.fetchInsertHistory(
        sessionStorage.getItem("authUserNo"),
        sessionStorage.getItem("authUserName"),
        this.state.projectMembers,
        "taskListDragNdrop",
        taskListName,
        this.props.match.params.projectNo,
        this.clientRef)
        .then(response => response.json())
        .then(json =>
          this.setState({
            history: json.data
          })
        )

      fetch(`${API_URL}/api/taskList/reOrder`, {
        method: "post",
        headers: API_HEADERS,
        body: JSON.stringify(newTaskList),
      });


      const socketData = {
        result: result,
        socketType: "taskListDnD",
        userNo: sessionStorage.getItem("authUserNo"),
        projectNo: this.props.location.pathname.split('/')[3],
        members: this.state.projectMembers,
      }

      this.clientRef.sendMessage("/app/all", JSON.stringify(socketData));

      return;
    }

    // task 재정렬
    // 출발한 list의 인덱스 번호와 도착한 list의 인덱스 번호를 저장
    let startIndex = 0;
    let finishIndex = 0;

    this.state.taskList.map((taskList, index) =>
      taskList.taskListNo === source.droppableId ? (startIndex = index) : null
    );
    this.state.taskList.map((taskList, index) =>
      taskList.taskListNo === destination.droppableId ? (finishIndex = index) : null
    );


    // 위의 인덱스를 가지고 출발list, 도착list를 생성
    const start = this.state.taskList[startIndex];
    const finish = this.state.taskList[finishIndex];

    /* 같은 목록에서의 Task 이동 */
    if (start === finish) {
      // tasks 가공
      const newTasks = Array.from(start.tasks);

      if (this.state.taskList[startIndex].tasks[destination.index].taskState === 'done') {
        return;
      }
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

      const taskName = this.state.taskList[startIndex].tasks[source.index].taskContents

      ApiHistory.fetchInsertHistory(
        sessionStorage.getItem("authUserNo"),
        sessionStorage.getItem("authUserName"),
        this.state.projectMembers,
        "taskDragNdrop",
        taskName,
        this.props.match.params.projectNo,
        this.clientRef)
        .then(response => response.json())
        .then(json =>
          this.setState({
            history: json.data
          })
        )
      fetch(`${API_URL}/api/task/reOrder/sameList`, {
        method: "post",
        headers: API_HEADERS,
        body: JSON.stringify(newTaskList[startIndex].tasks),
      });

      this.setState({
        taskList: newTaskList,
      });

      const socketData = {
        result: result,
        socketType: "taskDnD",
        userNo: sessionStorage.getItem("authUserNo"),
        projectNo: newTaskList[startIndex].projectNo,
        members: this.state.projectMembers,
      }
      this.clientRef.sendMessage("/app/all", JSON.stringify(socketData));
      return;
    }

    /* 한 목록에서 다른 목록으로 이동 */

    // 출발 tasks 가공
    if (destination.index - 1 !== -1 && this.state.taskList[finishIndex].tasks[destination.index - 1].taskState === 'done') {
      return;
    }
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

    const taskName = this.state.taskList[startIndex].tasks[source.index].taskContents

    ApiHistory.fetchInsertHistory(
      sessionStorage.getItem("authUserNo"),
      sessionStorage.getItem("authUserName"),
      this.state.projectMembers,
      "taskDragNdrop",
      taskName,
      this.props.match.params.projectNo,
      this.clientRef)
      .then(response => response.json())
      .then(json =>
        this.setState({
          history: json.data
        })
      )

    fetch(`${API_URL}/api/task/reOrder/otherList`, {
      method: "post",
      headers: API_HEADERS,
      body: JSON.stringify(reOrder),
    });

    this.setState({
      taskList: newTaskList,
    });

    const socketData = {
      result : result,
      socketType:"taskDnD",
      userNo : sessionStorage.getItem("authUserNo"),
      projectNo:newTaskList[startIndex].projectNo,
      members:this.state.projectMembers,
    }
    this.clientRef.sendMessage("/app/all", JSON.stringify(socketData));

  };

  // task 추가
  callbackAddTask(taskListNo, taskContents, projectNo) {
    const TaskListIndex = this.state.taskList.findIndex(
      (taskList) => taskList.taskListNo === taskListNo
    );
    const task = {
      taskStart: moment(Date.now()).format('YYYY-MM-DD HH:mm'),
      taskEnd: moment(Date.now()).format('YYYY-MM-DD HH:mm'),
      taskOrder:
        this.state.taskList[TaskListIndex].tasks.length === 0
          ? 1
          : this.state.taskList[TaskListIndex].tasks[0].taskOrder + 1,
      taskListNo: taskListNo,
      taskContents: taskContents,
      projectNo: projectNo,
      taskNo: null,
      taskWriter: sessionStorage.getItem("authUserNo"),
    };


    fetch(`${API_URL}/api/task/insert`, {
      method: "post",
      headers: API_HEADERS,
      body: JSON.stringify(task),
    })
      .then((response) => response.json())
      .then((json) => {

        const TaskListIndex = this.state.taskList.findIndex(
          (taskList) => taskList.taskListNo === taskListNo
        );


        const projectIndex = this.state.projects.findIndex(project => project.projectNo === this.state.taskList[TaskListIndex].projectNo);


        let membersNo = []
        this.state.projects[projectIndex].members.map(member => {
          membersNo.push(member.userNo);
        })

        this.setState({
          taskCount: this.state.taskCount + 1,
          completedTask: this.state.completedTask,
        })

        let newTask = {
          commentList: [],
          taskStart: json.data.taskStart,
          taskEnd: json.data.taskEnd,
          taskOrder: json.data.taskOrder,
          tagList: [],
          taskState: "do",
          memberList: [],
          taskContents: json.data.taskContents,
          taskNo: json.data.taskNo + "",
          checkList: [],
          taskPoint: json.data.taskPoint,
          taskLabel: json.data.taskLabel,
          fileList: [],
          taskWriter: json.data.taskWriter,
          userName: sessionStorage.getItem("authUserName"),
          socketType: "taskInsert",
          taskListNo: taskListNo,
          projectNo: projectNo,
          taskCount: this.state.taskCount,
          completedTask: this.state.completedTask,
          members: this.state.projectMembers
        };

        const taskName = json.data.taskContents
        ApiHistory.fetchInsertHistory(
          sessionStorage.getItem("authUserNo"),
          sessionStorage.getItem("authUserName"),
          this.state.projectMembers,
          "taskInsert",
          taskName,
          this.props.match.params.projectNo,
          this.clientRef)
          .then(response => response.json())
          .then(json =>
            this.setState({
              history: json.data
            })
          )

        this.clientRef.sendMessage("/app/all", JSON.stringify(newTask));
        this.clientRef.sendMessage("/app/calendar/all", JSON.stringify(newTask))
        this.clientRef.sendMessage("/app/dashboard/all", JSON.stringify(newTask));

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

    this.setState({
      taskCount: this.state.taskCount - 1,
      completedTask: this.state.taskList[TaskListIndex].tasks[TaskIndex].taskState === "done" ? this.state.completedTask - 1 : this.state.completedTask
    })
    const deleteTask = {
      taskListNo: taskListNo,
      taskId: taskId,
      socketType: "taskDelete",
      userNo: sessionStorage.getItem("authUserNo"),
      projectNo: this.state.taskList[TaskListIndex].projectNo,
      members: this.state.projectMembers,
      taskCount: this.state.taskCount - 1,
      TaskListIndex:TaskListIndex,
      TaskIndex:TaskIndex,
      completedTask: this.state.taskList[TaskListIndex].tasks[TaskIndex].taskState === "done" ? this.state.completedTask - 1 : this.state.completedTask
    }

    const taskName = this.state.taskList[TaskListIndex].tasks[TaskIndex].taskContents
    ApiHistory.fetchInsertHistory(
      sessionStorage.getItem("authUserNo"),
      sessionStorage.getItem("authUserName"),
      this.state.projectMembers,
      "taskDelete",
      taskName,
      this.props.match.params.projectNo,
      this.clientRef)
      .then(response => response.json())
      .then(json =>
        this.setState({
          history: json.data
        })
      )

    this.clientRef.sendMessage("/app/all", JSON.stringify(deleteTask));
    this.clientRef.sendMessage("/app/dashboard/all", JSON.stringify(deleteTask));
    this.clientRef.sendMessage("/app/calendar/all", JSON.stringify(deleteTask));
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
      taskWriter: sessionStorage.getItem("authUserNo"),
    }

    fetch(`${API_URL}/api/task/copy/insert`, {
      method: "post",
      headers: API_HEADERS,
      body: JSON.stringify(copyTask),
    })
      .then((response) => response.json())
      .then((json) => {
        const TaskListIndex = this.state.taskList.findIndex(
          (taskList) => taskList.taskListNo === taskListNo
        );
        this.setState({
          taskCount: this.state.taskCount + 1,
          completedTask: this.state.completedTask
        })

        const taskCopy = {
          taskListIndex: TaskListIndex,
          taskIndex: TaskIndex,
          socketType: "taskCopy",
          userNo: sessionStorage.getItem("authUserNo"),
          taskNo: json.data.taskNo,
          projectNo: this.state.taskList[TaskListIndex].projectNo,
          members: this.state.projectMembers,
          taskCount: this.state.taskCount,
          completedTask: this.state.completedTask
        }

        const calendarSocketData = {
          taskNo: json.data.taskNo,
          projectNo: this.state.taskList[TaskListIndex].projectNo,
          members: this.state.projectMembers,
          taskCount: this.state.taskCount,
          completedTask: this.state.completedTask,
          socketType: "taskCopy",
          taskState: this.state.taskList[TaskListIndex].tasks[TaskIndex].taskState,
          taskLabel: this.state.taskList[TaskListIndex].tasks[TaskIndex].taskLabel,
          taskEnd: this.state.taskList[TaskListIndex].tasks[TaskIndex].taskEnd,
          taskStart: this.state.taskList[TaskListIndex].tasks[TaskIndex].taskStart,
          taskPoint: this.state.taskList[TaskListIndex].tasks[TaskIndex].taskPoint,
          tasklistNo: this.state.taskList[TaskListIndex].taskListNo
        }

        this.clientRef.sendMessage("/app/all", JSON.stringify(taskCopy));
        this.clientRef.sendMessage("/app/dashboard/all", JSON.stringify(taskCopy));
        this.clientRef.sendMessage("/app/calendar/all", JSON.stringify(calendarSocketData));
      })

  }

  // task 완료 체크
  callbackDoneTask(taskListNo, taskId) {
    const TaskListIndex = this.state.taskList.findIndex(
      (taskList) => taskList.taskListNo === taskListNo
    );

    const taskIndex = this.state.taskList[TaskListIndex].tasks.findIndex(task => task.taskNo === taskId);

    let calendarSocketData;
    if (this.state.taskList[TaskListIndex].tasks[taskIndex].taskState === "done") {
      this.setState({
        taskCount: this.state.taskCount,
        completedTask: this.state.completedTask - 1
      })

      calendarSocketData = {
        taskListNo: taskListNo,
        taskId: taskId,
        socketType: "taskCheck",
        projectNo: this.state.taskList[TaskListIndex].projectNo,
        members: this.state.projectMembers,
        taskCount: this.state.taskCount,
        completedTask: this.state.taskList[TaskListIndex].tasks[taskIndex].taskState === "done" ? this.state.completedTask - 1 : this.state.completedTask + 1,
        taskState: "do"
      }
    } else {
      this.setState({
        taskCount: this.state.taskCount,
        completedTask: this.state.completedTask + 1
      })

      calendarSocketData = {
        taskListNo: taskListNo,
        taskId: taskId,
        socketType: "taskCheck",
        projectNo: this.state.taskList[TaskListIndex].projectNo,
        members: this.state.projectMembers,
        taskCount: this.state.taskCount,
        completedTask: this.state.taskList[TaskListIndex].tasks[taskIndex].taskState === "done" ? this.state.completedTask - 1 : this.state.completedTask + 1,
        taskState: "done"
      }
    }

    const taskCheck = {
      taskListNo: taskListNo,
      taskId: taskId,
      socketType: "taskCheck",
      projectNo: this.state.taskList[TaskListIndex].projectNo,
      members: this.state.projectMembers,
      taskCount: this.state.taskCount,
      completedTask: this.state.taskList[TaskListIndex].tasks[taskIndex].taskState === "done" ? this.state.completedTask - 1 : this.state.completedTask + 1
    }

    const taskName = this.state.taskList[TaskListIndex].tasks[taskIndex].taskContents

    ApiHistory.fetchInsertHistory(
      sessionStorage.getItem("authUserNo"),
      sessionStorage.getItem("authUserName"),
      this.state.projectMembers,
      "taskStateUpdate",
      taskName,
      this.props.match.params.projectNo,
      this.clientRef)
      .then(response => response.json())
      .then(json =>
        this.setState({
          history: json.data
        })
      )


    this.clientRef.sendMessage("/app/all", JSON.stringify(taskCheck));
    this.clientRef.sendMessage("/app/dashboard/all", JSON.stringify(taskCheck));
    this.clientRef.sendMessage("/app/calendar/all", JSON.stringify(calendarSocketData))
  }

  // task list 추가
  callbackAddTaskList(taskListName, projectNo) {
    let newTaskList = {
      taskListNo: null,
      taskListName: taskListName,
      taskListOrder: null,
      projectNo: projectNo,
    };

    ApiHistory.fetchInsertHistory(
      sessionStorage.getItem("authUserNo"),
      sessionStorage.getItem("authUserName"),
      this.state.projectMembers,
      "taskListInsert",
      taskListName,
      this.props.match.params.projectNo,
      this.clientRef)
      .then(response => response.json())
      .then(json =>
        this.setState({
          history: json.data
        })
      )

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
            socketType: "taskListInsert",
            members: this.state.projectMembers,
          },

        });

        this.clientRef.sendMessage("/app/all", JSON.stringify(newTaskList));
        this.clientRef.sendMessage("/app/calendar/all", JSON.stringify(newTaskList));
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

    let TaskListName = null;
    this.state.taskList.map(tasklist => tasklist.taskListNo === taskListBody.taskListNo ? TaskListName = tasklist.taskListName : null);

    ApiHistory.fetchInsertHistory(
      sessionStorage.getItem("authUserNo"),
      sessionStorage.getItem("authUserName"),
      this.state.projectMembers,
      "taskListDelete",
      TaskListName,
      this.props.match.params.projectNo,
      this.clientRef)
      .then(response => response.json())
      .then(json =>
        this.setState({
          history: json.data
        })
      )

    fetch(`${API_URL}/api/taskList/delete`, {
      method: "post",
      headers: API_HEADERS,
      body: JSON.stringify(deleteTaskList),
    })
      .then((response) => response.json())
      .then((json) => {
        let doneCount = 0;
        this.state.taskList[TaskListIndex].tasks.map(task => {
          if (task.taskState === "done") {
            doneCount = doneCount + 1
          }
        })

        this.setState({
          taskCount: this.state.taskCount - this.state.taskList[TaskListIndex].tasks.length,
          completedTask: this.state.completedTask - doneCount
        })

        const calendarSocketData = {
          taskListNo: taskListBody.taskListNo,
          projectNo: taskListBody.projectNo,
          taskCount: this.state.taskCount,
          completedTask: this.state.completedTask,
          socketType: "taskListDelete",
          members: this.state.projectMembers
        }

        const newData = {
          TaskListIndex: TaskListIndex,
          taskListOrder: json.data.taskListOrder,
          socketType: "taskListDelete",
          projectNo: taskListBody.projectNo,
          members: this.state.projectMembers,
          taskCount: this.state.taskCount,
          completedTask: this.state.completedTask
        }
        this.clientRef.sendMessage("/app/all", JSON.stringify(newData));
        this.clientRef.sendMessage("/app/dashboard/all", JSON.stringify(newData));
        this.clientRef.sendMessage("/app/calendar/all", JSON.stringify(calendarSocketData))
      });
  }

  //checkList 추가하기
  callbackAddCheckList(contents, taskNo, taskListNo) {
    const taskListIndex = this.state.taskList.findIndex((taskList) => taskList.taskListNo === taskListNo);

    const taskIndex = this.state.taskList[taskListIndex].tasks.findIndex((task) => task.taskNo === taskNo);

    const taskName = this.state.taskList[taskListIndex].tasks[taskIndex].taskContents

    ApiNotification.fetchInsertNotice(
      sessionStorage.getItem("authUserNo"),
      sessionStorage.getItem("authUserName"),
      this.state.taskList[taskListIndex].tasks[taskIndex].memberList,
      "taskCheckListInsert",
      taskNo,
      this.props.match.params.projectNo)

    ApiHistory.fetchInsertHistory(
      sessionStorage.getItem("authUserNo"),
      sessionStorage.getItem("authUserName"),
      this.state.projectMembers,
      "checklistInsert",
      taskName,
      this.props.match.params.projectNo,
      this.clientRef)
      .then(response => response.json())
      .then(json =>
        this.setState({
          history: json.data
        })
      )

    let newCheckList = {
      checklistNo: null,
      checklistContents: contents,
      checklistState: "do",
      taskNo: taskNo,
    };

    fetch(`${API_URL}/api/tasksetting/checklist/add`, {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify(newCheckList)
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
        const checklistIndex = newTaskList[taskListIndex].tasks[taskIndex].checkList.findIndex(checklist => checklist.checklistNo == json.data.checklistNo)
        newTaskList = update(newTaskList, {
          [taskListIndex]: {
            tasks: {
              [taskIndex]: {
                checkList: {
                  [checklistIndex]: {
                    socketType: { $set: "checklistInsert" },
                    taskListIndex: { $set: taskListIndex },
                    taskIndex: { $set: taskIndex },
                    authUserNo: { $set: sessionStorage.getItem("authUserNo") },
                    projectNo: { $set: this.props.match.params.projectNo },
                    members: { $set: this.state.projectMembers }
                  }
                },
              },
            },
          },
        });
        this.setState({
          taskList: newTaskList
        })
        this.clientRef.sendMessage("/app/all", JSON.stringify(newTaskList[taskListIndex].tasks[taskIndex].checkList[checklistIndex]));

      })
  }

  //task에 tag 추가하기
  callbackAddTag(tagNo, tagName, taskListNo, taskNo, tagColor) {
    const taskListIndex = this.state.taskList.findIndex(
      (taskList) => taskList.taskListNo === taskListNo
    );
    const taskIndex = this.state.taskList[taskListIndex].tasks.findIndex(
      (task) => task.taskNo === taskNo
    );

    let newTag = {
      tagNo: tagNo,
      tagName: tagName,
      tagColor: tagColor,
      taskNo: taskNo
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
                  [tagIndex]: {
                    tagName: { $set: tagName },
                    tagColor: { $set: tagColor },
                    socketType: { $set: "taskTagAdd" },
                    taskListIndex: { $set: taskListIndex },
                    taskIndex: { $set: taskIndex },
                    authUserNo: { $set: sessionStorage.getItem("authUserNo") },
                    projectNo: { $set: this.props.match.params.projectNo },
                    members: { $set: this.state.projectMembers }
                  }
                },
              },
            },
          },
        })
        this.onSetStateTaskTagNo(newTagData[taskListIndex].tasks[taskIndex])
        this.setState({
          taskList: newTagData
        })
        this.clientRef.sendMessage("/app/all", JSON.stringify(newTagData[taskListIndex].tasks[taskIndex].tagList[tagIndex]));

      })

  }

  //task에 tag 삭제하기
  callbackDeleteTag(tagNo, taskListNo, taskNo) {
    const taskListIndex = this.state.taskList.findIndex(
      (taskList) => taskList.taskListNo === taskListNo
    );
    const taskIndex = this.state.taskList[taskListIndex].tasks.findIndex(
      (task) => task.taskNo === taskNo
    );
    const tagIndex = this.state.taskList[taskListIndex].tasks[
      taskIndex
    ].tagList.findIndex((tag) => tag.tagNo === tagNo);

    let data = {
      taskNo: taskNo,
      tagNo: tagNo,
      taskListIndex: taskListIndex,
      taskIndex: taskIndex,
      tagIndex: tagIndex,
      socketType: "taskTagDelete",
      userNo: sessionStorage.getItem("authUserNo"),
      projectNo: this.props.match.params.projectNo,
      members: this.state.projectMembers
    }

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
        this.clientRef.sendMessage("/app/all", JSON.stringify(data));
        this.setState({
          taskList: newTaskList,
        });
      })

  }

  //모든 task 에서 해당 tag 삭제하기
  callbackDeleteAllTag(tagNo) {

    let data = {
      tagNo: tagNo,
      socketType: "allTagDelete",
      members: this.state.projectMembers
    }

    this.clientRef.sendMessage("/app/all", JSON.stringify(data));

  }
  //task tag 수정하기
  callbackUpdateTag(tagName, tagColor, tagNo) {

    let data = {
      tagName: tagName,
      tagColor: tagColor,
      tagNo: tagNo,
      socketType: "allTagUpdate",
      members:this.state.projectMembers
    }

    this.clientRef.sendMessage("/app/all", JSON.stringify(data));
  }
  //task checkList check 업데이트
  callbackCheckListStateUpdate(taskListNo, taskNo, checklistNo, checklistState) {

    const taskListIndex = this.state.taskList.findIndex(
      (taskList) => taskList.taskListNo === taskListNo
    );
    const taskIndex = this.state.taskList[taskListIndex].tasks.findIndex(
      (task) => task.taskNo === taskNo
    );

    const taskName = this.state.taskList[taskListIndex].tasks[taskIndex].taskContents
    const checklistIndex = this.state.taskList[taskListIndex].tasks[taskIndex].checkList.findIndex(checkList => checkList.checklistNo == checklistNo )
    
    let newCheckList = {
      checklistNo: checklistNo,
      checklistContents: null,
      checklistState: checklistState === "done" ? "do" : "done",
      taskNo: taskNo,
    };

    ApiHistory.fetchInsertHistory(
      sessionStorage.getItem("authUserNo"),
      sessionStorage.getItem("authUserName"),
      this.state.projectMembers,
      "checklistStateUpdate",
      taskName,
      this.props.match.params.projectNo,
      this.clientRef)
      .then(response => response.json())
      .then(json =>
        this.setState({
          history: json.data
        })
      )
    fetch(`${API_URL}/api/tasksetting/checklist/update`, {
      method: "post",
      headers: API_HEADERS,
      body: JSON.stringify(newCheckList),
    })
      .then(response => response.json())
      .then(json => {
        
        let newTaskList = update(this.state.taskList,{
          [taskListIndex]:{
            tasks:{
              [taskIndex]:{
                checkList:{
                  [checklistIndex]:{
                    checklistState:{$set:checklistState === "done" ? "do" : "done"}
                  }
                }
              }
            }
          }
        })
        this.setState({
          taskList:newTaskList
        })

        const socketData = {
          checklistState: checklistState,
          socketType: "taskCheckListUpdate",
          projectNo: this.state.taskList[taskListIndex].projectNo,
          members: this.state.projectMembers,
          taskListIndex:taskListIndex,
          taskIndex:taskIndex,
          checklistIndex:checklistIndex
        }
        this.clientRef.sendMessage("/app/all", JSON.stringify(socketData));
        
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
      socketType: "checkListUpdate",
      members: this.state.projectMembers ,
      projectNo: this.props.match.params.projectNo ,
      authUserNo: sessionStorage.getItem("authUserNo") ,
      taskListIndex:taskListIndex,
      taskIndex:taskIndex,
      checkListIndex:checkListIndex
    };

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
                    checklistContents: { $set: checklistContents},

                  },
                },
              },
            },
          },
        });
        this.clientRef.sendMessage("/app/all", JSON.stringify(newCheckList))
        this.setState({
          taskList: newTaskList,
        });
      })
  }

  //checklist delete
  callbackDeleteCheckList(checklistNo, taskListNo, taskNo) {

    const taskListIndex = this.state.taskList.findIndex((taskList) => taskList.taskListNo === taskListNo);
    const taskIndex = this.state.taskList[taskListIndex].tasks.findIndex((task) => task.taskNo === taskNo);
    const checkListIndex = this.state.taskList[taskListIndex].tasks[taskIndex].checkList.findIndex(checklist => checklist.checklistNo === checklistNo)

    let data = {
      checklistNo: checklistNo,
      taskListIndex: taskListIndex,
      taskIndex: taskIndex,
      checkListIndex: checkListIndex,
      socketType: "checkListDelete",
      userNo: sessionStorage.getItem("authUserNo"),
      projectNo: this.props.match.params.projectNo,
      members: this.state.projectMembers
    }

    fetch(`${API_URL}/api/tasksetting/checklist/${checklistNo}`, {
      method: 'delete'
    })
      .then(response => response.json())
      .then(json => {
        let newTaskList = update(this.state.taskList, {
          [taskListIndex]: {
            tasks: {
              [taskIndex]: {
                checkList: {
                  $splice: [[checkListIndex, 1]]
                }
              }
            }
          }
        })

        this.setState({
          taskList: newTaskList
        })
        this.clientRef.sendMessage("/app/all", JSON.stringify(data));
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
      commentLike: commentLike,
      userNo: sessionStorage.getItem("authUserNo")
    }

    fetch(`${API_URL}/api/comment/like/${commentNo}`, {
      method: 'post',
      headers: API_HEADERS,
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
                    commentLike: {$set: json.data}, 
                    socketType: { $set: "commentLikeUpdate" },
                    authUserNo: { $set: sessionStorage.getItem("authUserNo") },
                    taskListIndex: { $set: taskListIndex },
                    taskIndex: { $set: taskIndex },
                    commentIndex:{$set:commentIndex},
                    members: { $set: this.state.projectMembers },
                    projectNo: { $set: this.props.match.params.projectNo },
                  },
                },
              },
            },
          },
        });
        this.clientRef.sendMessage("/app/all", JSON.stringify(newTaskList[taskListIndex].tasks[taskIndex].commentList[commentIndex]))
        this.setState({
          taskList: newTaskList,
        });
      })

    ApiNotification.fetchInsertNotice(
      sessionStorage.getItem("authUserNo"),
      sessionStorage.getItem("authUserName"),
      [this.state.taskList[taskListIndex].tasks[taskIndex].commentList[commentIndex]],
      "commentLike",
      taskNo,
      this.props.match.params.projectNo)


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

    let commentData = {
      commentContents: commentContents,
      commentLike: null
    }
    fetch(`${API_URL}/api/comment/contents/${commentNo}`, {
      method: 'post',
      headers: API_HEADERS,
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

    const taskContents = this.state.taskList[taskListIndex].tasks[taskIndex].taskContents
    const taskListName = this.state.taskList[taskListIndex].taskListName

    ApiNotification.fetchInsertNotice(
      sessionStorage.getItem("authUserNo"),
      sessionStorage.getItem("authUserName"),
      this.state.taskList[taskListIndex].tasks[taskIndex].memberList,
      "commentInsert",
      taskNo,
      this.props.match.params.projectNo)

    let newComment = []
    if (file === null) {
      newComment = {
        commentNo: null,
        commentRegdate: moment(Date.now()).format('YYYY-MM-DD HH:mm'),
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
        commentRegdate: moment(Date.now()).format('YYYY-MM-DD HH:mm'),
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
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify(newComment)
    })
      .then((response) => response.json())
      .then((json) => {
        let newTaskList = update(this.state.taskList, {
          [taskListIndex]: {
            tasks: {
              [taskIndex]: {
                commentList: {
                  $push: [json.data]
                }
              }
            }
          }
        })

        const commentIndex = newTaskList[taskListIndex].tasks[taskIndex].commentList.findIndex((comment) => comment.commentNo === json.data.commentNo);
        if (file === null) {
          newTaskList = update(newTaskList, {
            [taskListIndex]: {
              tasks: {
                [taskIndex]: {
                  commentList: {
                    [commentIndex]: {
                      userName: { $set: sessionStorage.getItem("authUserName") },
                      userPhoto: { $set: sessionStorage.getItem("authUserPhoto") },
                      commentState: { $set: 'T' },
                      socketType: { $set: "comment" },
                      authUserNo: { $set: sessionStorage.getItem("authUserNo") },
                      taskListIndex: { $set: taskListIndex },
                      taskIndex: { $set: taskIndex },
                      members: { $set: this.state.projectMembers },
                      projectNo: { $set: this.props.match.params.projectNo },
                    }
                  }
                }
              }
            }
          })
        } else {
          newTaskList = update(newTaskList, {
            [taskListIndex]: {
              tasks: {
                [taskIndex]: {
                  commentList: {
                    [commentIndex]: {
                      userName: { $set: sessionStorage.getItem("authUserName") },
                      userPhoto: { $set: sessionStorage.getItem("authUserPhoto") },
                      filePath: { $set: file.filePath },
                      fileState: { $set: 'T' }, 
                      commentState: { $set: 'T' },
                      socketType: { $set: "comment" },
                      authUserNo: { $set: sessionStorage.getItem("authUserNo") },
                      taskListIndex: { $set: taskListIndex },
                      taskIndex: { $set: taskIndex },
                      members: { $set: this.state.projectMembers },
                      projectNo: { $set: this.props.match.params.projectNo },
                      projectTitle: { $set: this.state.projectTitle },
                      taskContents: { $set: taskContents },
                      taskListName: { $set: taskListName }
                    }
                  }
                }
              }
            }
          })
        }
        this.setState({
          taskList: newTaskList
        })

        this.clientRef.sendMessage("/app/all", JSON.stringify(newTaskList[taskListIndex].tasks[taskIndex].commentList[commentIndex]));
        this.clientRef.sendMessage("/app/topbar/file/all", JSON.stringify(newTaskList[taskListIndex].tasks[taskIndex].commentList[commentIndex]));
      })

  }

  //comment 삭제하기
  callbackDeleteComment(fileNo, taskListNo, taskNo, commentNo) {
    const taskListIndex = this.state.taskList.findIndex((taskList) => taskList.taskListNo === taskListNo);
    const taskIndex = this.state.taskList[taskListIndex].tasks.findIndex((task) => task.taskNo === taskNo);
    const commentIndex = this.state.taskList[taskListIndex].tasks[taskIndex].commentList.findIndex((comment) => comment.commentNo === commentNo);
    const fileIndex = this.state.taskList[taskListIndex].tasks[taskIndex].fileList.findIndex((file) => file.fileNo === fileNo);

    if (fileNo === null) {
      fileNo = 0;
    }
    fetch(`${API_URL}/api/comment/${commentNo}/${fileNo}`, {
      method: "post",
      headers: API_HEADERS,
    })
      .then(json => {
        let newTaskList = update(this.state.taskList, {
          [taskListIndex]: {
            tasks: {
              [taskIndex]: {
                commentList: {
                  [commentIndex]: {
                    commentState: { $set: 'F' },
                    socketType: { $set: 'commentDelete' },
                    members: { $set: this.state.projectMembers },
                    projectNo: { $set: this.props.match.params.projectNo }
                  }
                },
              },
            },
          },
        });
        
        if (fileIndex !== -1) {
          newTaskList = update(newTaskList, {
            [taskListIndex]: {
              tasks: {
                [taskIndex]: {
                  fileList: {
                    [fileIndex]: {
                      fileState: { $set: 'F' },
                    }
                  },
                  commentList: {
                    [commentIndex]: {
                      fileState: { $set: 'F' },
                      socketType: { $set: 'fileDelete' }, // top bar file delete
                      members: { $set: this.state.projectMembers },
                      projectNo: { $set: this.props.match.params.projectNo }
                    }
                  }
                },
              },
            },
          });
        }
        const socketData = {
          fileNo:fileNo, 
          taskListNo:taskListNo, 
          taskNo:taskNo, 
          commentNo:commentNo,
          members: this.state.projectMembers,
          projectNo: this.props.match.params.projectNo ,
          socketType: 'commentDelete' ,
          authUserNo:sessionStorage.getItem("authUserNo")
        }

        this.clientRef.sendMessage("/app/all", JSON.stringify(socketData));
        this.clientRef.sendMessage("/app/topbar/file/all", JSON.stringify(newTaskList[taskListIndex].tasks[taskIndex].commentList[commentIndex]));
        this.setState({
          taskList: newTaskList
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
    const fileIndex = newTaskList[taskListIndex].tasks[taskIndex].fileList.findIndex(file => file.fileNo === formData.fileNo)
    const file = newTaskList[taskListIndex].tasks[taskIndex].fileList[fileIndex]
    this.callbackAddComment(
      file,
      taskListNo,
      taskNo,
      file.originName
    );

    const socketData = {
      taskListIndex:taskListIndex,
      taskIndex:taskIndex,
      fileIndex:fileIndex,
      formData:formData,
      members: this.state.projectMembers ,
      projectNo: this.props.match.params.projectNo ,
      authUserNo: sessionStorage.getItem("authUserNo") ,
      socketType:"fileUpload"
    }

    this.clientRef.sendMessage("/app/all", JSON.stringify(socketData));
  }

  // 태그가 추가 될 때마다 taskTagNo를 set 해줌.
  onSetStateTaskTagNo(newTaskList) {
    let array = []
    array = array.concat(newTaskList.tagList.map(tag => tag.tagNo))
    this.setState({
      taskTagNo: array
    })
  }

  //업무 멤버 추가 & 삭제
  addDeleteMember(userNo, projectMembers, taskListNo, taskNo) {
    const taskListIndex = this.state.taskList.findIndex(taskList => taskList.taskListNo === taskListNo);
    const taskIndex = this.state.taskList[taskListIndex].tasks.findIndex(task => task.taskNo === taskNo);
    const taskItem = this.state.taskList[taskListIndex].tasks[taskIndex]
    const memberIndex = taskItem.memberList.findIndex(member => member.userNo === userNo)

    const projectMemberIndex = projectMembers.findIndex(projectMember => projectMember.userNo === userNo);
    const taskName = taskItem.taskContents

    let member = {
      userNo: userNo,
      taskNo: taskNo
    }

    if (memberIndex === -1) {

      ApiHistory.fetchInsertHistory(
        sessionStorage.getItem("authUserNo"),
        sessionStorage.getItem("authUserName"),
        this.state.projectMembers,
        "taskMemberJoin",
        taskName,
        this.props.match.params.projectNo,
        this.clientRef)
        .then(response => response.json())
        .then(json =>
          this.setState({
            history: json.data
          })
        )

      let newMember = {
        userTitle: null,
        userPhoto: projectMembers[projectMemberIndex].userPhoto,
        userDept: null,
        userNo: userNo,
        userEmail: projectMembers[projectMemberIndex].userEmail,
        userRegdate: projectMembers[projectMemberIndex].userRegdate,
        userBirth: projectMembers[projectMemberIndex].userBirth,
        userName: projectMembers[projectMemberIndex].userName,
        userNumber: null,
        socketType: "taskMemberAdd",
        taskListIndex: taskListIndex,
        taskIndex: taskIndex,
        authUserNo: sessionStorage.getItem("authUserNo"),
        projectNo: this.props.match.params.projectNo,
        members: this.state.projectMembers
      }

      fetch(`${API_URL}/api/task/member/add`, {
        method: 'post',
        headers: API_HEADERS,
        body: JSON.stringify(member)
      })
        .then(response => response.json())
        .then(json => {
          let newTaskList = update(this.state.taskList, {
            [taskListIndex]: {
              tasks: {
                [taskIndex]: {
                  memberList: {
                    $push: [newMember]
                  }
                }
              }
            }
          })
          this.clientRef.sendMessage("/app/all", JSON.stringify(newMember));
          this.setState({
            taskList: newTaskList
          })
        })

      ApiNotification.fetchInsertNotice(
        sessionStorage.getItem("authUserNo"),
        sessionStorage.getItem("authUserName"),
        [newMember],
        "taskJoin",
        taskNo,
        this.props.match.params.projectNo)
    } else {

      let newMember = {
        userTitle: null,
        userPhoto: projectMembers[projectMemberIndex].userPhoto,
        userDept: null,
        userNo: userNo,
        userEmail: projectMembers[projectMemberIndex].userEmail,
        userRegdate: projectMembers[projectMemberIndex].userRegdate,
        userBirth: projectMembers[projectMemberIndex].userBirth,
        userName: projectMembers[projectMemberIndex].userName,
        userNumber: null,
        socketType: "taskMemberDelete",
        taskListIndex: taskListIndex,
        taskIndex: taskIndex,
        memberIndex: memberIndex,
        authUserNo: sessionStorage.getItem("authUserNo"),
        projectNo: this.props.match.params.projectNo,
        members: this.state.projectMembers
      }

      fetch(`${API_URL}/api/task/member/${userNo}/${taskNo}`, {
        method: 'delete'
      })
        .then(response => response.json())
        .then(json => {
          let newTaskList = update(this.state.taskList, {
            [taskListIndex]: {
              tasks: {
                [taskIndex]: {
                  memberList: {
                    $splice: [[memberIndex, 1]]
                  }
                }
              }
            }
          })
          this.clientRef.sendMessage("/app/all", JSON.stringify(newMember));
          this.setState({
            taskList: newTaskList
          })
        })


    }
  }

  // 업무 날짜 수정
  callbackTaskDateUpdate(from, to, taskListIndex, taskIndex) {

    const taskName = this.state.taskList[taskListIndex].tasks[taskIndex].taskContents

    ApiNotification.fetchInsertNotice(
      sessionStorage.getItem("authUserNo"),
      sessionStorage.getItem("authUserName"),
      this.state.taskList[taskListIndex].tasks[taskIndex].memberList,
      "taskDateChange",
      this.state.taskList[taskListIndex].tasks[taskIndex].taskNo,
      this.props.match.params.projectNo)


    ApiHistory.fetchInsertHistory(
      sessionStorage.getItem("authUserNo"),
      sessionStorage.getItem("authUserName"),
      this.state.projectMembers,
      "taskDateUpdate",
      taskName,
      this.props.match.params.projectNo,
      this.clientRef)
      .then(response => response.json())
      .then(json =>
        this.setState({
          history: json.data
        })
      )

    const data = {
      from: from,
      to: to,
      taskListIndex: taskListIndex,
      taskIndex: taskIndex,
      socketType: "dateUpdate",
      projectNo: this.props.match.params.projectNo,
      members: this.state.projectMembers
    }

    if (from === 'Invalid date') {
      from = undefined;
    }
    if (to === 'Invalid date') {
      to = undefined;
    }

    let newTaskList = update(this.state.taskList, {
      [taskListIndex]: {
        tasks: {
          [taskIndex]: {
            taskStart: {
              $set: moment(from).format("YYYY-MM-DD HH:mm"),
            },
            taskEnd: {
              $set: moment(to).format("YYYY-MM-DD HH:mm"),
            },
          },
        },
      },
    });
    this.setState({
      taskList: newTaskList
    })

    const task = newTaskList[taskListIndex].tasks[taskIndex]

    fetch(`${API_URL}/api/tasksetting/calendar/update`, {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify(task)
    })
    this.clientRef.sendMessage("/app/all", JSON.stringify(data));

  }

  // 설정 화면 중 다른 테스크 클릭 시
  modalStateFalse() {
    this.setState({
      modalState: false,
      taskMemberState: false,
      tagModal: false,
      setOn: true
    })
  }
  // 모달 상태 변경
  modalStateUpdate() {
    this.setState({
      modalState: !this.state.modalState,
      tagModal: false,
      taskMemberState:false
    })
    
  }

  taskMemberState() {
    this.setState({
      taskMemberState: !this.state.taskMemberState
    })
  }

  //tag modal update
  tagModalStateUpdate() {
    this.setState({
      tagModal: !this.state.tagModal
    })
  }

  //업무 중요도 업데이트
  callbackUpdateTaskPoint(point, taskListNo, taskNo) {
    const taskListIndex = this.state.taskList.findIndex(taskList => taskList.taskListNo === taskListNo);
    const taskIndex = this.state.taskList[taskListIndex].tasks.findIndex(task => task.taskNo === taskNo);

    ApiNotification.fetchInsertNotice(
      sessionStorage.getItem("authUserNo"),
      sessionStorage.getItem("authUserName"),
      this.state.taskList[taskListIndex].tasks[taskIndex].memberList,
      "taskPointChange",
      taskNo,
      this.props.match.params.projectNo)

    let newPoint = {
      taskNo: taskNo,
      taskPoint: point
    }
    fetch(`${API_URL}/api/tasksetting/point/update`, {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify(newPoint)
    })
      .then(response => response.json())
      .then(json => {
        let newTaskList = update(this.state.taskList, {
          [taskListIndex]: {
            tasks: {
              [taskIndex]: {
                taskPoint: {$set: json.data.taskPoint},
                socketType:{$set:"taskPointChange"},
                authUserNo: {$set:sessionStorage.getItem("authUserNo")},
                projectNo: {$set:this.props.match.params.projectNo},
                members: {$set:this.state.projectMembers},
                taskListIndex:{$set:taskListIndex},
                taskIndex:{$set:taskIndex}
              }
            }
          }
        })
        this.clientRef.sendMessage("/app/all", JSON.stringify(newTaskList[taskListIndex].tasks[taskIndex]))
        this.setState({
          taskList: newTaskList
        })
      })
  }

  //업무 내용 수정하기
  callbackUpdateTaskContents(taskContents, taskListNo, taskNo) {
    const taskListIndex = this.state.taskList.findIndex(taskList => taskList.taskListNo === taskListNo);
    const taskIndex = this.state.taskList[taskListIndex].tasks.findIndex(task => task.taskNo === taskNo);

    ApiHistory.fetchInsertHistory(
      sessionStorage.getItem("authUserNo"),
      sessionStorage.getItem("authUserName"),
      this.state.projectMembers,
      "taskContentsUpdate",
      taskContents,
      this.props.match.params.projectNo,
      this.clientRef)
      .then(response => response.json())
      .then(json =>
        this.setState({
          history: json.data
        })
      )

    let newTaskList = update(this.state.taskList, {
      [taskListIndex]: {
        tasks: {
          [taskIndex]: {
            taskContents: {$set: taskContents},
            socketType:{$set:"taskContentsUpdate"},
            authUserNo: {$set:sessionStorage.getItem("authUserNo")},
            projectNo: {$set:this.props.match.params.projectNo},
            members: {$set:this.state.projectMembers},
            taskListIndex:{$set:taskListIndex},
            taskIndex:{$set:taskIndex}
          }
        }
      }
    })
    this.setState({
      taskList: newTaskList
    })

    this.clientRef.sendMessage("/app/all",JSON.stringify(newTaskList[taskListIndex].tasks[taskIndex]))

    fetch(`${API_URL}/api/tasksetting/task/${taskNo}`, {
      method: 'post',
      headers: API_HEADERS,
      body: taskContents
    })
      .then(response => response.json())

  }
  // 라벨 색 수정하기
  callbackUpdateTaskLabel(color, taskListNo, taskNo) {
    const taskListIndex = this.state.taskList.findIndex(taskList => taskList.taskListNo === taskListNo);
    const taskIndex = this.state.taskList[taskListIndex].tasks.findIndex(task => task.taskNo === taskNo);

    let data = {
      color: color,
      taskListIndex: taskListIndex,
      taskIndex: taskIndex,
      taskNo: taskNo,
      socketType: "labelUpdate",
      projectNo: this.props.match.params.projectNo,
      members: this.state.projectMembers
    }

    let newTaskList = update(this.state.taskList, {
      [taskListIndex]: {
        tasks: {
          [taskIndex]: {
            taskLabel: { $set: color }
          }
        }
      }
    })
    this.setState({
      taskList: newTaskList
    })

    fetch(`${API_URL}/api/tasksetting/tasklabel/${taskNo}`, {
      method: 'post',
      headers: API_HEADERS,
      body: color
    })

    this.clientRef.sendMessage("/app/all", JSON.stringify(data));
  }

  // Project Setting button Click Function
  onProjectSetting(projectNo) {

    if (this.state.setOn) {
      const projectIndex = this.state.projects.findIndex(project => project.projectNo + "" === projectNo);
      let userProject = {
        projectNo: projectNo,
        userNo: window.sessionStorage.getItem("authUserNo")
      }

      fetch(`${API_URL}/api/userproject`, {
        method: 'post',
        headers: API_HEADERS,
        body: JSON.stringify(userProject)
      })
        .then(response => response.json())
        .then(json => {
          this.setState({
            userProject: json.data,
            setOn: false,
            project: this.state.projects[projectIndex]
          })
        })

    } else {
      this.setState({
        setOn: true,
      })
    }

  }

  callbackCloseProjectSetting(setOn) {
    this.setState({
      setOn: setOn
    })
  }

  // CallBack Change Title Function
  callbackProjectTitleChange(projectNo, title) {
    
    let project = {
      projectNo: projectNo,
      projectTitle: title
    }

    const projectIndex = this.state.projects.findIndex(project => project.projectNo == projectNo)
    let membersNo = []
    this.state.projects[projectIndex].members.map(member => {
      membersNo.push(member.userNo);
    })


    fetch(`${API_URL}/api/projectsetting/title`, {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify(project)
    })
      .then(response => response.json())
      .then(json => {
        
        let socketData = {
          projectNo: projectNo,
          projectTitle: json.data.projectTitle,
          socketType: "titleChange",
          membersNo: membersNo
        }

        let kanbanSocketData = {
          projectNo: projectNo,
          projectTitle: json.data.projectTitle,
          socketType: "titleChange",
          members: this.state.projects[projectIndex].members
        }

        this.clientRef.sendMessage("/app/dashboard/all", JSON.stringify(socketData))
        this.clientRef.sendMessage("/app/all", JSON.stringify(kanbanSocketData));
      })
  }

  // CallBack Chnage Desc Function
  callbackProjectDescChange(projectNo, desc) {
    
    let project = {
      projectNo: projectNo,
      projectDesc: desc
    }

    const projectIndex = this.state.projects.findIndex(project => project.projectNo == projectNo)
    let membersNo = []
    this.state.projects[projectIndex].members.map(member => {
      membersNo.push(member.userNo);
    })

    fetch(`${API_URL}/api/projectsetting/desc`, {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify(project)
    })
      .then(response => response.json())
      .then(json => {
        
        let socketData = {
          projectNo: projectNo,
          projectDesc: json.data.projectDesc,
          socketType: "descChange",
          membersNo: membersNo
        }

        let kanbanSocketData = {
          projectNo: projectNo,
          projectDesc: json.data.projectDesc,
          socketType: "descChange",
          members: this.state.projects[projectIndex].members
        }

        this.clientRef.sendMessage("/app/dashboard/all", JSON.stringify(socketData))
        this.clientRef.sendMessage("/app/all", JSON.stringify(kanbanSocketData))
      })
  }

  // CallBack Change State Function
  callbackChangeState(projectNo, state) {
    const projectIndex = this.state.projects.findIndex(project => project.projectNo == projectNo);

    let project = {
      projectNo: projectNo,
      projectState: state
    }

    let membersNo = []
    this.state.projects[projectIndex].members.map(member => {
      membersNo.push(member.userNo);
    })

    fetch(`${API_URL}/api/projectsetting/state`, {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify(project)
    })
      .then(response => response.json())
      .then(json => {

        let socketData = {
          projectNo: projectNo,
          projectState: json.data.projectState,
          membersNo: membersNo,
          socketType: "stateChange"
        }

        let kanbanSocketData = {
          projectNo: projectNo,
          projectState: json.data.projectState,
          members: this.state.projects[projectIndex].members,
          socketType: "stateChange"
        }

        this.clientRef.sendMessage("/app/dashboard/all", JSON.stringify(socketData));
        this.clientRef.sendMessage("/app/all", JSON.stringify(kanbanSocketData));
      })
  }

  callbackProjectDateUpdate(from, to, projectNo) {

    ApiNotification.fetchInsertNotice(
      sessionStorage.getItem("authUserNo"),
      sessionStorage.getItem("authUserName"),
      this.state.project.members,
      "projectDateChange",
      null,
      projectNo
    )
    const projectTitle = this.state.project.projectTitle
    ApiHistory.fetchInsertHistory(
      sessionStorage.getItem("authUserNo"),
      sessionStorage.getItem("authUserName"),
      this.state.project.members,
      "projectDateUpdate",
      projectTitle,
      projectNo,
      this.clientRef)

    if (from == 'Invalid date') {
      from = undefined;
    }
    if (to == 'Invalid date') {
      to = undefined;
    }

    const projectIndex = this.state.projects.findIndex(project =>
      project.projectNo == projectNo)

    let newProject = update(this.state.projects, {
      [projectIndex]: {
        projectStart: {
          $set: from
        },
        projectEnd: {
          $set: to
        }
      }
    })

    let membersNo = []
    this.state.projects[projectIndex].members.map(member => {
      membersNo.push(member.userNo);
    })

    let socketData = {
      from: from,
      to: to,
      membersNo: membersNo,
      projectNo: projectNo,
      socketType: "dateChange"
    }

    let kanbanSocketData = {
      from: from,
      to: to,
      members: this.state.projects[projectIndex].members,
      projectNo: projectNo,
      socketType: "dateChange"
    }

    fetch(`${API_URL}/api/projectsetting/calendar`, {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify(newProject[projectIndex])
    })

    this.clientRef.sendMessage("/app/dashboard/all", JSON.stringify(socketData))
    this.clientRef.sendMessage("/app/all", JSON.stringify(kanbanSocketData))
  }

  // CallBack Add Delete Member Function
  callbackAddDeleteMember(userNo, userName, userPhoto, projectNo, userGrade) {

    const memberIndex = this.state.project.members.findIndex(member =>
      member.userNo == userNo)

    const projectIndex = this.state.projects.findIndex(project =>
      project.projectNo == projectNo)

    let member = {
      userNo: userNo,
      userName: userName,
      userPhoto: userPhoto,
      projectNo: projectNo,
      userGrade: userGrade,
      roleNo: 3
    }

    let newProject;
    if (this.state.project.members[memberIndex] && this.state.project.members[memberIndex].userNo == userNo) {
      fetch(`${API_URL}/api/user/delete/`, {
        method: 'post',
        headers: API_HEADERS,
        body: JSON.stringify(member)
      })

      newProject = update(this.state.projects, {
        [projectIndex]: {
          members: {
            $splice: [[memberIndex, 1]]
          }
        }
      })

      let membersNo = []
      this.state.projects[projectIndex].members.map(member => {
        membersNo.push(member.userNo);
      })

      let socketData = {
        projectNo: projectNo,
        member: member,
        socketType: "userDelete",
        newProject: newProject[projectIndex],
        membersNo: membersNo
      }

      let kanbanSocketData = {
        projectNo: projectNo,
        member: member,
        members: this.state.projects[projectIndex].members,
        userNo: userNo,
        socketType: "userDelete"
      }

      this.clientRef.sendMessage("/app/dashboard/all", JSON.stringify(socketData));
      this.clientRef.sendMessage("/app/all", JSON.stringify(kanbanSocketData));
      this.clientRef.sendMessage("/app/calendar/all", JSON.stringify(kanbanSocketData));
    }
    else {
      let memberArray = [
        member
      ]

      ApiNotification.fetchInsertNotice(
        sessionStorage.getItem("authUserNo"),
        sessionStorage.getItem("authUserName"),
        memberArray,
        "projectJoin",
        null,
        projectNo
      )

      fetch(`${API_URL}/api/user/add/`, {
        method: 'post',
        headers: API_HEADERS,
        body: JSON.stringify(member)
      })

      newProject = update(this.state.projects, {
        [projectIndex]: {
          members: {
            $push: [member]
          }
        }
      })

      let membersNo = []
      newProject[projectIndex].members.map(member => {
        membersNo.push(member.userNo);
      })

      let socketData = {
        projectNo: projectNo,
        member: member,
        socketType: "userAdd",
        newProject: newProject[projectIndex],
        membersNo: membersNo
      }

      const memberIndex = newProject[projectIndex].members.findIndex(member => member.userNo == userNo);

      let kanbanSocketData = {
        projectNo: projectNo,
        members: newProject[projectIndex].members,
        member: newProject[projectIndex].members[memberIndex],
        socketType: "userAdd"
      }

      ApiHistory.fetchInsertHistory(
        sessionStorage.getItem("authUserNo"),
        sessionStorage.getItem("authUserName"),
        this.state.project.members,
        "projectMemberJoin",
        userName,
        projectNo,
        this.clientRef
      )

      this.clientRef.sendMessage("/app/dashboard/all", JSON.stringify(socketData));
      this.clientRef.sendMessage("/app/all", JSON.stringify(kanbanSocketData))
      this.clientRef.sendMessage("/app/calendar/all", JSON.stringify(kanbanSocketData));
    }
  }

  // CallBack Delete Member Function
  callbackDeleteMember(memberNo, projectNo) {

    let userProject = {
      projectNo: projectNo,
      userNo: memberNo
    }

    const projectIndex = this.state.projects.findIndex(project =>
      project.projectNo == projectNo)

    const memberIndex = this.state.project.members.findIndex(
      (member) => member.userNo == memberNo
    );

    fetch(`${API_URL}/api/user/delete`, {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify(userProject)
    })

    let membersNo = []
    this.state.projects[projectIndex].members.map(member => {
      membersNo.push(member.userNo);
    })

    let socketData = {
      projectNo: projectNo,
      userNo: memberNo,
      socketType: "memberDelete",
      membersNo: membersNo
    }

    let kanbanSocketData = {
      projectNo: projectNo,
      userNo: memberNo,
      socketType: "memberDelete",
      members: this.state.projects[projectIndex].members
    }

    this.clientRef.sendMessage("/app/dashboard/all", JSON.stringify(socketData))
    this.clientRef.sendMessage("/app/all", JSON.stringify(kanbanSocketData))
    this.clientRef.sendMessage("/app/calendar/all", JSON.stringify(kanbanSocketData));
  }

  // CallBack Invite Member Function
  callbackInviteMember(projectNo, memberEmail, memberName) {

    const projectIndex = this.state.projects.findIndex(project => project.projectNo == projectNo);

    let member = {
      userNo: this.state.users.length + 1,
      userName: memberName !== "" ? memberName : memberEmail,
      userEmail: memberEmail,
      userPhoto: "/nest/assets/images/arrowloding.jpg",
      projectNo: projectNo,
      roleNo: 3
    }

    const newAlert = {
      id: (new Date()).getTime(),
      type: "success",
      message: this.state.newMessage
    };

    let membersNo = []
    this.state.projects[projectIndex].members.map(member => {
      membersNo.push(member.userNo);
    })

    ApiHistory.fetchInsertHistory(
      sessionStorage.getItem("authUserNo"),
      sessionStorage.getItem("authUserName"),
      this.state.project.members,
      "projectMemberInvite",
      memberName,
      projectNo,
      this.clientRef)

    fetch(`${API_URL}/api/settinguser/invite`, {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify(member)
    }, setTimeout(() => {
      this.setState({
        loading: true
      })
    }))
      .then(response => response.json())
      .then(json => {

        let socketData = {
          projectNo: projectNo,
          data: json.data,
          alerts: [...this.state.alerts, newAlert],
          socketType: "inviteUser",
          membersNo: membersNo
        }

        let kanbanSocketData = {
          projectNo: projectNo,
          data: json.data,
          alerts: [...this.state.alerts, newAlert],
          socketType: "inviteUser",
          members: this.state.projects[projectIndex].members
        }

        this.clientRef.sendMessage("/app/dashboard/all", JSON.stringify(socketData));
        this.clientRef.sendMessage("/app/all", JSON.stringify(kanbanSocketData))

        this.setState({
          alerts: [...this.state.alerts, newAlert],
          loading: false
        })
      })
  }

  // CallBack Member Role Change Function
  callbackRoleChange(projectNo, userNo, roleNo) {
    const projectIndex = this.state.projects.findIndex(project => project.projectNo == projectNo);

    const memberIndex = this.state.project.members.findIndex(member =>
      member.userNo == userNo)

    let userProject = {
      projectNo: projectNo,
      userNo: userNo,
      roleNo: roleNo
    }

    let membersNo = []
    this.state.projects[projectIndex].members.map(member => {
      membersNo.push(member.userNo);
    })

    fetch(`${API_URL}/api/userproject/rolechange`, {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify(userProject)
    })
      .then(response => response.json())
      .then(json => {
        let socketData = {
          projectNo: projectNo,
          userNo: userNo,
          roleNo: json.data.roleNo,
          socketType: "roleChange",
          membersNo: membersNo
        }

        let kanbanSocketData = {
          projectNo: projectNo,
          userNo: userNo,
          roleNo: json.data.roleNo,
          socketType: "roleChange",
          members: this.state.projects[projectIndex].members
        }

        this.clientRef.sendMessage("/app/dashboard/all", JSON.stringify(socketData))
        this.clientRef.sendMessage("/app/all", JSON.stringify(kanbanSocketData))
        this.clientRef.sendMessage("/app/calendar/all", JSON.stringify(kanbanSocketData))
      })
  }

  // CallBack Project Delete Function
  callbackProjectDelete(projectNo, userNo) {
    const projectIndex = this.state.projects.findIndex(project => project.projectNo == projectNo);

    let project = {
      projectNo: projectNo,
      userNo: userNo,
      sessionUserNo: window.sessionStorage.getItem("authUserNo")
    }

    let membersNo = []
    this.state.projects[projectIndex].members.map(member => {
      membersNo.push(member.userNo)
    })

    fetch(`${API_URL}/api/dashboard/delete`, {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify(project)
    })
      .then(response => response.json())
      .then(json => {
        let socketData = {
          projectNo: projectNo,
          userNo: userNo,
          sessionUserNo: window.sessionStorage.getItem("authUserNo"),
          socketType: "projectDelete",
          membersNo: membersNo
        }

        let kanbanSocketData = {
          projectNo: projectNo,
          userNo: userNo,
          sessionUserNo: window.sessionStorage.getItem("authUserNo"),
          socketType: "projectDelete",
          members: this.state.projects[projectIndex].members
        }

        this.clientRef.sendMessage("/app/dashboard/all", JSON.stringify(socketData));
        this.clientRef.sendMessage("/app/all", JSON.stringify(kanbanSocketData));
      })
  }

  // CallBack Not Transfer Role Project Delete Function
  callbackProjectNotTransferDelete(projectNo) {
    const projectIndex = this.state.projects.findIndex(project => project.projectNo == projectNo);

    let project = {
      projectNo: projectNo,
      sessionUserNo: window.sessionStorage.getItem("authUserNo")
    }

    let membersNo = []
    this.state.projects[projectIndex].members.map(member => {
      membersNo.push(member.userNo)
    })

    fetch(`${API_URL}/api/dashboard/notTransferDelete`, {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify(project)
    })
      .then(response => response.json())
      .then(json => {

        let socketData = {
          projectNo: projectNo,
          userNo: sessionStorage.getItem("authUserNo"),
          socketType: "projectNotTransferDelete",
          membersNo: membersNo
        }

        let kanbanSocketData = {
          projectNo: projectNo,
          userNo: sessionStorage.getItem("authUserNo"),
          socketType: "projectNotTransferDelete",
          members: this.state.projects[projectIndex].members
        }

        this.clientRef.sendMessage("/app/dashboard/all", JSON.stringify(socketData));
        this.clientRef.sendMessage("/app/all", JSON.stringify(kanbanSocketData));
      })
  }

  // CallBack Project Forever Delete Function
  callbackProjectForeverDelete(projectNo) {

    let project = {
      projectNo: projectNo
    }

    const projectIndex = this.state.projects.findIndex(project => project.projectNo == projectNo);
    let membersNo = []
    this.state.projects[projectIndex].members.map(member => {
      membersNo.push(member.userNo)
    })

    fetch(`${API_URL}/api/dashboard/foreverdelete`, {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify(project)
    })
      .then(response => response.json())
      .then(json => {
        let socketData = {
          projectNo: projectNo,
          socketType: "foreverDelete",
          membersNo: membersNo
        }

        let kanbanSocketData = {
          projectNo: projectNo,
          socketType: "foreverDelete",
          members: this.state.projects[projectIndex].members
        }

        this.clientRef.sendMessage("/app/dashboard/all", JSON.stringify(socketData))
        this.clientRef.sendMessage("/app/all", JSON.stringify(kanbanSocketData))
        this.clientRef.sendMessage("/app/calendar/all", JSON.stringify(kanbanSocketData))
      })
  }

  editTaskListName(newTaskList) {

    const projectIndex = this.state.projects.findIndex(project => project.projectNo + "" === newTaskList.projectNo + "");
    let members = []
    this.state.projects[projectIndex].members.map(member => members.push(member.userNo))

    fetch(`${API_URL}/api/taskList/editName`, {
      method: "post",
      headers: API_HEADERS,
      body: JSON.stringify(newTaskList),
    });

    newTaskList = update(newTaskList, {
      socketType: { $set: "taskListName" },
      members: { $set: this.state.projectMembers }
    })

    this.clientRef.sendMessage("/app/all", JSON.stringify(newTaskList));
  }

  receiveKanban(socketData) {
    if(socketData.socketType == "descChange") {
      const projectIndex = this.state.projects.findIndex(project => project.projectNo == socketData.projectNo);

      if(projectIndex !== -1) {
        let newProject = update(this.state.projects, {
          [projectIndex]: {
            projectDesc: { $set: socketData.projectDesc }
          }
        })

        if(this.state.project.projectNo !== newProject[projectIndex].projectNo) {
          this.setState({
            projects: newProject
          })
        }
        else if(this.state.project.projectNo == newProject[projectIndex].projectNo) {
          this.setState({
            projects: newProject,
            project: newProject[projectIndex]
          })
        }
        else {
          this.setState({
            projects: newProject,
            project: newProject[projectIndex]
          })
        }
      } 
    }

    if(socketData.socketType == "titleChange") {
      const projectIndex = this.state.projects.findIndex(project => project.projectNo == socketData.projectNo);

      if(projectIndex !== -1) {
        let newProject = update(this.state.projects, {
          [projectIndex]: {
            projectTitle: { $set: socketData.projectTitle }
          }
        })
  
        if(this.state.project.projectNo !== newProject[projectIndex].projectNo) {
          this.setState({
            projects: newProject,
            projectTitle: socketData.projectTitle
          })
        }
        else if(this.state.project.projectNo == newProject[projectIndex].projectNo) {
          this.setState({
            projects: newProject,
            project: newProject[projectIndex],
            projectTitle: socketData.projectTitle
          })
        }
        else {
          this.setState({
            projects: newProject,
            project: newProject[projectIndex],
            projectTitle: socketData.projectTitle
          })
        }
      }
    }

    if(socketData.socketType === "foreverDelete") {
      const projectIndex = this.state.projects.findIndex(project => project.projectNo == socketData.projectNo);

      if(projectIndex !== -1) {
        this.props.history.push("/nest/dashboard")
      }
    }

    if (socketData.socketType === "projectDelete") {
      if (sessionStorage.getItem("authUserNo") == socketData.sessionUserNo) {
        this.props.history.push("/nest/dashboard")
      }
      else if(sessionStorage.getItem("authUserNo") == socketData.userNo) {
        const projectIndex = this.state.projects.findIndex(project => project.projectNo == socketData.projectNo);
        
        if(projectIndex !== -1) {
          const memberIndex = this.state.projects[projectIndex].members.findIndex(member => member.userNo == socketData.userNo);
          const sessionMemberIndex = this.state.projects[projectIndex].members.findIndex(member => member.userNo == socketData.sessionUserNo)

          let newProject = update(this.state.projects, {
            [projectIndex]: {
              members: {
                [memberIndex]: {
                  roleNo: { $set: 1 }
                },
              },
              roleNo: { $set: 1 }
            }
          })

          let deleteProject = update(newProject, {
            [projectIndex]: {
              members: {
                $splice: [[sessionMemberIndex, 1]]
              }
            }
          })

          let userProject = update(this.state.userProject, {
            roleNo: { $set: 1 } 
          })

          let projectMemberProject = update(this.state.projectMembers, {
            [memberIndex]: {
              roleNo: { $set: 1 }
            }
          })

          let projectMemberDeleteProject = update(projectMemberProject, {
            $splice: [[sessionMemberIndex, 1]]
          })

          let multiTask = [];
          let taskList = this.state.taskList;
          taskList.map(taskList => {
            taskList.tasks.map(task => {
              let memberIndex = task.memberList.findIndex(member => member.userNo == socketData.sessionUserNo);
              if(memberIndex !== -1) {
                multiTask.push(task.taskNo);
              }
            })
          })

          let jsonMultiTask = {
            multiTask: multiTask
          }

          fetch(`${API_URL}/api/task/member/${socketData.sessionUserNo}`, {
            method: 'post',
            headers: API_HEADERS,
            body: JSON.stringify(jsonMultiTask)
          })
            .then(response => response.json())
            .then(json => {
              let taskList = this.state.taskList;
              taskList.map(taskList => {
                taskList.tasks.map(task => {
                  let memberIndex = task.memberList.findIndex(member => member.userNo == socketData.sessionUserNo);
                  if(memberIndex !== -1) {
                    task.memberList.splice(memberIndex, 1);
                  }
                })
              })

              if(this.state.project.projectNo !== deleteProject[projectIndex].projectNo) {
                this.setState({
                  projects: deleteProject
                })
              }
              else if(this.state.project.projectNo == deleteProject[projectIndex].projectNo) {
                this.setState({
                  taskList: taskList,
                  projectMembers: projectMemberDeleteProject,
                  projects: deleteProject,
                  project: deleteProject[projectIndex],
                  userProject: userProject
                })
              }
              else {
                this.setState({
                  taskList: taskList,
                  projectMembers: projectMemberDeleteProject,
                  projects: deleteProject,
                  project: deleteProject[projectIndex],
                  userProject: userProject
                })
              }
            })
        }
      }
      else {
        const projectIndex = this.state.projects.findIndex(project => project.projectNo === socketData.projectNo);

        if(projectIndex !== -1) {
          const memberIndex = this.state.projects[projectIndex].members.findIndex(member => member.userNo === socketData.userNo);
          const sessionMemberIndex = this.state.projects[projectIndex].members.findIndex(member => member.userNo == socketData.sessionUserNo);

          let newProject = update(this.state.projects, {
            [projectIndex]: {
              members: {
                [memberIndex]: {
                  roleNo: { $set: 1 }
                },
              }
            }
          })

          let deleteProject = update(newProject, {
            [projectIndex]: {
              members: {
                $splice: [[sessionMemberIndex, 1]]
              }
            }
          })

          let projectMemberProject = update(this.state.projectMembers, {
            [memberIndex]: {
              roleNo: { $set: 1 }
            }
          })

          let projectMemberDeleteProject = update(projectMemberProject, {
            $splice: [[sessionMemberIndex, 1]]
          })

          let multiTask = [];
          let taskList = this.state.taskList;
          taskList.map(taskList => {
            taskList.tasks.map(task => {
              let memberIndex = task.memberList.findIndex(member => member.userNo == socketData.sessionUserNo);
              if(memberIndex !== -1) {
                multiTask.push(task.taskNo);
              }
            })
          })

          let jsonMultiTask = {
            multiTask: multiTask
          }

          fetch(`${API_URL}/api/task/member/${socketData.sessionUserNo}`, {
            method: 'post',
            headers: API_HEADERS,
            body: JSON.stringify(jsonMultiTask)
          })
            .then(response => response.json())
            .then(json => {
              let taskList = this.state.taskList;
              taskList.map(taskList => {
                taskList.tasks.map(task => {
                  let memberIndex = task.memberList.findIndex(member => member.userNo == socketData.sessionUserNo);
                  if(memberIndex !== -1) {
                    task.memberList.splice(memberIndex, 1);
                  }
                })
              })

              this.setState({
                projectMembers: projectMemberDeleteProject,
                projects: deleteProject,
                project: deleteProject[projectIndex]
              })
            })
        }
      }
    }

    if (socketData.socketType === "projectNotTransferDelete") {
      if (sessionStorage.getItem("authUserNo") == socketData.userNo) {
        const projectIndex = this.state.projects.findIndex(project => project.projectNo == socketData.projectNo)
        const memberIndex = this.state.projectMembers.findIndex(member => member.userNo === socketData.userNo);

        let deleteProject = update(this.state.projects, {
          $splice: [[projectIndex, 1]]
        })

        this.props.history.push("/nest/dashboard")
        
        let projectMembers = update(this.state.projectMembers, {
          $splice: [[memberIndex, 1]]
        })

        this.setState({
          projects: deleteProject,
          projectMembers: projectMembers
        })
      }
      else {
        const projectIndex = this.state.projects.findIndex(project => project.projectNo == socketData.projectNo)

        if (projectIndex !== -1) {
          const memberIndex = this.state.projects[projectIndex].members.findIndex(member => member.userNo == socketData.userNo)

          let deleteProject = update(this.state.projects, {
            [projectIndex]: {
              members: {
                $splice: [[memberIndex, 1]]
              }
            }
          })

          let projectMembers = update(this.state.projectMembers, {
            $splice: [[memberIndex, 1]]
          })

          let multiTask = [];
          let taskList = this.state.taskList;
          taskList.map(taskList => {
            taskList.tasks.map(task => {
              let memberIndex = task.memberList.findIndex(member => member.userNo == socketData.userNo);
              if(memberIndex !== -1) {
                multiTask.push(task.taskNo);
              }
            })
          })

          let jsonMultiTask = {
            multiTask: multiTask
          }

          fetch(`${API_URL}/api/task/member/${socketData.userNo}`, {
            method: 'post',
            headers: API_HEADERS,
            body: JSON.stringify(jsonMultiTask)
          })
            .then(response => response.json())
            .then(json => {
              let taskList = this.state.taskList;
              taskList.map(taskList => {
                taskList.tasks.map(task => {
                  let memberIndex = task.memberList.findIndex(member => member.userNo == socketData.userNo);
                  if(memberIndex !== -1) {
                    task.memberList.splice(memberIndex, 1);
                  }
                })
              })          
            
              if (this.state.project.projectNo !== deleteProject[projectIndex].projectNo) {
                this.setState({
                  projects: deleteProject
                })
              }
              else if (this.state.project.projectNo == deleteProject[projectIndex].projectNo) {
                this.setState({
                  taskList: taskList,
                  projects: deleteProject,
                  project: deleteProject[projectIndex],
                  projectMembers: projectMembers
                })
              }
              else {
                this.setState({
                  taskList: taskList,
                  projects: deleteProject,
                  project: deleteProject[projectIndex],
                  projectMembers: projectMembers
                })
              }
            })
        }
      }
    }

    if (socketData.socketType == "inviteUser") {
      const projectIndex = this.state.projects.findIndex(project => project.projectNo == socketData.projectNo);

      if (projectIndex !== -1) {
        let projectMember = {
          projectNo: socketData.data.projectNo,
          roleNo: socketData.data.roleNo,
          userEmail: socketData.data.userEmail,
          userGrade: "준회원",
          userNo: socketData.data.userNo,
          userPhoto: socketData.data.userPhoto
        }

        let projectMembers = update(this.state.projectMembers, {
          $push: [projectMember]
        })
        
        let newProject = update(this.state.projects, {
          [projectIndex]: {
            members: {
              $push: [socketData.data]
            }
          }
        })

        let users = update(this.state.users, {
          $push: [socketData.data]
        })

        if (this.state.project.projectNo !== newProject[projectIndex].projectNo) {
          this.setState({
            users: users,
            projects: newProject
          })
        }
        else if (this.state.project.projectNo == newProject[projectIndex].projectNo) {
          this.setState({
            users: users,
            projects: newProject,
            project: newProject[projectIndex],
            projectMembers: projectMembers
          })
        }
        else {
          this.setState({
            users: users,
            projects: newProject,
            project: newProject[projectIndex],
            projectMembers: projectMembers
          })
        }
      }
    }

    if (socketData.socketType == "dateChange") {
      const projectIndex = this.state.projects.findIndex(project =>
        project.projectNo == socketData.projectNo)

      if (projectIndex !== -1) {
        let newProject = update(this.state.projects, {
          [projectIndex]: {
            projectStart: {
              $set: socketData.from
            },
            projectEnd: {
              $set: socketData.to
            }
          }
        })

        if (this.state.project.projectNo !== newProject[projectIndex].projectNo) {
          this.setState({
            projects: newProject
          })
        }
        else if (this.state.project.projectNo == newProject[projectIndex].projectNo) {
          this.setState({
            projects: newProject,
            project: newProject[projectIndex]
          })
        }
        else {
          this.setState({
            projects: newProject,
            project: newProject[projectIndex]
          })
        }
      }
    }

    if (socketData.socketType == "stateChange") {
      const projectIndex = this.state.projects.findIndex(project => project.projectNo == socketData.projectNo);

      if (projectIndex !== -1) {
        let newProject = update(this.state.projects, {
          [projectIndex]: {
            projectState: { $set: socketData.projectState }
          }
        })

        if (this.state.project.projectNo !== newProject[projectIndex].projectNo) {
          this.setState({
            projects: newProject
          })
        }
        else if (this.state.project.projectNo == newProject[projectIndex].projectNo) {
          this.setState({
            projects: newProject,
            project: newProject[projectIndex]
          })
        }
        else {
          this.setState({
            projects: newProject,
            project: newProject[projectIndex]
          })
        }
      }
    }

    if (socketData.socketType === "roleChange") {
      if (sessionStorage.getItem("authUserNo") == socketData.userNo) {
        const projectIndex = this.state.projects.findIndex(project => project.projectNo == socketData.projectNo);

        if (projectIndex !== -1) {
          const memberIndex = this.state.projects[projectIndex].members.findIndex(member => member.userNo == socketData.userNo)

          let newProject = update(this.state.projects, {
            [projectIndex]: {
              members: {
                [memberIndex]: {
                  roleNo: { $set: socketData.roleNo }
                }
              },
              roleNo: { $set: socketData.roleNo }
            }
          })

          let userProject = {
            projectNo: newProject[projectIndex].projectNo,
            userNo: socketData.userNo,
            roleNo: socketData.roleNo
          }

          if (this.state.project.projectNo !== newProject[projectIndex].projectNo) {
            this.setState({
              authUserRole: socketData.roleNo,
              projects: newProject
            })
          }
          else if (this.state.project.projectNo == newProject[projectIndex].projectNo) {
            this.setState({
              authUserRole: socketData.roleNo,
              userProject: userProject,
              projects: newProject,
              project: newProject[projectIndex]
            })
          }
          else {
            this.setState({
              authUserRole: socketData.roleNo,
              userProject: userProject,
              projects: newProject,
              project: newProject[projectIndex]
            })
          }
        }
      }
      else {
        const projectIndex = this.state.projects.findIndex(project => project.projectNo == socketData.projectNo);

        if (projectIndex !== -1) {
          const memberIndex = this.state.projects[projectIndex].members.findIndex(member => member.userNo == socketData.userNo)

          let newProject = update(this.state.projects, {
            [projectIndex]: {
              members: {
                [memberIndex]: {
                  roleNo: { $set: socketData.roleNo }
                }
              },
            }
          })

          if (this.state.project.projectNo !== newProject[projectIndex].projectNo) {
            this.setState({
              projects: newProject
            })
          }
          else if (this.state.project.projectNo == newProject[projectIndex].projectNo) {
            this.setState({
              projects: newProject,
              project: newProject[projectIndex]
            })
          }
          else {
            this.setState({
              projects: newProject,
              project: newProject[projectIndex]
            })
          }
        }
      }
    }

    if (socketData.socketType === "memberDelete") {
      if (sessionStorage.getItem("authUserNo") == socketData.userNo) {
        const memberIndex = this.state.projectMembers.findIndex(member => member.userNo === socketData.userNo);

        if (sessionStorage.getItem("authUserNo") == socketData.userNo) {
          this.props.history.push("/nest/dashboard")
        }

        let projectMembers = update(this.state.projectMembers, {
          $splice: [[memberIndex, 1]]
        })

        this.setState({
          projectMembers: projectMembers
        })
      }
      else {
        const projectIndex = this.state.projects.findIndex(project => project.projectNo == socketData.projectNo)

        if (projectIndex !== -1) {
          const memberIndex = this.state.projects[projectIndex].members.findIndex(member => member.userNo == socketData.userNo)

          let deleteMemberProject = update(this.state.projects, {
            [projectIndex]: {
              members: {
                $splice: [[memberIndex, 1]]
              }
            }
          })

          let projectMembers = update(this.state.projectMembers, {
            $splice: [[memberIndex, 1]]
          })

          let multiTask = [];
          let taskList = this.state.taskList;
          taskList.map(taskList => {
            taskList.tasks.map(task => {
              let memberIndex = task.memberList.findIndex(member => member.userNo == socketData.userNo);
              if(memberIndex !== -1) {
                multiTask.push(task.taskNo);
              }
            })
          })

          let jsonMultiTask = {
            multiTask: multiTask
          }

          fetch(`${API_URL}/api/task/member/${socketData.userNo}`, {
            method: 'post',
            headers: API_HEADERS,
            body: JSON.stringify(jsonMultiTask)
          })
            .then(response => response.json())
            .then(json => {
              let taskList = this.state.taskList;
              taskList.map(taskList => {
                taskList.tasks.map(task => {
                  let memberIndex = task.memberList.findIndex(member => member.userNo == socketData.userNo);
                  if(memberIndex !== -1) {
                    task.memberList.splice(memberIndex, 1);
                  }
                })
              })

              if (this.state.project.projectNo !== deleteMemberProject[projectIndex].projectNo) {
                this.setState({
                  projects: deleteMemberProject
                })
              }
              else if (this.state.project.projectNo == deleteMemberProject[projectIndex].projectNo) {
                this.setState({
                  taskList: taskList,
                  projects: deleteMemberProject,
                  projectMembers: projectMembers,
                  project: deleteMemberProject[projectIndex]
                })
              }
              else {
                this.setState({
                  taskList: taskList,
                  projects: deleteMemberProject,
                  projectMembers: projectMembers,
                  project: deleteMemberProject[projectIndex]
                })
              }
            })
        }
      }
    }

    if (socketData.socketType === "userDelete") {
      if (sessionStorage.getItem("authUserNo") == socketData.member.userNo) {
        const memberIndex = this.state.projectMembers.findIndex(member => member.userNo === socketData.userNo);
        
        this.props.history.push("/nest/dashboard")
        
        let projectMembers = update(this.state.projectMembers, {
          $splice: [[memberIndex, 1]]
        })
        
        this.setState({
          projectMembers: projectMembers
        })
      }
      else {
        const projectIndex = this.state.projects.findIndex(project => project.projectNo == socketData.projectNo);

        if (projectIndex !== -1) {
          const memberIndex = this.state.projects[projectIndex].members.findIndex(member => member.userNo == socketData.member.userNo);

          let newProject = update(this.state.projects, {
            [projectIndex]: {
              members: {
                $splice: [[memberIndex, 1]]
              }
            }
          })

          let projectMembers = update(this.state.projectMembers, {
            $splice: [[memberIndex, 1]]
          })

          let multiTask = [];
          let taskList = this.state.taskList;
          taskList.map(taskList => {
            taskList.tasks.map(task => {
              let memberIndex = task.memberList.findIndex(member => member.userNo == socketData.userNo);
              if(memberIndex !== -1) {
                multiTask.push(task.taskNo);
              }
            })
          })

          let jsonMultiTask = {
            multiTask: multiTask
          }

          fetch(`${API_URL}/api/task/member/${socketData.userNo}`, {
            method: 'post',
            headers: API_HEADERS,
            body: JSON.stringify(jsonMultiTask)
          })
            .then(response => response.json())
            .then(json => {
              let taskList = this.state.taskList;
              taskList.map(taskList => {
                taskList.tasks.map(task => {
                  let memberIndex = task.memberList.findIndex(member => member.userNo == socketData.userNo);
                  if(memberIndex !== -1) {
                    task.memberList.splice(memberIndex, 1);
                  }
                })
              })
    
              if (this.state.project.projectNo !== newProject[projectIndex].projectNo) {
                this.setState({
                  projects: newProject
                })
              }
              else if (this.state.project.projectNo == newProject[projectIndex].projectNo) {
                this.setState({
                  taskList: taskList,
                  projects: newProject,
                  project: newProject[projectIndex],
                  projectMembers: projectMembers
                })
              }
              else {
                this.setState({
                  taskList: taskList,
                  projects: newProject,
                  project: newProject[projectIndex],
                  projectMembers: projectMembers
                })
              }
            })
        }
      }
    }

    if (socketData.socketType === "userAdd") {
      if (sessionStorage.getItem("authUserNo") == socketData.member.userNo) {
        socketData.newProject["roleNo"] = 3;

        let newProject = update(this.state.projects, {
          $push: [socketData.newProject],
        })

        let projectMembers = update(this.state.projectMembers, {
          $push: [socketData.member]
        })

        this.setState({
          projects: newProject,
          projectMembers: projectMembers
        })
      }
      else {
        const projectIndex = this.state.projects.findIndex(project => project.projectNo == socketData.projectNo)

        if (projectIndex !== -1) {
          let newProject = update(this.state.projects, {
            [projectIndex]: {
              members: {
                $push: [socketData.member]
              }
            }
          })

          if (this.state.project.projectNo !== newProject[projectIndex].projectNo) {
            this.setState({
              projects: newProject
            })
          }
          else if (this.state.project.projectNo == newProject[projectIndex].projectNo) {
            this.setState({
              projects: newProject,
              project: newProject[projectIndex]
            })
          }
          else {
            this.setState({
              projects: newProject,
              project: newProject[projectIndex]
            })
          }
        }
      }
    }

    if(socketData.socketType === "allTagUpdate"){
      let Indexs = []
  
      this.state.taskList.map( (taskList,taskListIndex) => 
      taskList.tasks.map((task,taskIndex) => 
        task.tagList.map((tag,tagIndex) => tag.tagNo === socketData.tagNo ? 
        Indexs.push({taskListIndex, taskIndex, tagIndex})
        : null
      )))
  
  
      Indexs.map(index => 
        this.setState({
          taskList:update(this.state.taskList,{
            [index.taskListIndex]:{
              tasks:{
                [index.taskIndex]:{
                  tagList:{
                    [index.tagIndex]:{
                      tagName:{$set:socketData.tagName},
                      tagColor:{$set:socketData.tagColor}
                    }
                  }
                }
              }
            }
          })
        })
      )
    } else if(socketData.socketType === "allTagDelete"){
      let Indexs = []
      this.state.taskList.map((taskList, taskListIndex) => 
        taskList.tasks.map((task,taskIndex) => 
          task.tagList.map((tag, tagIndex) => 
            tag.tagNo === socketData.tagNo ? 
            Indexs.push({taskListIndex, taskIndex, tagIndex}) : null
          )
        )
      )
  
  
      Indexs.map(index => 
        this.setState({
          taskList: update(this.state.taskList,{
            [index.taskListIndex]:{
              tasks:{
                [index.taskIndex]:{
                  tagList:{
                    $splice:[[index.tagIndex,1]],
                  }
                }
              }
            }
          })
        }),
      )
    }
    if(socketData.projectNo+"" === this.props.location.pathname.split('/')[3]){
      if(socketData.socketType === 'taskListName'){
      
        const taskListIndex =this.state.taskList.findIndex(taskList => taskList.taskListNo === socketData.taskListNo);
    
        let newData = update(this.state.taskList, {
          [taskListIndex] : {
            taskListName :{
              $set:socketData.taskListName
            }
          }
        })
        
        this.setState({
          taskList: newData
        })
      }else if(socketData.socketType === 'taskListInsert'){
       
        
        let newTaskList = update(this.state.taskList, {
              $push:[socketData]
        })
        this.setState({
          taskList: newTaskList,
        });
      }else if(socketData.socketType === 'taskListDelete'){
       
        let newTaskList = this.state.taskList;
    
        newTaskList = update (newTaskList,{
          $push:[this.state.taskList[socketData.TaskListIndex]]
        })
  
        newTaskList = update(newTaskList, {
          $splice: [[socketData.TaskListIndex, 1]],
        });
        
        this.state.taskList.map((taskList, index) => {
            newTaskList = update(newTaskList, {
              [index]: {
                taskListOrder: { $set: index+1 },
              },
            });
        });
  
        newTaskList[newTaskList.length-1].tasks.map((task,index) => {
          newTaskList = update(newTaskList , {
            [newTaskList.length-1]:{
              tasks:{
                [index]:{
                  taskState : {$set:"del"}
                }
              }
            }
          })
        });
  
        newTaskList = update(newTaskList, {
          [newTaskList.length-1]:{
            taskListState:{$set:"F"}
          }
        });
        this.setState({
          taskList: newTaskList,
        });
        
      }else if(socketData.socketType === 'taskListDnD'){
        if(socketData.userNo === sessionStorage.getItem("authUserNo")){
          return;
        }
          const { destination, source, type } = socketData.result;
          
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
          this.setState({
            taskList: newTaskList,
          });
        
          
      }else if(socketData.socketType === 'taskInsert'){
        const TaskListIndex = this.state.taskList.findIndex(
          (taskList) => taskList.taskListNo == socketData.taskListNo
        );
        
        let newTaskList = this.state.taskList;
        newTaskList[TaskListIndex].tasks.splice(0, 0, socketData);
        this.setState({
          taskList: newTaskList,
          taskCount: socketData.taskCount,
          completedTask: socketData.completedTask
        });
  
      }else if(socketData.socketType === 'taskDelete'){
      
        const TaskListIndex = this.state.taskList.findIndex(
          (taskList) => taskList.taskListNo === socketData.taskListNo
          );
          
        const TaskIndex = this.state.taskList[TaskListIndex].tasks.findIndex(
          (task) => task.taskNo === socketData.taskId
        );
    
        
        const taskListLength = this.state.taskList[TaskListIndex].tasks.length;
        
        let newTaskList = update(this.state.taskList, {
          [TaskListIndex]: {
            tasks: {
              $splice: [[TaskIndex, 1]],
            },
          },
        });
        newTaskList = update(newTaskList, {
          [TaskListIndex]: {
            tasks: {
              $push: [this.state.taskList[TaskListIndex].tasks[TaskIndex]],
            },
          },
        });
        newTaskList = update(newTaskList, {
          [TaskListIndex]: {
            tasks: {
              [taskListLength-1] : {
                taskState:{$set:"del"}
              }
            },
          },
        });
    
    
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
  
        this.setState({
          taskList: newTaskList,
        });
    
        const deleteTask = {
          startTasks: newTaskList[TaskListIndex].tasks,
          reOrderTask: socketData.taskId,
          
        };
        if(sessionStorage.getItem("authUserNo") === socketData.userNo){
          fetch(`${API_URL}/api/task/delete`, {
            method: "post",
            headers: API_HEADERS,
            body: JSON.stringify(deleteTask),
          });
        }
       
    
        
      }else if(socketData.socketType === 'taskCopy'){
    
       
      
        const task = this.state.taskList[socketData.taskListIndex].tasks[socketData.taskIndex];
        
            let newTasks = this.state.taskList[socketData.taskListIndex].tasks;
            newTasks.splice(socketData.taskIndex + 1, 0, {});
            newTasks = update(newTasks, {
              [socketData.taskIndex + 1]: {
                $set: {
                  commentList: [],
                  taskStart: task.taskStart,
                  taskEnd: task.taskEnd,
                  taskOrder: null,
                  tagList: task.tagList,
                  taskState: task.taskState,
                  memberList: task.memberList,
                  taskContents: `${task.taskContents}_copy`,
                  taskNo: socketData.taskNo + "",
                  checkList: task.checkList,
                  taskPoint: task.taskPoint,
                  taskLabel: task.taskLabel,
                  fileList: [],
                },
              },
            });
    
            let newTaskList = update(this.state.taskList, {
              [socketData.taskListIndex]: {
                tasks: {
                  $set: newTasks,
                },
              },
            });
    
            const taskListLength = newTaskList[socketData.taskListIndex].tasks.length;
            newTaskList[socketData.taskListIndex].tasks.map((task, index) => {
              newTaskList = update(newTaskList, {
                [socketData.taskListIndex]: {
                  tasks: {
                    [index]: {
                      taskOrder: { $set: taskListLength - index },
                    },
                  },
                },
              });
            });
    
            if (newTaskList[socketData.taskListIndex].tasks[socketData.taskIndex].tagList.length !== 0) {
              newTaskList[socketData.taskListIndex].tasks[socketData.taskIndex].tagList.map(
                (tag, index) => {
                  newTaskList = update(newTaskList, {
                    [socketData.taskListIndex]: {
                      tasks: {
                        [socketData.taskIndex]: {
                          tagList: {
                            [index]: {
                              taskNo: {
                                $set: socketData.taskNo,
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
              newTaskList[socketData.taskListIndex].tasks[socketData.taskIndex].checkList.length !== 0
            ) {
              newTaskList[socketData.taskListIndex].tasks[socketData.taskIndex].checkList.map(
                (checkList, index) => {
                  newTaskList = update(newTaskList, {
                    [socketData.taskListIndex]: {
                      tasks: {
                        [socketData.taskIndex]: {
                          checkList: {
                            [index]: {
                              taskNo: {
                                $set: socketData.taskNo,
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
    
            if(sessionStorage.getItem("authUserNo") === socketData.userNo){
    
              fetch(`${API_URL}/api/task/reOrder/sameList`, {
                method: "post",
                headers: API_HEADERS,
                body: JSON.stringify(newTaskList[socketData.taskListIndex].tasks),
              });
            }
            this.setState({
              taskList: newTaskList,
            });
          
      }else if(socketData.socketType === 'taskCheck'){
        
    
        const TaskListIndex = this.state.taskList.findIndex(
          (taskList) => taskList.taskListNo === socketData.taskListNo
        );
    
        const TaskIndex = this.state.taskList[TaskListIndex].tasks.findIndex(
          (task) => task.taskNo === socketData.taskId
        );
    
        if(this.state.taskList[TaskListIndex].tasks[TaskIndex].taskState === "do"){
    
          let doneIndex = [];
    
          this.state.taskList[TaskListIndex].tasks.map((task,index)=> task.taskState === 'done' ?  doneIndex.push(index) : null)
          if(doneIndex[0] === undefined){
            doneIndex.push(this.state.taskList[TaskListIndex].tasks.length)
          }
    
          let newTaskList = update(this.state.taskList, {
            [TaskListIndex]: {
              tasks: {
                [TaskIndex]: {
                  taskState: { $set: 'done' },
                },
              },
            },
          });
    
          newTaskList[TaskListIndex].tasks.splice(doneIndex[0], 0, newTaskList[TaskListIndex].tasks[TaskIndex]); 
          
          newTaskList[TaskListIndex].tasks.splice(TaskIndex, 1); 
    
          let tasksLength = newTaskList[TaskListIndex].tasks.length
          
          newTaskList[TaskListIndex].tasks.map((task, index) => 
          {
            newTaskList = update(newTaskList, {
                [TaskListIndex]: {
                  tasks: {
                    [index]: {
                      taskOrder: { $set: tasksLength },
                    },
                  },
                },
              })
              tasksLength = tasksLength -1 
            }
    
          )
    
          fetch(`${API_URL}/api/task/state`, {
            method: "post",
            headers: API_HEADERS,
            body: JSON.stringify(newTaskList[TaskListIndex].tasks),
          })
    
          this.setState({
            taskList: newTaskList,
          });
        }else{
          let doIndex = 0;
          let test = 0;
    
          this.state.taskList[TaskListIndex].tasks.map((task,index)=> task.taskState === 'do' ?  doIndex = index: test = test+1)
    
          let newTaskList = update(this.state.taskList, {
            [TaskListIndex]: {
              tasks: {
                [TaskIndex]: {
                  taskState: { $set: 'do'},
                },  
              },
            },
          });
    
          if(test ===  newTaskList[TaskListIndex].tasks.length){
            newTaskList[TaskListIndex].tasks.splice(doIndex, 0, newTaskList[TaskListIndex].tasks[TaskIndex]); 
          }else{
            newTaskList[TaskListIndex].tasks.splice(doIndex+1, 0, newTaskList[TaskListIndex].tasks[TaskIndex]); 
          }
          
          newTaskList[TaskListIndex].tasks.splice(TaskIndex+1, 1);  
          
          let tasksLength = newTaskList[TaskListIndex].tasks.length
          
          newTaskList[TaskListIndex].tasks.map((task, index) => 
          {
              newTaskList = update(newTaskList, {
                [TaskListIndex]: {
                  tasks: {
                    [index]: {
                      taskOrder: { $set: tasksLength },
                    },
                  },
                },
              })
              tasksLength = tasksLength -1 
            }
            )
            
            fetch(`${API_URL}/api/task/state`, {
              method: "post",
              headers: API_HEADERS,
              body: JSON.stringify(newTaskList[TaskListIndex].tasks),
            })
    
          this.setState({
            taskList: newTaskList,
          });
        }
      }else if(socketData.socketType === 'taskDnD'){
        if(socketData.userNo !== sessionStorage.getItem("authUserNo")){
    
        
        const {destination, source, type} = socketData.result
    
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
    
        this.setState({
          taskList: newTaskList,
        });
      }
    
      } else if(socketData.socketType === 'taskCheckListUpdate'){

      let newTaskList = update(this.state.taskList, {
        [socketData.taskListIndex]: {
          tasks: {
            [socketData.taskIndex]: {
              checkList: {
                [socketData.checklistIndex]: {
                  checklistState: {
                    $set: socketData.checklistState === "done" ? "do" : "done",
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
  
      }else if(socketData.authUserNo !== sessionStorage.getItem("authUserNo")){
        if(socketData.socketType === 'comment'){
            console.log("!!???")
            let newData = update(this.state.taskList, {
              [socketData.taskListIndex] : {
                tasks :{
                  [socketData.taskIndex] : {
                    commentList : 
                      {$push: [socketData]} ,
                    fileList : 
                      {$push: [socketData]} 
                  }
                }
              }
            })
          
            this.setState({
              taskList: newData,
              history:this.state.history
            })
        } else if(socketData.socketType === 'commentDelete'){
            
            const taskListIndex = this.state.taskList.findIndex((taskList) => taskList.taskListNo === socketData.taskListNo+"");
            const taskIndex = this.state.taskList[taskListIndex].tasks.findIndex((task) => task.taskNo === socketData.taskNo+"");
            const commentIndex = this.state.taskList[taskListIndex].tasks[taskIndex].commentList.findIndex((comment) => comment.commentNo === socketData.commentNo);
            const fileIndex = this.state.taskList[taskListIndex].tasks[taskIndex].fileList.findIndex((file) => file.fileNo === socketData.fileNo);

          if (socketData.fileNo === null) {
            socketData.fileNo = 0;
          }
              let newTaskList = update(this.state.taskList, {
                [taskListIndex]: {
                  tasks: {
                    [taskIndex]: {
                      commentList: {
                        [commentIndex]: {
                          commentState: { $set: 'F' }
                        }
                      },
                    },
                  },
                },
              });
              
              if (fileIndex !== -1) {
                newTaskList = update(newTaskList, {
                  [taskListIndex]: {
                    tasks: {
                      [taskIndex]: {
                        fileList: {
                          [fileIndex]: {
                            fileState: { $set: 'F' }
                          }
                        },
                        commentList: {
                          [commentIndex]: {
                            fileState: { $set: 'F' }
                          }
                        }
                      },
                    },
                  },
                });
      
              }
              this.setState({
                taskList: newTaskList
              })
          
        } else if (socketData.socketType === 'fileUpload'){
          let newTaskList = update(this.state.taskList, {
            [socketData.taskListIndex]: {
              tasks: {
                [socketData.taskIndex]: {
                  fileList: {
                    $push: [socketData.formData],
                  },
                },
              },
            },
          });
      
          this.setState({
            taskList: newTaskList,
          });
        } else if(socketData.socketType === 'dateUpdate'){
          if(socketData.from === 'Invalid date'){
            socketData.from = undefined;
          }
          if(socketData.to === 'Invalid date'){
            socketData.to = undefined;
          }
          
          let newTaskList = update(this.state.taskList, {
            [socketData.taskListIndex]: {
              tasks: {
                [socketData.taskIndex]: {
                  taskStart: {
                    $set: moment(socketData.from).format("YYYY-MM-DD HH:mm"),
                  },
                  taskEnd: {
                    $set: moment(socketData.to).format("YYYY-MM-DD HH:mm"),
                  },
                },
              },
            },
          });
          this.setState({
            taskList:newTaskList
          })
        } else if(socketData.socketType === "labelUpdate"){
          let newTaskList = update(this.state.taskList,{
            [socketData.taskListIndex]:{
              tasks:{
                [socketData.taskIndex]:{
                  taskLabel:{$set: socketData.color}
                }
              }
            }
          })
          this.setState({
            taskList:newTaskList
          })
    
          fetch(`${API_URL}/api/tasksetting/tasklabel/${socketData.taskNo}`,{
            method:'post',
            headers:API_HEADERS,
            body:socketData.color
          })
        } else if(socketData.socketType === "taskTagAdd"){
          let newTagData = update(this.state.taskList, {
            [socketData.taskListIndex] : {
              tasks :{
                [socketData.taskIndex] : {
                  tagList : 
                    {$push: [socketData]} 
                }
              }
            }
          })
          this.onSetStateTaskTagNo(newTagData[socketData.taskListIndex].tasks[socketData.taskIndex])
          this.setState({
            taskList: newTagData
          })
    
        } else if(socketData.socketType === "taskTagDelete"){
          fetch(`${API_URL}/api/tag/delete/${socketData.taskNo}/${socketData.tagNo}`, {
            method: "delete"
          })
          .then(response => response.json())
          .then(json => {
            let newTaskList = update(this.state.taskList, {
              [socketData.taskListIndex]: {
                tasks: {
                  [socketData.taskIndex]: {
                    tagList: {
                      $splice: [[socketData.tagIndex, 1]],
                    },
                  },
                },
              },
            });
          this.onSetStateTaskTagNo(newTaskList[socketData.taskListIndex].tasks[socketData.taskIndex])
          this.setState({
            taskList: newTaskList,
          });
        })
       // } 
        } else if(socketData.socketType === "checklistInsert"){
          let newTaskList = update(this.state.taskList, {
            [socketData.taskListIndex]: {
              tasks: {
                [socketData.taskIndex]: {
                  checkList: {
                    $push: [socketData],
                  },
                },
              },
            },
          });
          this.setState({
            taskList:newTaskList
          })
        } else if(socketData.socketType === "checkListDelete"){

          fetch(`${API_URL}/api/tasksetting/checklist/${socketData.checklistNo}`, {
            method:'delete'
          })
          .then(response => response.json())
          .then(json => {
            let newTaskList = update(this.state.taskList, {
              [socketData.taskListIndex]:{
                tasks:{
                  [socketData.taskIndex]:{
                    checkList:{
                      $splice:[[socketData.checkListIndex,1]]
                    }
                  }
                }
              }
            })
    
            this.setState({
              taskList: newTaskList
            })
          })
        }else if(socketData.socketType === "checkListUpdate"){

            let newTaskList = update(this.state.taskList, {
              [socketData.taskListIndex]:{
                tasks:{
                  [socketData.taskIndex]:{
                    checkList:{
                      [socketData.checkListIndex] :{
                        checklistContents:{$set:socketData.checklistContents}
                      }
                    }
                  }
                }
              }
            })
    
            this.setState({
              taskList: newTaskList
            })

        } else if(socketData.socketType === "taskMemberAdd"){
          let newTaskList = update(this.state.taskList,{
            [socketData.taskListIndex]:{
              tasks:{
                [socketData.taskIndex]:{
                  memberList:{
                    $push:[socketData]
                  }
                }
              }
            }
          })
          this.setState({
              taskList:newTaskList
            })
        } else if(socketData.socketType === "taskMemberDelete"){
    
          let newTaskList = update(this.state.taskList,{
            [socketData.taskListIndex]:{
              tasks:{
                [socketData.taskIndex]:{
                  memberList:{
                    $splice:[[socketData.memberIndex,1]]
                  }
                }
              }
            }
          })
          this.setState({
              taskList:newTaskList
            })
        } else if(socketData.socketType === "taskContentsUpdate"){
          let newTaskList = update(this.state.taskList, {
            [socketData.taskListIndex]: {
              tasks: {
                [socketData.taskIndex]: {
                  taskContents: {$set: socketData.taskContents},
                }
              }
            }
          })
          this.setState({
            taskList: newTaskList
          })
        } else if(socketData.socketType === "taskPointChange"){
          let newTaskList = update(this.state.taskList, {
            [socketData.taskListIndex]: {
              tasks: {
                [socketData.taskIndex]: {
                  taskPoint: {$set: socketData.taskPoint},
                }
              }
            }
          })
          this.setState({
            taskList: newTaskList
          })
        } else if(socketData.socketType === "commentLikeUpdate"){

            let newTaskList = update(this.state.taskList, {
              [socketData.taskListIndex]: {
                tasks: {
                  [socketData.taskIndex]: {
                    commentList: {
                      [socketData.commentIndex]: {
                        commentLike: {$set: socketData.commentLike}
                      },
                    },
                  },
                },
              },
            });
            this.setState({
              taskList: newTaskList,
            });
        } else if(socketData.historyType === "taskContentsUpdate"){
            let newHistoryData = {
              logContents:socketData.senderName+" 님이"+socketData.actionName+" 으로 업무이름을 수정하셨습니다.",
              logDate:socketData.historyDate,
              projectNo:socketData.projectNo
            }
  
            this.setState({
              history : update(this.state.history,{
                $push:[newHistoryData]
              })
            })
        } else if(socketData.historyType === "taskListInsert"){
          let newHistoryData = {
            logContents:socketData.senderName+" 님이"+socketData.actionName+" 업무리스트를 추가하였습니다.",
            logDate:socketData.historyDate,
            projectNo:socketData.projectNo
          }
  
          this.setState({
            history : update(this.state.history,{
              $push:[newHistoryData]
            })
          })
        } else if(socketData.historyType === "taskListDelete"){
          let newHistoryData = {
            logContents:socketData.senderName+" 님이"+socketData.actionName+" 업무리스트를 삭제하였습니다.",
            logDate:socketData.historyDate,
            projectNo:socketData.projectNo
          }
  
          this.setState({
            history : update(this.state.history,{
              $push:[newHistoryData]
            })
          })
        } else if(socketData.historyType === "taskDateUpdate"){
          let newHistoryData = {
            logContents:socketData.senderName+" 님이"+socketData.actionName+" 업무의 마감일을 수정하였습니다.",
            logDate:socketData.historyDate,
            projectNo:socketData.projectNo
          }
  
          this.setState({
            history : update(this.state.history,{
              $push:[newHistoryData]
            })
          })
        } else if(socketData.historyType === "taskMemberJoin"){
          let newHistoryData = {
            logContents:socketData.senderName+" 님이"+socketData.actionName+" 업무에 멤버를 추가하였습니다.",
            logDate:socketData.historyDate,
            projectNo:socketData.projectNo
          }
  
          this.setState({
            history : update(this.state.history,{
              $push:[newHistoryData]
            })
          })
        } else if(socketData.historyType === "checklistInsert"){
          let newHistoryData = {
            logContents:socketData.senderName+" 님이"+socketData.actionName+" 업무에 체크리스트를 추가하였습니다.",
            logDate:socketData.historyDate,
            projectNo:socketData.projectNo
          }
  
          this.setState({
            history : update(this.state.history,{
              $push:[newHistoryData]
            })
          })
        } else if(socketData.historyType === "checklistStateUpdate"){
          let newHistoryData = {
            logContents:socketData.senderName+" 님이"+socketData.actionName+" 업무의 체크리스트 상태를 수정하였습니다.",
            logDate:socketData.historyDate,
            projectNo:socketData.projectNo
          }
  
          this.setState({
            history : update(this.state.history,{
              $push:[newHistoryData]
            })
          })
        } else if(socketData.historyType === "taskDragNdrop"){
          let newHistoryData = {
            logContents:socketData.senderName+" 님이"+socketData.actionName+" 업무의 위치를 변경하였습니다.",
            logDate:socketData.historyDate,
            projectNo:socketData.projectNo
          }
  
          this.setState({
            history : update(this.state.history,{
              $push:[newHistoryData]
            })
          })
        } else if(socketData.historyType === "taskListDragNdrop"){
          let newHistoryData = {
            logContents:socketData.senderName+" 님이"+socketData.actionName+" 업무리스트의 위치를 변경하였습니다.",
            logDate:socketData.historyDate,
            projectNo:socketData.projectNo
          }
  
          this.setState({
            history : update(this.state.history,{
              $push:[newHistoryData]
            })
          })
        } else if(socketData.historyType === "taskStateUpdate"){
          let newHistoryData = {
            logContents:socketData.senderName+" 님이"+socketData.actionName+" 업무 상태를 변경하였습니다.",
            logDate:socketData.historyDate,
            projectNo:socketData.projectNo
          }
  
          this.setState({
            history : update(this.state.history,{
              $push:[newHistoryData]
            })
          })
        } else if(socketData.historyType === "taskInsert"){
          let newHistoryData = {
            logContents:socketData.senderName+" 님이"+socketData.actionName+" 업무를 추가하였습니다.",
            logDate:socketData.historyDate,
            projectNo:socketData.projectNo
          }
  
          this.setState({
            history : update(this.state.history,{
              $push:[newHistoryData]
            })
          })
        } else if(socketData.historyType === "taskDelete"){
          let newHistoryData = {
            logContents:socketData.senderName+" 님이"+socketData.actionName+" 업무를 삭제하였습니다.",
            logDate:socketData.historyDate,
            projectNo:socketData.projectNo
          }
  
          this.setState({
            history : update(this.state.history,{
              $push:[newHistoryData]
            })
          })
        } 
      }else{
        return
      }
      return;
    }
    
  }
  render() {
    return (
      <>
        <SockJsClient
          url={`${API_URL}/socket`}
          topics={[`/topic/all/${sessionStorage.getItem("authUserNo")}`, `/topic/history/all/${sessionStorage.getItem("authUserNo")}`]}
          onMessage={this.receiveKanban.bind(this)}
          ref={(client) => {
            this.clientRef = client
          }}
        />
        {/* taskSetting 띄우는 route */}
        <Switch>
          <Route
            path="/nest/dashboard/:projectNo/kanbanboard/task/:taskNo/"
            exact
            render={(match) => (
              <>
                <Setting
                  {...match}
                  authUserRole={this.state.authUserRole}
                  modalState={this.state.modalState}
                  tagModal={this.state.tagModal} // 태그 모달 띄우는 상태변수
                  taskMemberState={this.state.taskMemberState}
                  projectNo={this.props.match.params.projectNo}
                  task={this.state.taskList}
                  taskTagNo={this.state.taskTagNo} //업무 태그 번호만 모아둔 상태배열
                  taskCallbacks={{
                    checklistStateUpdate: this.callbackCheckListStateUpdate.bind(this), // checklist state 업데이트
                    checklistContentsUpdate: this.callbackCheckListContentsUpdate.bind(this), // checklist contents 업데이트
                    addCheckList: this.callbackAddCheckList.bind(this), //업무에 checklist 추가하기
                    deleteCheckList: this.callbackDeleteCheckList.bind(this), //업무에 checklist 삭제하기
                    updateTag: this.callbackUpdateTag.bind(this), //업무 태그 수정하기
                    deletetag: this.callbackDeleteTag.bind(this), //업무에 tag 삭제하기
                    addtag: this.callbackAddTag.bind(this), // 업무에 tag 추가하기,
                    deleteAlltag: this.callbackDeleteAllTag.bind(this), // 모든 업무에서 해당 tag삭제하기
                    updateTaskTag: this.onSetStateTaskTagNo.bind(this),
                    updateTaskDate: this.callbackTaskDateUpdate.bind(this), // 업무 날짜 수정
                    modalStateUpdate: this.modalStateUpdate.bind(this),
                    tagModalStateUpdate: this.tagModalStateUpdate.bind(this), //태그 모달 상태 업데이트
                    taskMemberState: this.taskMemberState.bind(this),
                    addDeleteMember: this.addDeleteMember.bind(this), // 업무에 멤버 추가 & 삭제
                    updateTaskPoint: this.callbackUpdateTaskPoint.bind(this), // 업무 포인트 업뎃
                    updateTaskContents: this.callbackUpdateTaskContents.bind(this), //업무 내용 수정
                    updateTaskLabel: this.callbackUpdateTaskLabel.bind(this), // 업무 라벨 수정
                  }}
                />
              </>
            )}
          />
          <Route
            path="/nest/dashboard/:projectNo/kanbanboard/task/:taskNo/comment"
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
                  tagModalStateUpdate: this.tagModalStateUpdate.bind(this), //태그 모달 상태 업데이트
                }}
              />)}
          />

          <Route
            path="/nest/dashboard/:projectNo/kanbanboard/task/:taskNo/file"
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
                  tagModalStateUpdate: this.tagModalStateUpdate.bind(this), //태그 모달 상태 업데이트
                }}
              />
            )}
          />
        </Switch>
        <div className="kanban">
        {/* 네비게이션바 */}
        <div className="navibar">
          <Navigator callbackChangeBackground = {this.props.callbackChangeBackground}/>
        </div>
        {/*상단바*/}
        <TopBar 
          history={this.state.history}
          projectNo={this.props.match.params.projectNo}
          activePath={this.props.location.pathname}
          projectTitle={this.state.projectTitle}
          callbackPorjectSetting = {{
            onProjectSetting : this.onProjectSetting.bind(this) // 프로젝트 세팅 열기
          }}
            />
        <div id="projectSetArea" style={{ display: this.state.setOn ? 'none'  :'block'}}>
            <ProjectSetting
              modalState={this.state.modalState}
              users={this.state.users}
              project={this.state.project}
              userProject={this.state.userProject}
              loading={this.state.loading}
              callbackProjectSetting={{
                close: this.callbackCloseProjectSetting.bind(this),
                addDeleteMember: this.callbackAddDeleteMember.bind(this),
                deleteMember: this.callbackDeleteMember.bind(this),
                changeState: this.callbackChangeState.bind(this),
                changeTitle: this.callbackProjectTitleChange.bind(this),
                changeDesc: this.callbackProjectDescChange.bind(this),
                inviteMember: this.callbackInviteMember.bind(this),
                changeRole: this.callbackRoleChange.bind(this),
                modalStateUpdate: this.modalStateUpdate.bind(this),
                updateProjectDate: this.callbackProjectDateUpdate.bind(this), // 업무 날짜 수정
                projectDelete: this.callbackProjectDelete.bind(this),
                projectNotTransferDelete: this.callbackProjectNotTransferDelete.bind(this),
                projectForeverDelete: this.callbackProjectForeverDelete.bind(this)
              }} />
          </div>
          <ScrollContainer
            className="scroll-container"
            hideScrollbars={false}
            ignoreElements=".input-group, .taskPanel, .addTaskListBtn, .taskListInsertForm, .completeArea, .task, .project-setting-dialog"
          >
            <div className="container-fluid kanbanMain">
              <div className="row content ">


                {/* 메인 영역 */}
                <div className="mainArea">
                  {/*칸반보드*/}
                  <DragDropContext
                    onDragEnd={this.onDragEnd}
                  // onDragStart={this.onDragStart}
                  >
                    {this.state.taskList && this.state.taskList &&
                      <KanbanBoard
                        setOn={this.state.setOn}
                        authUserRole={this.state.authUserRole}
                        taskList={this.state.taskList}
                        projectNo={this.props.match.params.projectNo}
                        taskCallbacks={{
                          add: this.callbackAddTask.bind(this), // task 추가
                          delete: this.callbackDeleteTask.bind(this), // task 삭제
                          copy: this.callbackCopyTask.bind(this), // task 복사
                          doneTask: this.callbackDoneTask.bind(this), // task 완료 체크
                          addList: this.callbackAddTaskList.bind(this), // taskList 추가
                          deleteList: this.callbackDeleteTaskList.bind(this), // taskList 삭제
                          checklistStateUpdate: this.callbackCheckListStateUpdate.bind(this), // checklist check 업데이트
                          modalStateFalse: this.modalStateFalse.bind(this),
                          editTaskListName: this.editTaskListName.bind(this) // taskList이름 변경 
                        }}
                      />
                    }
                  </DragDropContext>
                </div>
              </div>
            </div>
          </ScrollContainer>
        </div>
      </>
    );
  }

  componentDidMount() {
    ApiService.fetchKanbanMain(this.props.match.params.projectNo, sessionStorage.getItem("authUserNo")).then(
      (response) => {
        this.setState({
          taskList: response.data.data.allTaskList,
          authUserRole: response.data.data.authUserRole,
          projectTitle: response.data.data.projectTitle
        });
      }
    );
    ApiService.fetchDashboard()
      .then(response => {
        this.setState({
          projects: response.data.data.allProject
        })
      });
    ApiService.fetchUser()
      .then(response => {
        this.setState({
          users: response.data.data.allUser
        })
      });

    ApiService.fetchHistory(this.props.match.params.projectNo)
      .then(response =>
        this.setState({
          history: response.data.data
        })
      )

    ApiService.fetchProjectMember(this.props.match.params.projectNo)
      .then(response =>
        this.setState({
          projectMembers: response.data.data
        })
      )

    ApiService.fetchTasksCount(this.props.match.params.projectNo)
      .then(response =>
        this.setState({
          taskCount: response.data.data.taskCount,
          completedTask: response.data.data.completedTask
        })
      )
  }
}

export default KanbanMain;
