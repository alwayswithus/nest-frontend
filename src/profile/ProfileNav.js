import React, {Component} from 'react';
import './profile.scss';
import { Navbar, Nav } from "react-bootstrap";
import { withRouter } from 'react-router-dom';


class ProfileNav extends Component {
    render(){
        const { location } = this.props;
        console.log(this.props);
        const styleNav = {
          borderRadius:'0px', 
          width:'200px',
          margin: '0px',
          paddingTop:'20px', 
          background:'#D0D0D0',
          border:'none',
          fontSize: '1.5rem'
        }

    return (
      <div className="ProfileNav">
        <b>계정설정</b>
        <Navbar className="navsbar" style={styleNav} variant="light">
          <Nav activeKey={location.pathname}>
            <Nav.Link className="nav-link" href="/profile">프로필</Nav.Link>
            <Nav.Link className="nav-link" href="/profileset">설정</Nav.Link>
          </Nav>
        </Navbar>
      </div>
        );
    }
};

export default withRouter(ProfileNav);
