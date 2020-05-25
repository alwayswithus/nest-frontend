import React, { Component } from "react";
import TodoList from "./TodoList";
import TagList from "./TagList";
import Date from "./Date";
import Setting from "../tasksetting/setting/Setting";
import File from "../tasksetting/file/File";
import Comment from "../tasksetting/comment/Comment";
import TaskInnerContents from "./TaskInnerContents";
import "./Task.scss";
import { Draggable } from "react-beautiful-dnd";

class Task extends Component {
  constructor() {
    super(...arguments);

    this.state = {
      path: "",
      closeValue: false,
      showComplete: false,
      closeTag: false,
    };
  }
  // 클릭 모달 막기
  noneClick() {
    window.jQuery(document.body).removeClass("modal-open");
    window.jQuery(".modal-backdrop").remove();
  }

  // task 완료 체크 박스
  doneTask() {
    this.props.taskCallbacks.doneTask(
      this.props.taskListId,
      this.props.task.no,
      this.props.task.checked
    );
    this.noneClick();
  }

  //모달 클릭 후 path 초기화.
  onModalOpen() {
    this.setState({
      path: "",
    });
  }

  onCallbackSetting(path) {
    this.setState({
      path: path,
    });
  }

  //tag modal close
  onClickModal() {
    this.setState({
      closeValue: !this.state.closeValue,
    });
  }

  // 완료된 Task List 목록 상태
  showCompleteTaskList() {
    this.setState({
      showComplete: !this.state.showComplete,
    });
    this.noneClick();
  }

  //새태그 만들기에서 뒤로가기 눌렀을 때
  onClicknewTagModal() {
    this.setState({
      closeTag: !this.state.closeTag,
    });
    this.onClickModal();
  }
  render() {
    const taskItem = this.props.task;
    return (
      <>
        <Draggable
          draggableId={taskItem.no}
          index={this.props.index}
          isDragDisabled={this.props.complete}
        >
          {(provided, snapshot) => (
            <div
              className={taskItem.checked ? "task completeTask" : " task"}
              data-toggle="modal"
              data-target={`#kanban-setting-${taskItem.no}`}
              onClick={this.onModalOpen.bind(this)}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
            >
              <TaskInnerContents
                key={taskItem.no}
                index={this.props.index}
                task={taskItem}
                taskListId={this.props.taskListId}
                taskCallbacks={this.props.taskCallbacks}
              />
            </div>
          )}
        </Draggable>

        {/* Project Setting Modal */}
        <div className="project-setting-dialog">
          <div
            className="modal fade come-from-modal right"
            id={`kanban-setting-${taskItem.no}`}
            tabIndex="-1"
            role="dialog"
            aria-labelledby="myModalLabel"
          >
            <div
              className="modal-dialog"
              role="document"
              style={{ width: "670px" }}
            >
              <div className="modal-content">
                {/* modal 띄우기. */}
                <div className="modal-body">
                  {this.state.path == "http://localhost:3000/nest/setting" ? (
                    <Setting
                      path={this.state.path}
                      closeValue={this.state.closeValue}
                      closeTag={this.state.closeTag}
                      onClickModal={this.onClickModal.bind(this)}
                      onClicknewTagModal={this.onClicknewTagModal.bind(this)}
                      taskCallbacks={this.props.taskCallbacks}
                      onCallbackSetting={this.onCallbackSetting.bind(this)}
                      task={taskItem}
                      key={taskItem.no}
                      taskListNo={this.props.taskListId}
                    />
                  ) : (
                    <>
                      {this.state.path ==
                      "http://localhost:3000/nest/comment" ? (
                        <Comment
                          path={this.state.path}
                          onCallbackSetting={this.onCallbackSetting.bind(this)}
                          task={taskItem}
                          taskListNo={this.props.taskListId}
                          taskCallbacks={this.props.taskCallbacks}
                          key={taskItem.no}
                        />
                      ) : (
                        <>
                          {this.state.path ==
                          "http://localhost:3000/nest/file" ? (
                            <File
                              path={this.state.path}
                              onCallbackSetting={this.onCallbackSetting.bind(
                                this
                              )}
                              task={taskItem}
                              key={taskItem.no}
                            />
                          ) : (
                            <Setting
                              taskCallbacks={this.props.taskCallbacks}
                              closeValue={this.state.closeValue}
                              closeTag={this.state.closeTag}
                              onClickModal={this.onClickModal.bind(this)}
                              onClicknewTagModal={this.onClicknewTagModal.bind(
                                this
                              )}
                              onCallbackSetting={this.onCallbackSetting.bind(
                                this
                              )}
                              task={taskItem}
                              key={taskItem.no}
                              taskListNo={this.props.taskListId}
                            />
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-default"
                    data-dismiss="modal"
                    onClick={() =>
                      this.setState({
                        closeValue: false,
                        closeTag: false,
                      })
                    }
                  >
                    Close
                  </button>
                  <button type="button" className="btn btn-primary">
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Task;
