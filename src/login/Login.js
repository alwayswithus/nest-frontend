import React, { useState } from "react";
import Input from "@material-ui/core/Input";

import { Button } from "@material-ui/core";

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
    e.preventDefault();
  };

  return (
    <>
      <div className="Login">
        <div className="loginBox">
          <img style={{width:"150px", height:"150px"}} src="images/nest-logo-black.png" />
          <form onSubmit={login}>
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

            <Input className="loginItems" 
            id="loginSubmit" type="submit" value="로그인"/>
				  </form>

          <br/>
          <Button className="loginButtons">회원가입 하기</Button>
          <br/>
          <Button className="loginButtons">비밀번호 찾기</Button>
        </div>
      </div>
    </>
  );
};

export default Login;