import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ClerkProvider } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY || 'pk_test_d2hvbGUtYnVnLTc3LmNsZXJrLmFjY291bnRzLmRldiQ';

const isValidKey = PUBLISHABLE_KEY && !PUBLISHABLE_KEY.endsWith('$') && PUBLISHABLE_KEY.startsWith('pk_');

if (!isValidKey) {
  console.warn('Invalid or missing Clerk Publishable Key. Running without authentication.');
}

const root = ReactDOM.createRoot(document.getElementById('root'));

if (isValidKey) {
  console.log('Using Clerk Key:', PUBLISHABLE_KEY.substring(0, 20) + '...');
  root.render(
    <React.StrictMode>
      <ClerkProvider 
        publishableKey={PUBLISHABLE_KEY} 
        afterSignOutUrl="/sign-in"
        signUpUrl={null}
      >
        <App />
      </ClerkProvider>
    </React.StrictMode>
  );
} else {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
