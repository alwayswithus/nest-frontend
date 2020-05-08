import React, { Component, Fragment } from "react";
import { Router, Route } from "react-router-dom";
import {BrowserRouter} from "react-router-dom";
import Profile from './Profile';


const ProfileMain= () => {
  return (
    <div className="profileMain">
      <BrowserRouter>
            <Route path="/profile" exact component={Profile} />
      </BrowserRouter>
      
    </div>
  );
}

export default ProfileMain;
