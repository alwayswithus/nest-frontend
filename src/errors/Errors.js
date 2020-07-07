import React from "react";

import { Button, InputLabel } from "@material-ui/core";

import "./errors.scss"

const Errors = () => {
  
  const sessionClear = e =>{
    sessionStorage.clear(); 
  };

  return (
    <>
      <div className="Errors">
        <div className="ErrorsBox">
          <InputLabel id="ErrorsText">Errors!!</InputLabel>
          <br/>
          <a href="/nest">
            <Button className="ErrorsButtons" id="MainBtn" onClick={sessionClear}>메인으로 돌아가기</Button>
          </a>
        </div>
      </div>
    </>
  );
};

export default Errors;