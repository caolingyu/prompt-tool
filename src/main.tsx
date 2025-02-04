import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider, theme } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import App from './App'
import './index.css'
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');

const customTheme = {
  token: {
    colorPrimary: '#22a2c3',
    colorBgContainer: '#ffffff',
    colorBorder: '#b0d5df',
    colorText: '#21373d',
    colorTextSecondary: '#4a6670',
    borderRadius: 8,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider 
      locale={zhCN}
      theme={customTheme}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>,
) 