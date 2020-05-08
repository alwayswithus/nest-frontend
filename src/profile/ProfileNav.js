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
          padding:'0px', 
          background:'#D0D0D0',
          border:'none',
          fontSize: '1.5rem'
        }

    return (
      <div className="ProfileNav">
        <Navbar className="navsbar" style={styleNav} variant="light">
          <Nav activeKey={location.pathname}>
            <Nav.Link className="nav-link" href="/profile">프로필</Nav.Link>
            <Nav.Link className="nav-link" href="/profile/setting">설정</Nav.Link>
          </Nav>
        </Navbar>
      </div>
        );
    }
};

export default withRouter(ProfileNav);
