import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';
import { registerCanvasMeasurer } from './templates/common';
import * as exportApi from './core/export';

// מדידת טקסט מדויקת עם canvas — קריטי לשבירת שורות ועיגון נכונים
registerCanvasMeasurer();

// hook לבדיקות אוטומטיות
(window as unknown as Record<string, unknown>).__hnExport = exportApi;

const root = ReactDOM.createRoot(document.getElementById('root')!);

function render() {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

render();

// אחרי שפונט Heebo נטען המדידות משתנות — רינדור מחדש
if (document.fonts?.ready) {
  document.fonts.ready.then(() => render());
}
