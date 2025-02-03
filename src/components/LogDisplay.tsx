import React, { useState, useEffect } from 'react';
import { Card, List, Typography } from 'antd';

const { Text } = Typography;

interface LogMessage {
  timestamp: Date;
  message: string;
  type: 'info' | 'error';
}

interface LogDisplayProps {
  messages: LogMessage[];
}

export const LogDisplay: React.FC<LogDisplayProps> = ({ messages }) => {
  return (
    <Card title="计算日志" style={{ marginTop: 24 }}>
      <List
        dataSource={messages}
        renderItem={(item) => (
          <List.Item>
            <Text type={item.type === 'error' ? 'danger' : undefined}>
              [{item.timestamp.toLocaleTimeString()}] {item.message}
            </Text>
          </List.Item>
        )}
        size="small"
      />
    </Card>
  );
}; 