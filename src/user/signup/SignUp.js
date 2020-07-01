import React, { useState } from "react";
import Input from "@material-ui/core/Input";

import { Button, InputLabel } from "@material-ui/core";
import ApiService from '../../ApiService';

import ReactLoading from 'react-loading';

import "./signup.scss"

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(false);

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
        }else if(response.data.data.userGrade==="비회원"){
          setMessageText("탈퇴된 회원의 이메일 입니다.");
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
    }else{
      setLoading(true);
    }
  };

  return (
    <>
      <div className="SignUp">
        <div className="SignUpBox">
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
            <br/>
            <br/>
            <p id={(messageText==="확인됨.") ? "doneText":"errorText"}> {messageText} <br/></p>

            {
              (messageText==="확인됨.") ?
                (
                  (loading)? 
                    <div style={{margin:"auto", height:"40px", width:"40px"}}>
                      <ReactLoading type={'spinningBubbles'} color={'#000000'} height={40} width={40} />
                    </div>
                      :
                    <Input className="SignUpItems" id="SignUpSubmit" type="submit" value="가입하기"/>
                )
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