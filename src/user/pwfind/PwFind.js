import React, { useState } from "react";
import Input from "@material-ui/core/Input";

import { Button, InputLabel } from "@material-ui/core";
import ApiService from '../../ApiService';

import "./pwFind.scss"

const PwFind = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [messageText, setMessageText] = useState("");

  const setEmailText = e => {
    setEmail(e.target.value);
    setMessageText("");
  };

  const setNameText = e => {
    setName(e.target.value);
    setMessageText("");
  };

  const mailCheck = e =>{
    const emailRegExp = /^[\w-]+(\.[\w-]+)*@([a-z0-9-]+(\.[a-z0-9-]+)*?\.[a-z]{2,6}|(\d{1,3}\.){3}\d{1,3})(:\d{4})?$/;
    if (!email.match(emailRegExp)) {
      setMessageText("이메일 형식이 올바르지 않습니다.");
      setEmail("");
      return;
    } else {
      ApiService.fetchEmailCheck(email, name)
      .then(response => {
        if(response.data.data.userGrade=="정회원"){
          setMessageText("확인됨.");
        }else{
          setMessageText("이메일 또는 이름이 맞지 않습니다.");
          setEmail("");
          setName("");
        }
      });
    }
  };

  const pwFind = e => {
    if(messageText!="확인됨."){
      e.preventDefault();
    }
  };
  
  return (
    <>
      <div className="PwFind">
        <div className="pwFindBox">
          <img style={{width:"150px", height:"150px"}} src="/nest/assets/images/nest-logo-black.png" />

          <form onSubmit={pwFind} action="/nest/sendmail?mode=findpw" method="POST">
            <InputLabel id="pwFindText">비밀번호 찾기</InputLabel>
            <br/>
            <Input
                    className="pwFindItems"
                    name="email"
                    id="email"
                    placeholder="이메일 주소 입력."
                    onChange={setEmailText}
                    value={email}
                  />
            <br/>
            <br/>
            <Input
                    className="pwFindItems"
                    name="name"
                    id="name"
                    placeholder="이름 입력."
                    onChange={setNameText}
                    value={name}
                  />
            <br/>
            <br/>
            <p id={(messageText=="확인됨.") ? "doneText":"errorText"}> {messageText} <br/></p>
            {
              (messageText=="확인됨.") ?
                  <Input className="pwFindItems" id="pwFindSubmit" type="submit" value="인증 메일 발송"/>
                :
                  <Button className="pwFindItems" id="Btn" onClick={mailCheck}>이메일 유효성 검사</Button>
            }

				  </form>
          <br/>

        </div>
      </div>
    </>
  );
};

export default PwFind;