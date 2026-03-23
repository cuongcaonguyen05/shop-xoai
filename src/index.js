import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom'; // ← thêm dòng này

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>   {/* ← bọc App bên trong */}
    <App />
  </BrowserRouter>
);