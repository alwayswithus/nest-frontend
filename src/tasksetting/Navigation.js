import React, {Component} from 'react';
import './Main.scss';
import { Navbar, Nav } from "react-bootstrap";
import { withRouter } from 'react-router-dom';

class Navigation extends Component {
    render(){
        const { location } = this.props;
        console.log(this.props);
    return (
      <div className="Navigation">
        <Navbar className="navsbar" bg="light" variant="light">
          <Nav activeKey={location.pathname}>
            <Nav.Link className="nav-link" href="/">속성</Nav.Link>
            <Nav.Link className="nav-link" href="/comment">코멘트</Nav.Link>
            <Nav.Link className="nav-link" href="/file">파일 & 링크</Nav.Link>
          </Nav>
        </Navbar>
      </div>
        );
    }
};

export default withRouter(Navigation);
