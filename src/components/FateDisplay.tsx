import React from 'react';
import { DecadeFate, YearFate } from '../lib/calendar';
import { Table, Timeline, Card, Row, Col } from 'antd';
import type { ColumnsType } from 'antd/es/table';

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
  console.log('FateDisplay props:', { startingAge, decadeFates, yearFates });

  // 添加数据检查
  if (!decadeFates?.length) {
    return <div>没有大运数据</div>;
  }

  const decadeColumns: ColumnsType<DecadeFate> = [
    {
      title: '大运',
      key: 'decade',
      render: (_, record) => `${record.stem}${record.branch}`
    },
    {
      title: '年龄',
      key: 'age',
      render: (_, record) => `${record.startAge}-${record.endAge}岁`
    },
    {
      title: '年份',
      key: 'year',
      render: (_, record) => `${record.startYear}-${record.endYear}`
    },
    {
      title: '天干十神',
      dataIndex: 'stemGod'
    },
    {
      title: '地支藏干',
      key: 'branchGods',
      render: (_, record) => record.branchGods.map(([stem, god]) => `${stem}(${god})`).join('、')
    },
    {
      title: '五行',
      key: 'elements',
      render: (_, record) => record.elements.filter(e => e).join('、')
    }
  ];

  const yearColumns: ColumnsType<YearFate> = [
    {
      title: '年份',
      dataIndex: 'year'
    },
    {
      title: '干支',
      key: 'ganZhi',
      render: (_, record) => `${record.stem}${record.branch}`
    },
    {
      title: '天干十神',
      dataIndex: 'stemGod'
    },
    {
      title: '地支藏干',
      key: 'branchGods',
      render: (_, record) => record.branchGods.map(([stem, god]) => `${stem}(${god})`).join('、')
    },
    {
      title: '五行',
      key: 'elements',
      render: (_, record) => record.elements.filter(e => e).join('、')
    }
  ];

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