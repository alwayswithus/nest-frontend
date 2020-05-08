
import React from "react";
import ReactDOM from "react-dom";
import Dashboard from "./dashboard/Dashboard";
import KanbaMain from "./kanban/KanbaMain";
import Login from "./login/Login"
import * as serviceWorker from "./serviceWorker";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <div className="mainIndex">
    </div>
    <Login />
  </React.StrictMode>,
  document.getElementById("root")
);
serviceWorker.unregister();
