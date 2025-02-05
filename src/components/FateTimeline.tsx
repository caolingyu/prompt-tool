import React, { useState } from 'react';
import { useBazi } from '../contexts/BaziContext';
import { DecadeFate } from '../types/bazi';
import { Card, Row, Col, Typography } from 'antd';
import { getYearFatesForDecade } from '../lib/calendar';
import './FateTimeline.css';

const { Title } = Typography;

export const FateTimeline: React.FC = () => {
  const { decadeFate, baziData } = useBazi();
  const [selectedDecade, setSelectedDecade] = useState<DecadeFate | null>(null);

  if (!decadeFate || !baziData) {
    return null;
  }

  const yearFates = selectedDecade ? getYearFatesForDecade(selectedDecade, baziData.dayPillar.stem) : [];

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
                    border: `2px solid ${selectedDecade === fate ? 'var(--accent-color)' : 'var(--border-color)'}`,
                    borderRadius: '8px',
                    textAlign: 'center',
                    background: selectedDecade === fate ? 'rgba(34, 162, 195, 0.1)' : 'white',
                    minWidth: '120px',
                    transition: 'all 0.3s',
                    boxShadow: selectedDecade === fate ? '0 2px 8px rgba(34, 162, 195, 0.2)' : 'none'
                  }}
                >
                  <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-primary)' }}>
                    {fate.stem}{fate.branch}
                  </div>
                  <div style={{ color: 'var(--text-secondary)' }}>
                    {fate.startAge}岁-{fate.endAge}岁
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
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
              color: 'var(--text-primary)',
              textAlign: 'center'
            }}>
              {selectedDecade.startYear}-{selectedDecade.endYear} 流年
            </Title>
            <Row gutter={[8, 8]} style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {yearFates.map((yearFate, index) => (
                <Col key={index} span={6}>
                  <div
                    className="year-fate-card"
                    style={{
                      padding: '12px',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      textAlign: 'center',
                      background: 'white',
                      transition: 'all 0.3s',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                    }}
                  >
                    <div style={{ 
                      fontWeight: 'bold',
                      fontSize: '20px',
                      color: 'var(--text-primary)',
                      marginBottom: '4px'
                    }}>{yearFate.stem}{yearFate.branch}</div>
                    <div style={{ 
                      color: 'var(--text-secondary)',
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