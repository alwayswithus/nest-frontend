import React ,{useState} from "react";
import { Route } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import KanbanMain from "./project/kanban/KanbanMain";

import Login from "./user/login/Login";
import SignUp from "./user/signup/SignUp";
import PwFind from "./user/pwfind/PwFind";
import SendMail from "./user/sendmail/sendmail";
import Errors from "./errors/Errors";

import SignUpEmail from "./user/signup/SignUpEmail";

import Gantt from "./project/gantt/Gantt";
import File from "./project/file/File";

import Dashboard from "./dashboard/Dashboard";
import Profile from "./profile/Profile";
import Notification from "./notification/Notification";
import ProfileSetting from "./profile/ProfileSetting";
import ProjectSetting from "./dashboard/projectsetting/ProjectSetting";

import Calendar from "./calendar/Calendar";

import "./App.scss";

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
    
     {/* 오류 페이지 */}
      <Route path="/nest/errors" exact component={Errors}/>

     {/*메인 */}
    <Route  path="/nest" exact component={Login} />

    {/*회원 */}
    <Route path="/nest/signup" exact component={SignUp} />
    <Route path="/nest/pwfind" exact component={PwFind} />
    <Route path="/nest/sendmail" component={SendMail} />
    <Route path="/nest/sendmail/:signup" component={SendMail} />
    <Route path="/nest/signup/emailConfirm/:keys" component={SignUpEmail} />

      <div className="App" style={{ backgroundImage: `url(${url})` }}>

        {/* 프로필설정 */}
        <Route 
          path="/nest/profile" 
          exact 
          render={(match) => 
            <Profile {...match} callbackChangeBackground={{change: callbackChangeBackground}}/> 
          }
        />
        <Route 
          path="/nest/profileset"
          exact 
          render={(match) => 
            <ProfileSetting {...match} callbackChangeBackground={{change: callbackChangeBackground}}/> 
          }
        />

        {/* 알림설정 */}
        <Route path="/nest/notification"
          exact 
          render={(match) => 
            <Notification {...match} callbackChangeBackground={{change: callbackChangeBackground}}/> 
          }
        />

        {/*칸반보드 */}
        <Route 
          path="/nest/dashboard/:projectNo/kanbanboard"
          render={(match) => 
            <KanbanMain {...match} callbackChangeBackground={{change: callbackChangeBackground}}/> 
          }
        />

        {/* 대시보드 */}
        <Route path="/nest/dashboard"
          exact 
          render={(match) => 
            <Dashboard {...match} callbackChangeBackground={{change: callbackChangeBackground}}/> 
          }
        />
        
        {/* 간트차트 */}
        <Route 
          path="/nest/dashboard/:projectNo/timeline"
          render={(match) => 
            <Gantt {...match} callbackChangeBackground={{change: callbackChangeBackground}}/> 
          }
        />

        {/* 파일 */}
        <Route 
          path="/nest/dashboard/:projectNo/file" 
          exact 
          render={(match) => 
            <File {...match} callbackChangeBackground={{change: callbackChangeBackground}}/> 
          }
        />

        {/* 프로젝트 세팅
        <Route path="/nest/projectset" exact component={ProjectSetting} /> */}

        {/* 캘린더 */}
        <Route 
          path="/nest/calendar" 
          exact 
          render={(match) => 
            <Calendar {...match} callbackChangeBackground={{change: callbackChangeBackground}}/> 
          }
        />
      
      </div>
    </BrowserRouter>
  );
}

export default App;
