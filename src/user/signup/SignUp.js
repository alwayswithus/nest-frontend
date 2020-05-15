import React, { useState } from "react";
import Input from "@material-ui/core/Input";

import { InputLabel } from "@material-ui/core";

import "./signup.scss"

const SignUp = () => {
  const [email, setEmail] = useState("");

  const setEmailText = e => {
    setEmail(e.target.value);
  };

  const SignUp = e => {
    e.preventDefault();
  };

  return (
    <>
      <div className="SignUp">
        <div className="SignUpBox">
          <img style={{width:"150px", height:"150px"}} src="images/nest-logo-black.png" />

          <form onSubmit={SignUp}>
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