import React from "react";
import { Link } from "react-router-dom"

import { Button, InputLabel } from "@material-ui/core";

import "./sendmail.scss"

const SendMail = () => {
  return (
    <>
      <div className="SendMail">
        <div className="SendMailBox">
          <InputLabel id="SendMailText">메일을 전송합니다.</InputLabel>

          <br/>
          <p>
              메일을 통해 제공되는 <br/>
              지시를 따라 진행해 주세요.<br/>
              메일전송이 완료될 때 까지 <br/>
              다소의 시간이 걸립니다.
          </p>

          <br/>
          <Link to="/nest">
            <Button className="SendMailButtons" id="MainBtn">메인으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default SendMail;