import React from 'react';
import ReactDOM from 'react-dom';
import Dashboard from './dashboard/Dashboard';
import ProfileMain from './profile/ProfileMain'
import * as serviceWorker from './serviceWorker';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <ProfileMain />
  </React.StrictMode>,
  document.getElementById('root')
);
serviceWorker.unregister();
