import React from 'react';
import ReactDOM from 'react-dom/client';
import { App as AntApp, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { App } from './app/App';
import { antdTheme } from './shared/design-system/generated/antd-theme.generated';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN} theme={antdTheme}>
      <AntApp><App /></AntApp>
    </ConfigProvider>
  </React.StrictMode>,
);
