import React, { Component, Fragment } from "react";
import { Router, Route } from "react-router-dom";

import Home from './Home';
import File from './file/File';
import { BrowserRouter } from "react-router-dom";

import Comment from './comment/Comment';
import ProfileMain from './profile/ProfileMain';
import KanbanMain from "./kanban/KanbanMain";
import Login from "./login/Login";
import Dashboard from "./dashboard/Dashboard";
import Profile from './profile/Profile';


function App() {
  return (
    <div className="App">

      <BrowserRouter>

        {/*메인 */}
        <Route path="/" exact component={Login} />

        {/* 프로필설정 */}
        <Route path="/profile" exact component={Profile} />

        {/* 업무속성 */}
        <Route path="/home" exact component={Home} />
        <Route path="/comment" exact component={Comment} />
        <Route path="/file" exact component={File} />

        {/*칸반보드 */}
        <Route path="/kanbanMain" exact component={KanbanMain} />

        {/* 대시보드 */}
        <Route path="/dashboard" exact component={Dashboard} />


        <ProfileMain />
      </BrowserRouter>

    </div>
  );
}

export default App;
