import React from 'react';

import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button'
import SimpleNotice from '../notification/SimpleNotice';
import ApiService from "../ApiService";
import SockJsClient from "react-stomp";
import update from "react-addons-update";

const API_URL = "http://localhost:8080/nest";
const API_HEADERS = {
    'Content-Type': 'application/json'
}

class NavNotice extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            notices: [],                               // notice send Data
        }
    }
    receiveNotice(socketData) {
        
        // console.log(this.state.notices)
        // console.log(socketData.del);
        // console.log(socketData.target);
        if(socketData.del&&socketData.target==sessionStorage.getItem("authUserNo")){
            let index = -1;
            for(var a in this.state.notices){
                if(this.state.notices[a].noticeNo === socketData.del){
                    index = a;
                    console.log(a);
                }
            }
            if( index > -1){
                this.state.notices.splice(index, 1);
                this.setState({
                    notices: this.state.notices
                });
            }
            console.log(this.state.notices)
        }else if(socketData[0] && socketData[0].indexOf(parseInt(sessionStorage.getItem("authUserNo"))) !== -1){
            // const notice = socketData[1];

            // const arr = this.state.notices
            // arr.unshift(notice);
            // this.setState({
            //     notices : arr,
            // })
            ApiService.fetchNewNotice(sessionStorage.getItem("authUserNo")).then(
                (response) => {
                    this.setState({
                        notices: response.data.data.notice
                    });
                }
            );
        }
    }

    callbackMessageCheck(noticeNo){
        // console.log(noticeNo);

        const noticeIndex = this.state.notices.findIndex(
            (notice) => notice.noticeNo === noticeNo
          );

        let newNotices = this.state.notices

        newNotices = update(newNotices,{
            [noticeIndex]:{
                messageCheck:{
                    $set : 'Y'
                }
            }
        })
        this.setState({
            notices :newNotices
        })

        fetch(`${API_URL}/api/notification/update/${noticeNo}/${sessionStorage.getItem("authUserNo")}`, {
            method:'post',
            headers:API_HEADERS,
          })
    }

    render() {
        return (
            <div className="popover__wrapper">
                <div className="popover__arrow">
                </div>
                <SockJsClient
                    url={`${API_URL}/socket`}
                    topics={[`/topic/asnotice`]}
                    onMessage={this.receiveNotice.bind(this)}
                    ref={(client) => {
                        this.clientRef = client;
                    }}
                />
                <div className="popover__content">
                    <div className="notification-contents-list">
                        {
                            (this.state.notices.length > 0) ?
                                this.state.notices.map(notice =>
                                    <SimpleNotice notice={notice} callbackMessageCheck={{MessageCheck:this.callbackMessageCheck.bind(this)}} />
                                )
                                :
                                <div>
                                    <image/>
                                </div>
                        }
                        <div className="seeAll">
                        <Link to="/nest/notification" className="link">
                            <Button style={{ outline: "none", width: "100%", borderColor: "#27B6BA", backgroundColor: "#27B6BA", borderTopLeftRadius: "0px", borderTopRightRadius: "0px", borderBottomLeftRadius: "10px", borderBottomRightRadius: "10px" }}>
                                모두 보기
                        </Button>
                        </Link>
                    </div>
                    </div>
                    
                </div>
            </div>
        );
    }

    componentDidMount() {
        ApiService.fetchNewNotice(sessionStorage.getItem("authUserNo")).then(
          (response) => {
            this.setState({
                notices:response.data.data.notice
            });
          }
        );
      }

}
export default NavNotice