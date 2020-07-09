import React, { Component } from "react";
import TaskList from "./task/TaskList";
import ReactTooltip from "react-tooltip";
import { Droppable } from "react-beautiful-dnd";
import update from "react-addons-update";
import "./KanbanBoard.scss";

const API_URL = "http://localhost:8080/nest";
const API_HEADERS = {
  "Content-Type": "application/json",
};
class KanbanBoard extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      // taskListInsertState: false,
      taskListName: "",
      searchKeyword: "",
      tagSearchTaskList: {},
      allTaskList: this.props.taskList,
      selectPicker: "task",
    };
  }

  //리스트 추가 버튼 UI변경
  taskListStateBtn() {
    this.props.taskCallbacks.taskListStateBtn(this.props.taskListInsertState)
    this.setState({
      taskListName: "",
    });
  }

  // 리스트 추가(Enter)
  addTaskListEnter(event) {
    if (event.key === "Enter") {
      this.addTaskList();
    }
  }

  // 리스트 추가
  addTaskList() {
    if(this.state.taskListName.replace(/\s| /gi, "").length !== 0){
      this.props.taskCallbacks.addList(
        this.state.taskListName.replace(/ /gi, ''),
        this.props.projectNo
        );
        this.setState({
          taskListName: "",
        });
        this.taskListStateBtn();
      }
  }

  // 리스트명 입력 이벤트
  onTextAreaChanged(event) {
    this.setState({
      taskListName: event.target.value.substr(0, 11),
    });
  }

  // 리스트 추가 취소 버튼
  noneTaskListAddBtn() {
    this.setState({
      taskListInsertState: false,
    });
  }

  // 업무 검색
  searchKeyword(event) {
    if (event.target.value !== "") { //안비어있으면 

            if(this.state.selectPicker === "tag"){
              this.setState({
                searchKeyword: event.target.value,
              });
              
              const tagSearch = {
                projectNo: this.props.projectNo,
                keyword: event.target.value,
              };
              
              fetch(`${API_URL}/api/kanbanMain/searchTag`, {
                method: "post",
                headers: API_HEADERS,
                body: JSON.stringify(tagSearch),
              })
              .then((response) => response.json())
              .then((json) => {
                let tagTaskNo = [];
                tagTaskNo = json.data.map((task) => task.task_no + "");
                
                const newTaskList = this.props.taskList;
                let copy = newTaskList.slice(0, newTaskList.length);
                copy &&
                copy.map(
                  (tasks, index) =>
                  (copy[index] = update(copy[index], {
                    tasks: {
                      $set: [],
                    },
                  }))
                  );
               

                let tagTask = [];
                newTaskList &&
                  newTaskList.map(
                    (taskList) =>
                      (tagTask = tagTask.concat(
                        taskList.tasks.map((task) =>
                          tagTaskNo.indexOf(task.taskNo) !== -1 ? task : null
                        )
                      ))
                  );

                
                newTaskList.map((tasklist, index) => {
                  tagTask.splice(0, tasklist.tasks.length).map((task) =>
                  task !== null
                      ?
                      copy[index] = update(copy[index], {
                          tasks: {
                            $push: [task],
                          },
                        })
                      : null
                  );
                });

                this.setState({
                  allTaskList: copy,
                });
              });
          }else{
            this.setState({
              searchKeyword: event.target.value,
            });
          }

    } else { // 비어있으면
      this.setState({
        searchKeyword: event.target.value,
        allTaskList: this.props.taskList,
      });
    }
  }

  selectpicker(e) {
    this.setState({
      selectPicker: e.target.value,
      searchKeyword:""
    });
  }

//   onClickClose = () => {
//     this.setState({
//       taskListInsertState:false
//     })
// }

