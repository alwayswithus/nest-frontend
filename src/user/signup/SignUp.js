import React, { useState } from "react";
import Input from "@material-ui/core/Input";

import { Button, InputLabel } from "@material-ui/core";
import ApiService from '../../ApiService';

import "./signup.scss"

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [messageText, setMessageText] = useState("");

  const setEmailText = e => {
    setMessageText("")
    setEmail(e.target.value);
  };

  const mailCheck = e =>{
    const emailRegExp = /^[\w-]+(\.[\w-]+)*@([a-z0-9-]+(\.[a-z0-9-]+)*?\.[a-z]{2,6}|(\d{1,3}\.){3}\d{1,3})(:\d{4})?$/;
    if (!email.match(emailRegExp)) {
      setMessageText("이메일 형식이 올바르지 않습니다.");
      setEmail("");
      return;
    } else {
      ApiService.fetchEmailCheck(email)
      .then(response => {
        if(response.data.data.userGrade==="정회원"){
          setMessageText("이미 가입된 이메일 입니다.");
          setEmail("");
        }else{
          setMessageText("확인됨.");
        }
      });
    }
  };

  const SignUp = e => {
    if(messageText!=="확인됨."){
      e.preventDefault();
      return;
    }

    window.location.href = "/nest/sendmail"

  };

  return (
    <>
      <div className="SignUp">
        <div className="SignUpBox">
          <img style={{width:"150px", height:"150px"}} src="/nest/assets/images/nest-logo-black.png" alt="로고 사진"/>

          <form onSubmit={SignUp} action="/nest/sendmail?mode=signup" method="POST" >
            <InputLabel id="signUpText">회원가입</InputLabel>
            <br/>
            <Input
                    className="SignUpItems"
                    name="email"
                    id="email"
                    placeholder="이메일 주소 입력."
                    onChange={setEmailText}
                    value={email}
                  />
            <br/><br/>

            <p id={(messageText==="확인됨.") ? "doneText":"errorText"}> {messageText} <br/></p>

            {
              (messageText==="확인됨.") ?
                  <Input className="SignUpItems" id="SignUpSubmit" type="submit" value="가입하기"/>
                :
                  <Button className="SignUpItems" id="Btn" onClick={mailCheck}>이메일 중복확인</Button>
            }

				  </form>
          <br/><br/>

        </div>
      </div>
    </>
  );
};

export default SignUp;