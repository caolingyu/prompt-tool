import React, { useState } from 'react';
import { useBazi } from '../contexts/BaziContext';
import { DecadeFate } from '../types/bazi';
import { Card, Row, Col, Typography } from 'antd';
import dayjs from 'dayjs';
import { getYearStemBranch } from '../utils/baziCalculator';
import './FateTimeline.css';

const { Title } = Typography;

export const FateTimeline: React.FC = () => {
  const { decadeFate, yearFates } = useBazi();
  const [selectedDecade, setSelectedDecade] = useState<DecadeFate | null>(null);

  if (!decadeFate || !yearFates) {
    return null;
  }

  const getYearFatesForDecade = (decade: DecadeFate) => {
    const startYear = decade.startYear;
    const endYear = decade.endYear;
    
    // 生成这个大运期间的所有年份的流年数据
    const years = [];
    for (let year = startYear; year <= endYear; year++) {
      const [stem, branch] = getYearStemBranch(dayjs(`${year}-01-01`));
      years.push({
        year: year,
        stem: stem,
        branch: branch,
      });
    }
    return years;
  };

  return (
    <Card
      style={{
        marginBottom: 24,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        borderRadius: '8px',
        background: 'rgba(255, 255, 255, 0.9)',
      }}
      bodyStyle={{ padding: 0 }}
    >
      <div style={{
        background: 'linear-gradient(90deg, #26C6DA 0%, #E91E63 50%, #FFD54F 100%)',
        padding: '12px 24px',
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
      }}>
        <Title level={4} style={{ 
          color: 'white', 
          margin: 0,
          fontSize: '24px',
          textAlign: 'left',
          letterSpacing: '2px',
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)'
        }}>大运流年</Title>
      </div>

      <div style={{ padding: '24px' }}>
        {/* 大运时间线 */}
        <div style={{ overflowX: 'auto', marginBottom: 24 }}>
          <Row gutter={[8, 16]} style={{ flexWrap: 'nowrap', minWidth: 'max-content' }}>
            {decadeFate.fates.map((fate, index) => (
              <Col key={index}>
                <div
                  onClick={() => setSelectedDecade(fate)}
                  style={{
                    cursor: 'pointer',
                    padding: '12px 20px',
                    border: `2px solid ${selectedDecade === fate ? '#E91E63' : '#d9d9d9'}`,
                    borderRadius: '8px',
                    textAlign: 'center',
                    background: selectedDecade === fate ? 'rgba(233, 30, 99, 0.1)' : 'white',
                    minWidth: '120px',
                    transition: 'all 0.3s',
                    boxShadow: selectedDecade === fate ? '0 2px 8px rgba(233, 30, 99, 0.2)' : 'none'
                  }}
                >
                  <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                    {fate.stem}{fate.branch}
                  </div>
                  <div style={{ color: '#666' }}>
                    {fate.startAge}岁-{fate.endAge}岁
                  </div>
                  <div style={{ color: '#999', fontSize: '12px' }}>
                    {fate.startYear}-{fate.endYear}
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        {/* 流年展示 */}
        {selectedDecade && (
          <div style={{ marginTop: 16 }}>
            <Title level={5} style={{ 
              marginBottom: 16,
              fontSize: '18px',
              color: '#333',
              textAlign: 'center'
            }}>
              {selectedDecade.startYear}-{selectedDecade.endYear} 流年
            </Title>
            <Row gutter={[8, 8]} style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {getYearFatesForDecade(selectedDecade).map((yearFate, index) => (
                <Col key={index} span={6}>
                  <div
                    className="year-fate-card"
                    style={{
                      padding: '12px',
                      border: '1px solid #E0E0E0',
                      borderRadius: '8px',
                      textAlign: 'center',
                      background: 'white',
                      transition: 'all 0.3s',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                    }}
                  >
                    <div style={{ 
                      fontWeight: 'bold',
                      fontSize: '20px',
                      color: '#333',
                      marginBottom: '4px'
                    }}>{yearFate.stem}{yearFate.branch}</div>
                    <div style={{ 
                      color: '#666',
                      fontSize: '14px'
                    }}>{yearFate.year}年</div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </div>
    </Card>
  );
}; 