import React from 'react';
import { Card, Button, message, Typography } from 'antd';
import { useBazi } from '../contexts/BaziContext';
import { CopyOutlined } from '@ant-design/icons';

const { Title } = Typography;

export const PromptDisplay: React.FC = () => {
  const { baziData, decadeFate, yearFates } = useBazi();

  if (!baziData || !decadeFate || !yearFates) {
    return null;
  }

  const generatePrompt = () => {
    const gender = baziData.gender === 'male' ? '男' : '女';
    const fourPillars = `${baziData.yearPillar.stem}${baziData.yearPillar.branch} ${baziData.monthPillar.stem}${baziData.monthPillar.branch} ${baziData.dayPillar.stem}${baziData.dayPillar.branch} ${baziData.hourPillar.stem}${baziData.hourPillar.branch}`;
    const birthYear = baziData.lunarDate.year;
    const startingAge = decadeFate.startingAge;
    const startingYearMonthDay = `${Math.floor(startingAge)}年${Math.round((startingAge % 1) * 12)}月${Math.round((((startingAge % 1) * 12) % 1) * 30)}天`;
    
    // 获取大运信息
    const decadeFates = decadeFate.fates.map(fate => 
      `${fate.stem}${fate.branch}(${fate.startAge}岁-${fate.endAge}岁)`
    ).join('、');

    // 获取最近10年流年信息
    const recentYearFates = yearFates.slice(0, 10).map(fate => 
      `${fate.year}年${fate.stem}${fate.branch}`
    ).join('、');

    return `分析这个命盘, 性别为${gender}, 四柱为${fourPillars}, ${birthYear}年生, 出生后${startingYearMonthDay}起运, 大运为${decadeFates}, 流年为${recentYearFates}，仅仅用盲派技法步骤深度分析, 不过多考虑身强身弱, 而是分析十神关系, 体用平衡。注意逻辑合理, 综合各种信息文本判断准确的关系模型, 交叉验证, 多次迭代后输出最终正确的结果, 并用通俗的语言分析此命的正缘, 事业, 健康等具体数据`;
  };

  const copyToClipboard = () => {
    const prompt = generatePrompt();
    navigator.clipboard.writeText(prompt)
      .then(() => {
        message.success('提示词已复制到剪贴板');
      })
      .catch(() => {
        message.error('复制失败，请手动复制');
      });
  };

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
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '2px solid var(--accent-color)'
      }}>
        <Title level={4} style={{ 
          color: 'var(--secondary-color)', 
          margin: 0,
          fontSize: '24px',
          textAlign: 'left',
          letterSpacing: '2px',
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)'
        }}>✨ AI咒语</Title>
        <Button 
          type="primary" 
          icon={<CopyOutlined />}
          onClick={copyToClipboard}
          size="large"
          style={{
            background: 'var(--accent-color)',
            borderColor: 'transparent',
            boxShadow: 'none'
          }}
        >
          
        </Button>
      </div>
      <div style={{ 
        padding: '24px',
        whiteSpace: 'pre-wrap',
        fontSize: '16px',
        lineHeight: '1.8',
        background: 'var(--background-light)',
        borderRadius: '4px',
        border: '1px solid var(--border-color)',
        margin: '16px',
        color: 'var(--text-primary)'
      }}>
        {generatePrompt()}
      </div>
    </Card>
  );
}; 