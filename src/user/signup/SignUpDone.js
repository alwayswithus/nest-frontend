import React from "react";
import { Link } from "react-router-dom"

import { Button, InputLabel } from "@material-ui/core";

import "./signup.scss"

const SignUpDone = () => {
  return (
    <>
      <div className="SignUp">
        <div className="SignUpBox">
          <img style={{width:"150px", height:"150px"}} src="/nest/assets/images/nest-logo-black-errors.png" />
          <InputLabel id="SignUpText">가입 완료.</InputLabel>

          <br/>
          <p>
              회원 가입이 완료되었습니다.
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