import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import loadUser from './components/auth/loadUser';

//로그인 확인
loadUser();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
