import React from "react";
import { Link } from "react-router-dom"

import { Button, InputLabel } from "@material-ui/core";

import "./errors.scss"

const Errors = () => {
  return (
    <>
      <div className="Errors">
        <div className="ErrorsBox">
          <img style={{width:"150px", height:"150px"}} src="assets/images/nest-logo-black-errors.png" />
          <InputLabel id="ErrorsText">Errors!!</InputLabel>
          <br/>
          <Link to="/nest">
            <Button className="ErrorsButtons" id="MainBtn">메인으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Errors;