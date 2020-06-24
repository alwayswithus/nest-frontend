import React from "react";
import { Link } from "react-router-dom"

import { Button, InputLabel } from "@material-ui/core";

import "./pwFind.scss"

const PwFindDone = () => {
  return (
    <>
      <div className="PwFind">
        <div className="pwFindBox">
          <InputLabel id="pwFindText">비밀번호 변경완료.</InputLabel>

          <br/>
          <p>
            비밀번호 변경이 완료되었습니다.
          </p>

          <br/>
          <Link to="/nest">
            <Button className="pwFindButtons" id="MainBtn">로그인 화면으로.</Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default PwFindDone;