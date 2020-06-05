import React, { useState } from "react";
import Input from "@material-ui/core/Input";

import { InputLabel } from "@material-ui/core";
import ApiService from '../../ApiService';

import "./signup.scss"

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [messageText, setMessageText] = useState("");
  const [check, setCheck] = useState("");

  const setEmailText = e => {
    setEmail(e.target.value);
  };

  const SignUp = e => {

    const emailRegExp = /^[\w-]+(\.[\w-]+)*@([a-z0-9-]+(\.[a-z0-9-]+)*?\.[a-z]{2,6}|(\d{1,3}\.){3}\d{1,3})(:\d{4})?$/;

    //console.log(email);
    // 이메일 분류...ㄷㄷㄷㄷㄷ
    if (!email.match(emailRegExp)) {
      setMessageText("이메일 형식이 올바르지 않습니다.");
      setEmail("");
      e.preventDefault();
      return;
    } else {
      ApiService.fetchEmailCheck(email)
      .then(response => {
        //console.log(response.data);
        if(response.data.data.userGrade=="정회원"){
          setMessageText("이미 가입된 이메일 입니다.");
          setEmail("");
          return;
        }
        setMessageText("완료.");
      });
      e.preventDefault();
    }
  };

  return (
    <>
      <div className="SignUp">
        <div className="SignUpBox">
          <img style={{width:"150px", height:"150px"}} src="/nest/assets/images/nest-logo-black.png" />

          <form onSubmit={SignUp} action="/nest/sendtomailbysignup" method="POST" >
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
            <br/>
            <br/>
            <p id="signUpMessageText"> {messageText} </p>

            <Input className="SignUpItems" 
            id="SignUpSubmit" type="submit" value="가입하기"/>
				  </form>
          <br/><br/>

        </div>
      </div>
    </>
  );
};

export default SignUp;