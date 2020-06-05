import React, { useState } from "react";
import { Link } from "react-router-dom"
import Input from "@material-ui/core/Input";

import { Button, InputLabel } from "@material-ui/core";
import ApiService from '../../ApiService';

import "./login.scss"

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const setEmailText = e => {
    setEmail(e.target.value);
  };

  const setPasswordText = e => {
    setPassword(e.target.value);
  };

  const login = e => {
    //e.preventDefault();
    ApiService.fetchLogin(e.target.email.value, e.target.password.value)
    .then(response => {
      sessionStorage.setItem("authUserNo", response.data.data.userNo)
      sessionStorage.setItem("authUserEmail", response.data.data.userEmail)
      sessionStorage.setItem("authUserName", response.data.data.userName)
      sessionStorage.setItem("authUserPhoto", response.data.data.userPhoto)
      sessionStorage.setItem("authUserBg", response.data.data.userBg)

    });
  };

  return (
    <>
      <div className="Login">
        <div className="loginBox">
          <img style={{width:"150px", height:"150px"}} src="/nest/assets/images/nest-logo-black.png" />
          <form onSubmit={login}  action="/nest/auth" method="POST" >
            <InputLabel id="loginText">Log In</InputLabel>
            <br/>
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