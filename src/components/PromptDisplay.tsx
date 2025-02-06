import React, { useState } from 'react';
import { Card, Button, message, Typography, Radio } from 'antd';
import { useBazi } from '../contexts/BaziContext';
import { CopyOutlined } from '@ant-design/icons';

const { Title } = Typography;

type PromptType = 'general' | 'marriage' | 'career' | 'health' | 'children';

export const PromptDisplay: React.FC = () => {
  const { baziData, decadeFate, yearFates } = useBazi();
  const [promptType, setPromptType] = useState<PromptType>('general');

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

    const basePrompt = `分析这个命盘, 性别为${gender}, 四柱为${fourPillars}, ${birthYear}年生, 出生后${startingYearMonthDay}起运, 大运为${decadeFates}, 流年为${recentYearFates}, 仅仅用盲派技法步骤深度分析, 不过多考虑身强身弱, 而是分析十神关系, 体用平衡。注意逻辑合理, 综合各种信息文本判断准确的关系模型, 交叉验证, 多次迭代后输出最终正确的结果`;

    // 根据不同类型生成不同的咒语
    const promptSuffix = {
      general: ', 并用通俗的语言分析此命的正缘, 事业, 健康等具体数据',
      marriage: '，并用通俗的语言分析此命的正缘特征、何时出现、婚姻状态（稳定与否、有无波折）、配偶大致情况（性格、职业倾向、相处模式）。 特别注意分析夫星/妻星的状态、婚姻宫的情况、以及与其它十神的关系。 是否有桃花、二婚、婚外情的倾向？',
      career: '，并用通俗的语言分析此命的事业发展方向、适合从事的行业、财富来源、财运起伏、有无破财风险、何时财运较好。 特别关注财星、官杀、食伤与日主的关系，以及它们在大运、流年中的变化。 有无贵人相助、合伙求财的机会？',
      health: '，并用通俗的语言分析此命容易出现的健康问题、身体的薄弱环节、需要特别注意的年份、以及如何进行养生保健。 重点关注五行平衡、十神受克、刑冲合害等情况。 是否有意外之灾、手术的信息？',
      children: '，并用通俗的语言分析此命的子女缘分深浅、子女数量、子女的性格特点、未来发展、与子女的关系。 特别关注时柱、食伤星的状态，以及它们与日主、其它十神的关系。 子女是否孝顺、有出息？ 是否有不利子女的信息？'
    };

    return basePrompt + promptSuffix[promptType];
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
          复制
        </Button>
      </div>
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)' }}>
        <Radio.Group 
          value={promptType} 
          onChange={e => setPromptType(e.target.value)}
          buttonStyle="solid"
          style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}
        >
          <Radio.Button value="general" style={{ flex: 1, textAlign: 'center', padding: '0 8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>通用</Radio.Button>
          <Radio.Button value="marriage" style={{ flex: 1, textAlign: 'center', padding: '0 8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>情感</Radio.Button>
          <Radio.Button value="career" style={{ flex: 1, textAlign: 'center', padding: '0 8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>事业</Radio.Button>
          <Radio.Button value="health" style={{ flex: 1, textAlign: 'center', padding: '0 8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>健康</Radio.Button>
          <Radio.Button value="children" style={{ flex: 1, textAlign: 'center', padding: '0 8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>子女</Radio.Button>
        </Radio.Group>
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