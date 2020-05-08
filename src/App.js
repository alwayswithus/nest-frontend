import React, { Component, Fragment } from "react";
import { Router, Route } from "react-router-dom";

import Setting from './tasksetting/Setting';
import File from './file/File';
import { BrowserRouter } from "react-router-dom";

import Comment from './comment/Comment';
import KanbanMain from "./kanban/KanbanMain";
import Login from "./login/Login";
import SignUp from "./signup/SignUp";
import PwFind from "./pwfind/PwFind";
import Dashboard from "./dashboard/Dashboard";
import Profile from './profile/Profile';
import Notification from './notification/Notification';


function App() {
  return (
    <div className="App">

      <BrowserRouter>

        {/*메인 */}
        <Route path="/" exact component={Login} />

        {/*회원 */}
        <Route path="/signup" exact component={SignUp} />
        <Route path="/pwfind" exact component={PwFind} />


        {/* 프로필설정 */}
        <Route path="/profile" exact component={Profile} />

    {/* 알림설정 */}
        <Route path="/notification" exact component={Notification} />

        {/* 업무속성 */}
        <Route path="/home" exact component={Setting} />
        <Route path="/comment" exact component={Comment} />
        <Route path="/file" exact component={File} />

        {/*칸반보드 */}
        <Route path="/kanbanMain" exact component={KanbanMain} />

        {/* 대시보드 */}
        <Route path="/dashboard" exact component={Dashboard} />

      </BrowserRouter>

    </div>
  );
}

export default App;
