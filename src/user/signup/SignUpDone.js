import React from "react";
import { Link } from "react-router-dom"

import { Button, InputLabel } from "@material-ui/core";

import "./signup.scss"

const SignUpDone = () => {
  return (
    <>
      <div className="SignUp">
        <div className="SignUpBox">
          <InputLabel id="SignUpText" className="SignUpText">가입 완료 🎉</InputLabel>

          <br/>
          <p>
          회원 가입을 환영합니다!
          </p>

          <br/>
          <Link to="/nest">
            <Button className="SignUpButtons" id="MainBtn">로그인 화면으로.</Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default SignUpDone;