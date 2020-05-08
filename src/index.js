
import React from "react";
import ReactDOM from "react-dom";
import Dashboard from "./dashboard/Dashboard";

import KanbanMain from "./kanban/KanbanMain";
import Login from "./login/Login"

import * as serviceWorker from "./serviceWorker";
import "./index.css";
import App from './App';
ReactDOM.render(
  <React.StrictMode>
    <div className="mainIndex">
    </div>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
serviceWorker.unregister();
