import React from 'react';
import { DecadeFate, YearFate } from '../lib/calendar';
import { Table, Timeline } from 'antd';

interface FateDisplayProps {
  startingAge: number;
  decadeFates: DecadeFate[];
  yearFates?: YearFate[];
}

export const FateDisplay: React.FC<FateDisplayProps> = ({
  startingAge,
  decadeFates,
  yearFates
}) => {
  // console.log('FateDisplay props:', { startingAge, decadeFates, yearFates });

  // 添加数据检查
  if (!decadeFates?.length) {
    return <div>没有大运数据</div>;
  }

  return (
    <div className="fate-display">
      <div style={{ marginBottom: 16 }}>
        <h3>起运年龄：{startingAge}岁</h3>
        <Timeline>
          {decadeFates.map((fate, index) => (
            <Timeline.Item key={index}>
              {`${fate.startAge}岁 - ${fate.endAge}岁 (${fate.startYear}-${fate.endYear}): ${fate.stem}${fate.branch}`}
            </Timeline.Item>
          ))}
        </Timeline>
      </div>

      {yearFates && yearFates.length > 0 && (
        <div>
          <h3>流年信息</h3>
          <Table
            columns={[
              {
                title: '年份',
                dataIndex: 'year'
              },
              {
                title: '干支',
                render: (_, record) => `${record.stem}${record.branch}`
              },
              {
                title: '天干十神',
                dataIndex: 'stemGod'
              }
            ]}
            dataSource={yearFates}
            rowKey="year"
            pagination={{ pageSize: 10 }}
          />
        </div>
      )}
    </div>
  );
}; 