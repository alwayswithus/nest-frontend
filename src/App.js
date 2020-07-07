import React, { useState } from "react";
import { Route } from "react-router-dom";
import { BrowserRouter,Switch } from "react-router-dom";

import Main from "./Main";

import Login from "./user/login/Login";
import SignUp from "./user/signup/SignUp";
import PwFind from "./user/pwfind/PwFind";
import SendMail from "./user/sendmail/sendmail";
import Errors from "./errors/Errors";

import SignUpEmail from "./user/signup/SignUpEmail";
import SignUpDone from "./user/signup/SignUpDone";

import PwFindEmail from "./user/pwfind/pwFindEmail";
import PwFindDone from "./user/pwfind/pwFindDone";

import Gantt from "./project/gantt/Gantt";
import File from "./project/file/File";

import Dashboard from "./dashboard/Dashboard";
import Profile from "./profile/Profile";
import Notification from "./notification/Notification";
import ProfileSetting from "./profile/ProfileSetting";
// import ProjectSetting from "./dashboard/projectsetting/ProjectSetting";

import KanbanMain from "./project/kanban/KanbanMain";
import Calendar from "./calendar/Calendar";

import "./App.scss";
// import { Switch } from "@material-ui/core";

const API_URL = "http://localhost:8080/nest";
const API_HEADERS = {
  "Content-Type": "application/json",
};

function App() {

  const [url, setUrl] = useState(window.sessionStorage.getItem("authUserBg"));

  const callbackChangeBackground = (url) => {
    setUrl(url)

    let authUser = {
      userNo: window.sessionStorage.getItem("authUserNo"),
      userBg: url,
    };

    fetch(`${API_URL}/api/user/backgroundChange`, {
      method: "post",
      headers: API_HEADERS,
      body: JSON.stringify(authUser),
    });

    sessionStorage.setItem("authUserBg", url)

  }

  return (
    <BrowserRouter>
      <Switch>
      <div className="App" 
            style={{backgroundImage: `url(${url == 'null' ? "/nest/assets/images/nestBackground.png" : url})`,overflow: 'hidden',position: 'relative'}}>

        {/* 오류 페이지 */}
        <Route path="/nest/errors" exact component={Errors} />

        {/* 메인 */}
        <Route path="/" exact component={Main} />
        <Route path="/nest" exact component={Main} />

        {/* 로그인 */}
        <Route path="/nest/login" exact component={Login} />

        {/* 회원 */}
        <Route path="/nest/signup" exact component={SignUp} />
        <Route path="/nest/signupdone" exact component={SignUpDone} />

        <Route path="/nest/pwfind" exact component={PwFind} />
        <Route path="/nest/pwfinddone" exact component={PwFindDone} />

        <Route path="/nest/sendmail/:mode" component={SendMail} />
        <Route path="/nest/signup/emailConfirm/:keys" component={SignUpEmail} />
        <Route path="/nest/pwfind/emailConfirm/:keys" component={PwFindEmail} />
        {/* <Route path="/" component={NoMatchPage}/> */}
        {/* 프로필설정 */}
        <Route
          path="/nest/profile"
          exact
          render={(match) =>
            <Profile {...match} callbackChangeBackground={{ change: callbackChangeBackground }} />
          }
        />
        <Route
          path="/nest/profileset"
          exact
          render={(match) =>
            <ProfileSetting {...match} callbackChangeBackground={{ change: callbackChangeBackground }} />
          }
        />

        {/* 알림설정 */}
        <Route path="/nest/notification"
          exact
          render={(match) =>
            <Notification {...match} callbackChangeBackground={{ change: callbackChangeBackground }} />
          }
        />

        {/*칸반보드 */}
        <Route
          path="/nest/dashboard/:projectNo/kanbanboard"
          render={(match) =>
            <KanbanMain {...match} callbackChangeBackground={{ change: callbackChangeBackground }} />
          }
        />

        {/* 대시보드 */}
        <Route path="/nest/dashboard"
          exact
          render={(match) =>
            <Dashboard {...match} callbackChangeBackground={{ change: callbackChangeBackground }} />
          }
        />

        {/* 간트차트 */}
        <Route
          path="/nest/dashboard/:projectNo/timeline"
          render={(match) =>
            <Gantt {...match} callbackChangeBackground={{ change: callbackChangeBackground }} />
          }
        />

        {/* 파일 */}
        <Route
          path="/nest/dashboard/:projectNo/file"
          exact
          render={(match) =>
            <File {...match} callbackChangeBackground={{ change: callbackChangeBackground }} />
          }
        />

        {/* 캘린더 */}
        <Route
          path="/nest/calendar"
          render={(match) =>
            <Calendar {...match} callbackChangeBackground={{ change: callbackChangeBackground }} />
          }
        />

      </div>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
