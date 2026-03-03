import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import './index.css';

import { ConfigProvider } from 'antd';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#4f46e5',
              borderRadius: 8,
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            },
          }}
        >
          <AppRoutes />
        </ConfigProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;