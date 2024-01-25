import 'animate.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import 'react-international-phone/style.css';
import { Provider } from 'react-redux';
import App from './App.tsx';
import { store } from './app/store.ts';
import './index.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
