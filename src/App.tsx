import { Layout, Typography } from 'antd';
import BaziForm from './components/BaziForm';
import BaziChart from './components/BaziChart';
import { BaziProvider } from './contexts/BaziContext';
import { PromptDisplay } from './components/PromptDisplay';
import { FateTimeline } from './components/FateTimeline';
import { useBazi } from './contexts/BaziContext';
import './App.css';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

function AppContent() {
  const { decadeFate } = useBazi();

  return (
    <Layout className="layout" style={{ background: 'var(--background-light)' }}>
      <Header style={{ 
        background: 'var(--primary-color)',
        textAlign: 'center',
        padding: '20px',
        height: 'auto',
        borderBottom: '3px solid var(--accent-color)'
      }}>
        <Title style={{ 
          color: 'var(--secondary-color)', 
          margin: '0 auto',
          fontSize: '36px',
          letterSpacing: '4px',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
          textAlign: 'center',
          maxWidth: '800px'
        }}>
          玄学咒语生成器
        </Title>
      </Header>
      <Content style={{ 
        padding: '24px 50px',
        minHeight: 'calc(100vh - 84px - 70px)', // 调整高度以适应新的header高度
        background: 'var(--background-light)'
      }}>
        <BaziForm />
        {decadeFate && (
          <>
            <PromptDisplay />
            <BaziChart />
            <FateTimeline />
          </>
        )}
      </Content>
      <Footer style={{ 
        textAlign: 'center',
        background: 'var(--primary-color)',
        color: 'var(--secondary-color)',
        borderTop: '3px solid var(--accent-color)'
      }}>
        玄学咒语生成器 ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  );
}

function App() {
  return (
    <BaziProvider>
      <AppContent />
    </BaziProvider>
  );
}

export default App; 