import React from "react";
import { Route } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import KanbanMain from "./project/kanban/KanbanMain";

import Login from "./user/login/Login";
import SignUp from "./user/signup/SignUp";
import PwFind from "./user/pwfind/PwFind";

import Gantt from "./project/gantt/Gantt";
import File from "./project/file/File";

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

        {/*칸반보드 */}
        <Route path="/nest/kanbanMain" component={KanbanMain} />

        {/* 대시보드 */}
        <Route path="/nest/dashboard" exact component={Dashboard} />

        {/* 간트차트 */}
        <Route path="/nest/gantt" exact component={Gantt} />

        {/* 파일 */}
        <Route path="/nest/file" exact component={File} />

        {/* 프로젝트 세팅*/}
        <Route path="/nest/projectset" exact component={ProjectSetting} />

        {/* 캘린더 */}
        <Route path="/nest/calendar" exact component={Calendar} />

      </BrowserRouter>
    </div>
  );
}

export default App;
