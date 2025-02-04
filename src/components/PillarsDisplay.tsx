import React from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { PillarInfo } from '../lib/types';

interface PillarsDisplayProps {
  pillars: {
    year: PillarInfo;
    month: PillarInfo;
    day: PillarInfo;
    hour: PillarInfo;
  };
}

export const PillarsDisplay: React.FC<PillarsDisplayProps> = ({ pillars }) => {
  const columns: ColumnsType<any> = [
    {
      title: '柱位',
      dataIndex: 'position',
    },
    {
      title: '天干',
      dataIndex: 'stem',
    },
    {
      title: '地支',
      dataIndex: 'branch',
    },
    {
      title: '藏干',
      key: 'hiddenStems',
      render: (_, record) => record.branchGods.map(([stem, god]: [string, string]) => `${stem}(${god})`).join('、')
    },
    {
      title: '五行',
      key: 'elements',
      render: (_, record) => record.elements.filter((e: string) => e).join('、')
    }
  ];

  const dataSource = [
    { position: '年柱', ...pillars.year },
    { position: '月柱', ...pillars.month },
    { position: '日柱', ...pillars.day },
    { position: '时柱', ...pillars.hour }
  ];

  return (
    <div className="pillars-display">
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        size="small"
        scroll={{ x: true }}
      />
    </div>
  );
}; 