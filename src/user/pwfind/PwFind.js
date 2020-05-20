import React, { useState } from "react";
import Input from "@material-ui/core/Input";

import { InputLabel } from "@material-ui/core";

import "./pwFind.scss"

const PwFind = () => {
  const [email, setEmail] = useState("");

  const setEmailText = e => {
    setEmail(e.target.value);
  };

  const pwFind = e => {
    e.preventDefault();
  };

  return (
    <>
      <div className="PwFind">
        <div className="pwFindBox">
          <img style={{width:"150px", height:"150px"}} src="assets/images/nest-logo-black.png" />

          <form onSubmit={pwFind}>
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
            <br/><br/>

            <Input className="pwFindItems" 
            id="pwFindSubmit" type="submit" value="비밀번호 찾기"/>
				  </form>
          <br/><br/>

        </div>
      </div>
    </>
  );
};

export default PwFind;