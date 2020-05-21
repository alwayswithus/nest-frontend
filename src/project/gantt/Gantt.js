import React, { Component } from "react";
import Navigator from "../../navigator/Navigator";
import TopBar from "../topBar/TopBar";

import TimeLine from "react-gantt-timeline";
import "./gantt.scss";

class Gantt extends Component {
    constructor(props) {
        super(props);

        let data = [
            {
                id: 1,
                no: 1,
                start: "2020-05-08",
                end: "2020-06-09",
                name: "업무 1"
            },
            {
                id: 2,
                no: 2,
                start: "2020-05-07",
                end: "2020-05-09",
                name: "업무 2",
                color: "#2020ff"
            },
            {
                id: 3,
                no: 3,
                start: "2020-05-07",
                end: "2020-05-17",
                name: "업무 이름",
                color: "red"
            }


        ];

        this.state = { 
            data: data, 
            links: [] 
        };
        
    }
    genID() {
        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        return (
            S4() +
            S4() +
            "-" +
            S4() +
            "-4" +
            S4().substr(0, 3) +
            "-" +
            S4() +
            "-" +
            S4() +
            S4() +
            S4()
        ).toLowerCase();
    }
    createLink(start, end) {
        return {
            id: this.genID(),
            start: start.task.id,
            startPosition: start.position,
            end: end.task.id,
            endPosition: end.position
        };
    }
    onUpdateTask = (item, props) => {
        item.start = props.start;
        item.end = props.end;
        this.setState({ data: [...this.state.data] });
        console.log(item.start+", "+item.end);
        //console.log(item);
    };
    onCreateLink = item => {
        let newLink = this.createLink(item.start, item.end);
        this.setState({ links: [...this.state.links, newLink] });
    };

    onClickTask = (props) => {
        console.log("클릭됨");
        console.log(props);
    }

    onClickProject = (props) =>{
        console.log(props);
    }

    render() {
        return (


            <div className="container-fluid kanbanMain">
                <div className="row content ">
                    {/* 네비게이션바 */}
                    <div className="navibar">
                        <Navigator />
                    </div>
                    {/*상단바*/}
                    <TopBar />
                    {/* 메인 영역 */}
                    <div className="mainArea">
                        {/*간트차트*/}
                        <div className="app-container">
                            {/* DayWidth<input type="range" min="30" max="500" value={this.state.daysWidth} onChange={this.handleDayWidth} step="1"/>
                                Item Height<input type="range" min="30" max="500" value={this.state.itemheight} onChange={this.handleItemHeight} step="1"/> */}
                            <div className="time-line-container">
                                <TimeLine
                                    data={this.state.data}
                                    links={this.state.links}
                                    onUpdateTask={this.onUpdateTask}
                                    onCreateLink={this.onCreateLink}
                                    onSelectItem={this.onClickTask}
                                    nonEditableName={true}
                                    mode={"month"}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Gantt;
