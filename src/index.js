import React from "react";
import ReactDOM from "react-dom";
import Dashboard from "./dashboard/Dashboard";
import KanbaMain from "./kanban/KanbaMain";
import * as serviceWorker from "./serviceWorker";
import "./index.css";
const img = 'images/ko.jpg';
const bg = {
            backgroundImage: `url(${img})`
          };

ReactDOM.render(
  
  <React.StrictMode>
    <div className="mainIndex" style={bg}>
    </div>
    <Dashboard />
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.unregister();
