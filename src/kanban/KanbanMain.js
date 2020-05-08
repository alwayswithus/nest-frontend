import React, { Component } from "react";
import KanbanBoard from "./KanbanBoard";
import Navigator from "../dashboard/navigator/Navigator";
import TopBar from "./TopBar";
import data from "./data.json";

class KanbanMain extends Component {
  render() {
    return (
      <div className="App">
        <div className="container-fluid">
          <div className="row content">
            {/* 네비게이션바 */}
            <div className="navibar">
              <Navigator />
            </div>
            {/*상단바*/}
            <TopBar />
            {/* 메인 영역 */}
            <div className="mainArea">
              {/*칸반보드*/}
              <KanbanBoard tasks={data} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default KanbanMain;
