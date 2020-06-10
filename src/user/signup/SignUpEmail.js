import React from "react";
import Input from "@material-ui/core/Input";

import { Button, InputLabel } from "@material-ui/core";
import ApiService from '../../ApiService';

import "./signup.scss"
import { Route, useRouteMatch } from "react-router-dom";

class SignUpEmail extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {
      no:null,
      name:"",
      password:"",
      passwordck:"",
      messageText:""
    }
    
  }  

  render(){
    const key = this.props.match.params.keys;
    
    if (key==""){
      window.location.href = "/nest/errors";
      return;
    } else if(key) {
      console.log(key);
    }
    ApiService.fetchEmailKeyCK(key).then();
    // 0609 작업 여기까지.....


    const setNameText = e => {
      let keyword = e.target.value;
      this.setState({
        messageText: "",
        name: keyword
      });
    };

    const setPasswordText = e => {
      let keyword = e.target.value;
      this.setState({
        messageText: "",
        password: keyword
      });
    };

    const setPasswordckText = e => {
      let keyword = e.target.value;
      this.setState({
        messageText: "",
        passwordck: keyword
      });
    };

    const Check = e => {
      if (this.state.password === "") {
        this.setState({
          password: "",
          passwordck: "",
          messageText: "비밀번호가 입력되지 않았습니다."
        })
      } else if (this.state.passwordck === "") {
        this.setState({
          password: "",
          passwordck: "",
          messageText: "비밀번호 확인을 입력해 주십시오."
        })
      } else if (this.state.password !== this.state.passwordck) {
        this.setState({
          password: "",
          passwordck: "",
          messageText: "비밀번호가 일치 하지 않습니다."
        })
      } else {
        this.setState({
          messageText: "확인됨."
        })
      }

    }

    return (
      <>
        <div className="SignUp">
          <div className="SignUpBox">
            <img style={{width:"150px", height:"150px"}} src="/nest/assets/images/nest-logo-black.png" />
  
            <form action="/nest/signupset" method="POST" >
              <InputLabel id="signUpText">회원가입</InputLabel>
              <br/>
              <Input
                      className="SignUpItems"
                      name="name"
                      id="name"
                      placeholder="이름 입력."
                      onChange={setNameText}
                      value={this.state.name}
                    />
              <br/><br/>
  
              <Input
                      className="SignUpItems"
                      name="password"
                      id="password"
                      type="password"
                      placeholder="비밀번호 입력."
                      onChange={setPasswordText}
                      value={this.state.password}
                    />
              <br/><br/>
  
              <Input
                      className="SignUpItems"
                      name="passwordck"
                      id="passwordck"
                      type="password"
                      placeholder="비밀번호 확인."
                      onChange={setPasswordckText}
                      value={this.state.passwordck}
                    />
              <br/><br/>
  
                  <p id={(this.state.messageText == "확인됨.") ? "doneText" : "errorText"}> { this.state.messageText } <br /></p>
                  {
                      (this.state.messageText == "확인됨.") ?
                          <Input className="SignUpItems" id="SignUpSubmit" type="submit" value="입력완료" />
                            :
                          <Button className="SignUpItems" id="Btn" onClick={Check}>입력확인</Button>
                  }
  
            </form>
            <br/><br/>
          </div>
        </div>
      </>
    );
  }
}

export default SignUpEmail;