// // componentDidMount(){
// //    //비제어
// //    document.addEventListener("click", this.onClickClose, true)
// // }

  render() {
   
    return (
      <>
        <div className="kanbanBoard">
          <div className="kanbanBoardTopMenu">
          {/*업무 검색*/}
          <div
            style={{ display: "inline-flex" }}
            className="input-group"
          >
            <input
              type="text"
              className="form-control"
              id="searchBox"
              placeholder={this.state.selectPicker === "task" ? "업무 검색" : "태그 검색"}
              value={this.state.searchKeyword}
              onChange={this.searchKeyword.bind(this)}
            ></input>
            <select
              className="selectpicker"
              onChange={this.selectpicker.bind(this)}
            >
              <option className="option" value="task">
                업무
              </option>
              <option className="option" value="tag">
                태그
              </option>
            </select>
          </div>
          {/* TaskList 추가 */}
          <div className="taskListAdd">
              {this.props.taskListInsertState ? (
                <>
                  <div className="taskListInsertForm">
                    <div className="taskListInsertInput">
                    <div>
                      <input
                        type="text"
                        className="textArea"
                        onChange={this.onTextAreaChanged.bind(this)}
                        onKeyPress={this.addTaskListEnter.bind(this)}
                        value={this.state.taskListName}
                        autoFocus
                      ></input>
                    </div>
                    <div className="taskListInsertBtn">
                      &nbsp;
                      {this.state.taskListName.length===0 ?  <i
                        className="fas fa-check Icon"
                        style={{color:"#979797"}}
                      ></i>: <i
                      className="fas fa-check Icon"
                      onClick={this.addTaskList.bind(this)}
                    ></i>}
                     
                      <i class="fas fa-times Icon" onClick={this.taskListStateBtn.bind(this)}
                        data-tip="취소"></i>
                      <ReactTooltip />
                    </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {this.props.authUserRole === 1 ? (
                    <button
                      type="button"
                      className="btn btn-default addTaskListBtn"
                      onClick={this.taskListStateBtn.bind(this)}
                      
                    >
                      + 업무 목록 추가
                    </button>
                  ) : null}
                </>
              )}
            </div>
            </div>
          <div className="taskListArea">
            {/*task 리스트*/}

            <Droppable
              droppableId="all-columns"
              direction="horizontal"
              type="column"
            >
              {(provided,snapshot) => (
                <div
                  className="taskList"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  
                >
                  {this.state.selectPicker === "task"
                    ? this.props.taskList &&
                      this.props.taskList.map((taskList, index) => {
                        return (
                          <TaskList
                            showEditNameInput={this.props.showEditNameInput}
                            authUserRole={this.props.authUserRole}
                            searchKeyword={this.state.searchKeyword}
                            selectPicker={this.state.selectPicker}
                            key={taskList.taskListNo}
                            listNo={taskList.taskListNo}
                            taskList={taskList}
                            tasks={taskList.tasks}
                            index={index}
                            taskCallbacks={this.props.taskCallbacks}
                            projectNo={this.props.projectNo}
                          />
                        );
                      })
                    : this.state.searchKeyword === ""
                      ? this.props.taskList &&
                        this.props.taskList.map((taskList, index) => {
                          return (
                            <TaskList
                              showEditNameInput={this.props.showEditNameInput}
                              authUserRole={this.props.authUserRole}
                              searchKeyword={this.state.searchKeyword}
                              selectPicker={this.state.selectPicker}
                              key={taskList.taskListNo}
                              listNo={taskList.taskListNo}
                              taskList={taskList}
                              tasks={taskList.tasks}
                              index={index}
                              taskCallbacks={this.props.taskCallbacks}
                              projectNo={this.props.projectNo}
                            />
                          );
                        })
                      : this.state.allTaskList &&
                        this.state.allTaskList.map((taskList, index) => {
                          return (
                            <TaskList
                              showEditNameInput={this.props.showEditNameInput}
                              authUserRole={this.props.authUserRole}
                              searchKeyword={this.state.searchKeyword}
                              selectPicker={this.state.selectPicker}
                              key={taskList.taskListNo}
                              listNo={taskList.taskListNo}
                              taskList={taskList}
                              tasks={taskList.tasks}
                              index={index}
                              taskCallbacks={this.props.taskCallbacks}
                              projectNo={this.props.projectNo}
                            />
                          );
                      })}
                </div>
              )}
            </Droppable>
            
          </div>
          
        </div>
      </>
    );
  }
}

export default KanbanBoard;
