import React from 'react';

import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button'
import SimpleNotice from '../notification/SimpleNotice';
import ApiService from "../ApiService";

class NavNotice extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            notices: [],                               // notice send Data
        }
    }

    render() {
        return (
            <div className="popover__wrapper">
                <div className="popover__arrow">
                </div>
                <div className="popover__content">
                    <div className="notification-contents-list">
                        {
                        this.state.notices.map(notice =>
                            <SimpleNotice notice={notice}/>
                            )
                        }
                        {/* <SimpleNotice /> */}
                    </div>
                    <div>
                        <Link to="/nest/notification" className="link">
                            <Button style={{ outline: "none", width: "100%", borderColor: "#27B6BA", backgroundColor: "#27B6BA", borderTopLeftRadius: "0px", borderTopRightRadius: "0px", borderBottomLeftRadius: "10px", borderBottomRightRadius: "10px" }}>
                                모두 보기
                        </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        ApiService.fetchNotification().then(
          (response) => {
            this.setState({
                notices:response.data.data.notice
            });
          }
        );
      }

}
export default NavNotice