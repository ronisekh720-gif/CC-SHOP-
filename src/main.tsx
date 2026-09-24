import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

export const safeRun = (fn: () => void) => {
  try {
    fn();
  } catch (error) {
    console.error("CC STORE Error:", error);
  }
};

window.addEventListener("error", (event) => {
  console.error("CC STORE Error:", event.error || event.message);
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("CC STORE Promise Error:", event.reason);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

