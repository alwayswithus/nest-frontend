import React, { useState } from "react";
import { Link } from "react-router-dom"
import Input from "@material-ui/core/Input";

import { Button, InputLabel } from "@material-ui/core";
import ApiService from '../../ApiService';

import "./login.scss"

const Login = (it) => {
  const ck = it.location.search;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [textbox, setTextbox] = useState((ck==="?error")?"이메일 또는 비밀번호가 불일치 합니다.":"");

  const setEmailText = e => {
    setTextbox("");
    setEmail(e.target.value);
  };

  const setPasswordText = e => {
    setTextbox("");
    setPassword(e.target.value);
  };

  const login = e => {
    // e.preventDefault();
    const emailRegExp = /^[\w-]+(\.[\w-]+)*@([a-z0-9-]+(\.[a-z0-9-]+)*?\.[a-z]{2,6}|(\d{1,3}\.){3}\d{1,3})(:\d{4})?$/;
    if(email === ""){
      setTextbox("이메일을 입력해 주십시오.");
      setEmail("");
      setPassword("");
      e.preventDefault();
      return;
    } else if(!email.match(emailRegExp)){
      setTextbox("이메일 형식이 올바르지 않습니다.");
      setEmail("");
      setPassword("");
      e.preventDefault();
      return;
    } else if(password === ""){
      setTextbox("비밀번호를 입력해 주십시오.");
      setPassword("");
      e.preventDefault();
      return;
    } else {
      ApiService.fetchLogin(e.target.email.value, e.target.password.value)
        .then(response => {
          if (response.data.data) {
            // setTextbox("접속중...");
            sessionStorage.setItem("authUserNo", response.data.data.userNo)
            sessionStorage.setItem("authUserEmail", response.data.data.userEmail)
            sessionStorage.setItem("authUserName", response.data.data.userName)
            sessionStorage.setItem("authUserPhoto", response.data.data.userPhoto)
            sessionStorage.setItem("authUserBg", response.data.data.userBg)
          }
        });
      // setTextbox("이메일 또는 비밀번호가 불일치 합니다.");
    }
  };

  return (
    <>
      <div className="Login">
        <div className="loginBox">
          {/* <img style={{width:"150px", height:"150px"}} src="/nest/assets/images/nest-logo-black.png" alt="로고 사진"/> */}
          <form onSubmit={login}  action="/nest/auth" method="POST" >
            <InputLabel id="loginText">NEST</InputLabel>
            <p id="note_texts"> {textbox} <br/></p>

            <Input
                    className="loginItems"
                    name="email"
                    id="email"
                    placeholder="Email@example.com"
                    onChange={setEmailText}
                    value={email}
                  />
            <br/><br/>

            <Input
                    className="loginItems"
                    name="password" 
                    type="password"
                    placeholder="password"
                    onChange={setPasswordText}
                    value={password}
                  />
            <br/><br/>
          
            <Input className="loginItems" id="loginSubmit" type="submit" value="로그인" />
				  </form>

          <br/>
          <Link to="/nest/signup">
            <Button className="loginButtons" id="SignUpBtn">회원가입 하기</Button>
          </Link>
          <br/>
          <Link to="/nest/pwfind">
            <Button className="loginButtons" id="PwFindBtn">비밀번호 찾기</Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Login;