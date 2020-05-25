import React from "react";
import { Route } from "react-router-dom";

import Setting from "./project/kanban/tasksetting/setting/Setting";
import File from "./project/kanban/tasksetting/file/File";
import { BrowserRouter } from "react-router-dom";

import Comment from "./project/kanban/tasksetting/comment/Comment";
import KanbanMain from "./project/kanban/KanbanMain";

import Login from "./user/login/Login";
import SignUp from "./user/signup/SignUp";
import PwFind from "./user/pwfind/PwFind";

import Gantt from "./project/gantt/Gantt";

import Dashboard from "./dashboard/Dashboard";
import Profile from "./profile/Profile";
import Notification from "./notification/Notification";
import ProfileSetting from "./profile/ProfileSetting";
import ProjectSetting from "./dashboard/projectsetting/ProjectSetting";

import Calendar from "./calendar/Calendar";

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        {/*메인 */}
        <Route  path="/nest" exact component={Login} />

        {/*회원 */}
        <Route path="/nest/signup" exact component={SignUp} />
        <Route path="/nest/pwfind" exact component={PwFind} />

        {/* 프로필설정 */}
        <Route path="/nest/profile" exact component={Profile} />
        <Route path="/nest/profileset" exact component={ProfileSetting} />

        {/* 알림설정 */}
        <Route path="/nest/notification" exact component={Notification} />

        {/* 업무속성 */}
        <Route path="#" exact component={Setting} />
        <Route path="#" exact component={Comment} />
        <Route path="#" exact component={File} />

        {/*칸반보드 */}
        <Route path="/nest/kanbanMain" exact component={KanbanMain} />

        {/* 대시보드 */}
        <Route path="/nest/dashboard" exact component={Dashboard} />

        {/* 간트차트 */}
        <Route path="/nest/gantt" exact component={Gantt} />

        {/* 프로젝트 세팅*/}
        <Route path="/nest/projectset" exact component={ProjectSetting} />

        {/* 캘린더 */}
        <Route path="/nest/calendar" exact component={Calendar} />

      </BrowserRouter>
    </div>
  );
}

export default App;
