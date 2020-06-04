import React from "react";
import Navigator from "../../navigator/Navigator";
import TopBar from "../topBar/TopBar";
import ApiService from "../../ApiService"
import TimeLine from "react-gantt-timeline";

import "./gantt.scss";

const API_URL = "http://localhost:8080/nest";
const API_HEADERS = {
  "Content-Type": "application/json",
};
// 간트차트 스타일 설정
const ganttStyleConfigs = {
    header: {
        top: {
            style: {
                backgroundColor : "#8798a8",
                fontSize: 12
            }
        },
        middle: {
            style: {
                backgroundColor : "#8da299",
                fontSize: 12,
                //color: "#6a7074"
            }
        },
        bottom: {
            style: {
                backgroundColor :"#a69889",
                fontSize: 9,
                //color: "orange"
            },
            selectedStyle: {
                fontWeight: "bold",
                color: "white"
            }
        }
    },
    taskList: {
        title: {
            label: "업무목록",
            style: {
                backgroundColor: "#8798a8"
            }
        },
        task: {
            style: {
                backgroundColor: "#e7e7e7",
                color: "#6a7074"
            }
        },
        verticalSeparator: {
            style: {
                backgroundColor: "#8798a8"
            }
            // ,
            // grip: {
            //     style: {
            //        // backgroundColor: "red"
            //     }
            // }
        }
    },
    dataViewPort: {
        rows: {
            style: {
                backgroundColor: "#e7e7e7",
                //borderBottom: "solid 0.5px silver"
            }
        },
        task: {
            showLabel: true,
            style: {
                borderRadius: 14,
                //boxShadow: "2px 2px 8px #888888"
            },
            selectedStyle:{
                position:  'absolute',
                borderRadius:4,
                color:  'white',
                textAlign:'center',
                //backgroundColor:'red',
                border:"solid 2px #ffffff",
            }
        },
        links: {color:"#e7e7e7",selectedColor:"#e7e7e7"}
    }
};

class Gantt extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            url: sessionStorage.getItem("authUserBg"),
            data: [],
            links: [], 
            selectedItem: null ,
            ganttStyleConfig: ganttStyleConfigs
        };
    }

    // CallBack Background Image Setting 
    callbackChangeBackground(url) {

        let authUser = {
            userNo: window.sessionStorage.getItem("authUserNo"),
            userBg: url
          }
      
          fetch(`${API_URL}/api/user/backgroundChange`, {
            method: 'post',
            headers: API_HEADERS,
            body: JSON.stringify(authUser)
          })
          
          sessionStorage.setItem("authUserBg", url)
          this.setState({
            url: url
          })
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
            endPosition: end.position,
        };
    }
    onCreateLink = (item) => {
        let newLink = this.createLink(item.start, item.end);
        this.setState({ links: [...this.state.links, newLink] });
    };

    onUpdateTask = (item, props) => {
        item.start = props.start;
        item.end = props.end;
        this.setState({ data: [...this.state.data] });
        console.log(item.start + ", " + item.end);
        //console.log(item);
    };

    onSelectItem = item => {
        console.log("클릭됨");
        console.log(item);
        this.setState({ selectedItem: item });
    };

    render() {
        return (
            <div className="Gantt" style={{ backgroundImage: `url(${this.state.url})` }}>
                {/* 네비게이션바 */}
                <Navigator callbackChangeBackground={{ change: this.callbackChangeBackground.bind(this) }} />
                {/*상단바*/}
                <TopBar projectNo={this.props.match.params.projectNo} activePath={this.props.location.pathname}/>
                <div className="container-fluid ganntMain">
                    <div className="row content">
                        {/* 메인 영역 */}
                        <div className="mainArea">
                            {/*간트차트*/}
                            <div className="app-container">
                                {/* DayWidth<input type="range" min="30" max="500" 
                                             value={this.state.daysWidth} 
                                             onChange={this.handleDayWidth} step="1"/>
                                    Item Height<input type="range" min="30" max="500" 
                                                 value={this.state.itemheight} 
                                                 onChange={this.handleItemHeight} step="1"/> */}
                                <div className="time-line-container">
                                    <TimeLine
                                        data={this.state.data}
                                        links={this.state.links}
                                        nonEditableName={true}
                                        onUpdateTask={this.onUpdateTask}
                                        onCreateLink={this.onCreateLink}
                                        onSelectItem={this.onSelectItem}
                                        selectedItem={this.state.selectedItem}
                                        config={this.state.ganttStyleConfig}
                                        mode={"month"}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        ApiService.fetchGantt(this.props.match.params.projectNo).then(
          (response) => {
            this.setState({
              data: response.data.data.allTasks
            });
            // console.log(response.data.data.allTasks);
          }
        );
    }
}

export default Gantt;
