import React, {Component} from 'react';
import './profilenav.scss';
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Nav'
import { withRouter, Link } from 'react-router-dom';


class ProfileNav extends Component {
    render(){
        const { location } = this.props;
        const styleNav = {
          borderRadius:'0px', 
          float: 'left',
          margin: '0px',
          paddingTop:'20px', 
          // background:'#D0D0D0',
          border:'none',
          fontSize: '1.5rem',
        }

        console.log(location.pathname)

    return (
      <>
        <div className="ProfileNav">
        <h3><b>계정설정</b></h3>
          <Navbar className="navsbar" style={styleNav}>
            <Nav variant="pills" >
              <Nav.Item className={location.pathname==="/nest/profile" ? "nav-item-active" : "nav-item"} style={{display:'inline-block'}}>
                <Link style={{color:'black'}} to="/nest/profile">프로필</Link>
              </Nav.Item>
              <Nav.Item className={location.pathname==="/nest/profileset" ? "nav-item-active" : "nav-item"} style={{display:'inline-block'}}>
                <Link style={{color:'black'}}  to="/nest/profileset">설정</Link>
              </Nav.Item>
            </Nav>
          </Navbar>
        </div>
      </>
        );
    }
};

export default withRouter(ProfileNav);
