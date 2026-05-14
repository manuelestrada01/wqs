import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import HomePage from './pages/HomePage.jsx';
import SystemPage from './pages/SystemPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'sistemas/:categoria/:slug', element: <SystemPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
