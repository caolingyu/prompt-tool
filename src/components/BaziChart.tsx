import React from 'react';
import { Card, Table } from 'antd';
import type { BaziPillar } from '../types/bazi';
import { useBazi } from '../contexts/BaziContext';

const BaziChart: React.FC = () => {
  const { baziData } = useBazi();

  const columns = [
    {
      title: '柱位',
      dataIndex: 'position',
      key: 'position',
      width: 100,
    },
    {
      title: '天干',
      dataIndex: 'stem',
      key: 'stem',
      width: 100,
      render: (stem: string, record: any) => (
        <span>
          {stem}
          {record.stemGod ? `(${record.stemGod})` : ''}
        </span>
      ),
    },
    {
      title: '地支',
      dataIndex: 'branch',
      key: 'branch',
      width: 100,
    },
    {
      title: '藏干',
      dataIndex: 'hiddenStems',
      key: 'hiddenStems',
      render: (gods: Array<[string, string]>) => 
        gods?.map(([stem, god]) => `${stem}(${god})`).join(', ') || '-'
    },
    {
      title: '五行',
      dataIndex: 'elements',
      key: 'elements',
      width: 150,
      render: (elements: [string, string]) => 
        elements?.filter(Boolean).join('、') || '-'
    },
  ];

  const dataSource = baziData ? [
    {
      key: 'year',
      position: '年柱',
      stem: baziData.yearPillar.stem,
      stemGod: baziData.yearPillar.stemGod,
      branch: baziData.yearPillar.branch,
      hiddenStems: baziData.yearPillar.branchGods,
      elements: baziData.yearPillar.elements,
    },
    {
      key: 'month',
      position: '月柱',
      stem: baziData.monthPillar.stem,
      stemGod: baziData.monthPillar.stemGod,
      branch: baziData.monthPillar.branch,
      hiddenStems: baziData.monthPillar.branchGods,
      elements: baziData.monthPillar.elements,
    },
    {
      key: 'day',
      position: '日柱',
      stem: baziData.dayPillar.stem,
      stemGod: baziData.dayPillar.stemGod,
      branch: baziData.dayPillar.branch,
      hiddenStems: baziData.dayPillar.branchGods,
      elements: baziData.dayPillar.elements,
    },
    {
      key: 'hour',
      position: '时柱',
      stem: baziData.hourPillar.stem,
      stemGod: baziData.hourPillar.stemGod,
      branch: baziData.hourPillar.branch,
      hiddenStems: baziData.hourPillar.branchGods,
      elements: baziData.hourPillar.elements,
    },
  ] : [];

  return (
    <Card title="八字排盘" style={{ marginBottom: 24 }}>
      <Table 
        columns={columns} 
        dataSource={dataSource} 
        pagination={false}
        bordered
        size="middle"
      />
      {baziData && (
        <div style={{ marginTop: 16 }}>
          <p>农历：{baziData.lunarDate.year}年{baziData.lunarDate.month}月{baziData.lunarDate.day}日</p>
          <p>干支：{baziData.lunarDate.yearInGanZhi}年 {baziData.lunarDate.monthInGanZhi}月 {baziData.lunarDate.dayInGanZhi}日</p>
        </div>
      )}
    </Card>
  );
};

export default BaziChart; 