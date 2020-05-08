
import React from "react";
import ReactDOM from "react-dom";
import Dashboard from "./dashboard/Dashboard";

import KanbanMain from "./kanban/KanbanMain";
import Login from "./login/Login"

import * as serviceWorker from "./serviceWorker";
import "./index.css";
import App from './App';

const img = 'images/ko.jpg';
const bg = {
            backgroundImage: `url(${img})`
          };

ReactDOM.render(
  
  <React.StrictMode>
    <div className="mainIndex" style={bg}>
    </div>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.unregister();
