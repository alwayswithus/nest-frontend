import React, { Component, Fragment } from "react";
import { Router, Route } from "react-router-dom";
import Navigation from './Navigation';
import Home from './Home';
import File from './file/File';
import {BrowserRouter} from "react-router-dom";
import Header from './file/Header';
import Comment from './comment/Comment';
import ProfileMain from './profile/ProfileMain';


function App() {
  return (
    <div className="App">
      <Header name='김우경' date='2020.05.06'/>
      <BrowserRouter>
          <Navigation />
          <Route path="/" exact component={Home} />
          <Route path="/comment" exact component={Comment} />
          <Route path="/file" exact component={File} />
          <ProfileMain />
      </BrowserRouter>
      
    </div>
  );
}

export default App;
