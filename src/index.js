import React from 'react';
import ReactDOM from 'react-dom';
import Dashboard from './dashboard/Dashboard';
import * as serviceWorker from './serviceWorker';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <Dashboard />
  </React.StrictMode>,
  document.getElementById('root')
);
serviceWorker.unregister();
