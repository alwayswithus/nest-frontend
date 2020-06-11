import React, {Component} from 'react';
import './profilenav.scss';
import Nav from 'react-bootstrap/Nav'
import { withRouter } from 'react-router-dom';


class ProfileNav extends Component {
    render(){
        const { location } = this.props;
        const styleNav = {
          borderRadius:'0px', 
          width:'200px',
          margin: '0px',
          paddingTop:'20px', 
          // background:'#D0D0D0',
          border:'none',
          fontSize: '1.5rem',
          paddingLeft: '17px'
        }

        console.log(location.pathname)

    return (
      <>
        <div className="ProfileNav">
        <h3><b>계정설정</b></h3>
          {/* <Navbar className="navsbar" style={styleNav}> */}
            <Nav variant="pills" defaultActiveKey="/nest/profile">
              <Nav.Item>
                <Nav.Link style={{color:'black', fontWeight:'bolder'}} href="/nest/profile">프로필</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link style={{color:'black'}}  href="/nest/profileset">설정</Nav.Link>
              </Nav.Item>
            </Nav>
          {/* </Navbar> */}
        </div>
      </>
        );
    }
};

export default withRouter(ProfileNav);
