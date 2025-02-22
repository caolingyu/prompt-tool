import React from 'react';
import { Card, Typography } from 'antd';
import { useBazi } from '../contexts/BaziContext';
import { STEM_COLORS, BRANCH_COLORS } from '../constants/colors';
import styled from '@emotion/styled';

const { Title } = Typography;

const ChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
`;

const PillarsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  text-align: center;
`;

const PillarColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PillarHeader = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const PillarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-height: 80px;
`;

const GodElement = styled.div`
  font-size: 14px;
  color: #666;
`;

const PillarElement = styled.div<{ color?: string }>`
  font-size: 24px;
  font-weight: bold;
  color: ${props => props.color || 'inherit'};
`;

const HiddenStems = styled.div`
  margin-top: 8px;
  font-size: 14px;
  color: #666;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const DateInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  
  > div {
    display: flex;
    gap: 8px;
    
    > span:first-of-type {
      font-weight: bold;
      min-width: 60px;
    }
  }
`;

const BaziChart: React.FC = () => {
  const { baziData } = useBazi();

  if (!baziData) return null;

  // console.log('八字图表数据:', {
  //   年柱: {
  //     天干: baziData.yearPillar.stem,
  //     地支: baziData.yearPillar.branch,
  //     十神: baziData.yearPillar.stemGod,
  //     藏干: baziData.yearPillar.branchGods
  //   },
  //   月柱: {
  //     天干: baziData.monthPillar.stem,
  //     地支: baziData.monthPillar.branch,
  //     十神: baziData.monthPillar.stemGod,
  //     藏干: baziData.monthPillar.branchGods
  //   },
  //   日柱: {
  //     天干: baziData.dayPillar.stem,
  //     地支: baziData.dayPillar.branch,
  //     十神: baziData.dayPillar.stemGod,
  //     藏干: baziData.dayPillar.branchGods
  //   },
  //   时柱: {
  //     天干: baziData.hourPillar.stem,
  //     地支: baziData.hourPillar.branch,
  //     十神: baziData.hourPillar.stemGod,
  //     藏干: baziData.hourPillar.branchGods
  //   }
  // });

  const pillars = [
    { title: '年柱', data: baziData.yearPillar },
    { title: '月柱', data: baziData.monthPillar },
    { title: '日柱', data: baziData.dayPillar },
    { title: '时柱', data: baziData.hourPillar },
  ];

  return (
    <Card 
      style={{
        marginBottom: 24,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        background: 'rgba(255, 255, 255, 0.9)',
        border: '1px solid var(--border-color)'
      }}
      bodyStyle={{ padding: 0 }}
    >
      <div style={{
        background: 'var(--primary-color)',
        padding: '12px 24px',
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
        borderBottom: '2px solid var(--accent-color)'
      }}>
        <Title level={4} style={{ 
          color: 'var(--secondary-color)', 
          margin: 0,
          fontSize: '24px',
          textAlign: 'left',
          letterSpacing: '2px',
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)'
        }}>八字排盘</Title>
      </div>

      <ChartContainer>
        <PillarsContainer>
          {pillars.map(({ title, data }, index) => {
            // console.log(`${title}数据:`, {
            //   天干: data.stem,
            //   地支: data.branch,
            //   十神: data.stemGod,
            //   藏干: data.branchGods,
            //   是否日柱: index === 2
            // });
            return (
              <PillarColumn key={title}>
                <PillarHeader>{title}</PillarHeader>
                <PillarSection>
                  <GodElement>
                    {index === 2 ? '日主' : (data.stemGod || '')}
                  </GodElement>
                  <PillarElement color={STEM_COLORS[data.stem]}>
                    {data.stem}
                  </PillarElement>
                </PillarSection>
                <PillarSection>
                  <PillarElement color={BRANCH_COLORS[data.branch]}>
                    {data.branch}
                  </PillarElement>
                  <HiddenStems>
                    {data.branchGods.map(([stem, god], index) => (
                      <div key={index} style={{ color: STEM_COLORS[stem] }}>
                        {stem}·{god}
                      </div>
                    ))}
                  </HiddenStems>
                </PillarSection>
              </PillarColumn>
            );
          })}
        </PillarsContainer>
        
        <DateInfo>
          <div>
            <span>农历：</span>
            <span>
              {baziData.lunarDate.year}年
              {baziData.lunarDate.month}月
              {baziData.lunarDate.day}日
            </span>
          </div>
          <div>
            <span>干支：</span>
            <span>
              {baziData.lunarDate.yearInGanZhi}年 
              {baziData.lunarDate.monthInGanZhi}月 
              {baziData.lunarDate.dayInGanZhi}日
            </span>
          </div>
        </DateInfo>
      </ChartContainer>
    </Card>
  );
};

export default BaziChart; 