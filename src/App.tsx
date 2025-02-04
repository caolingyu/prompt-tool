import { Layout, Typography } from 'antd';
import BaziForm from './components/BaziForm';
import BaziChart from './components/BaziChart';
import { BaziProvider } from './contexts/BaziContext';
import { FateDisplay } from './components/FateDisplay';
import { PromptDisplay } from './components/PromptDisplay';
import { useBazi } from './contexts/BaziContext';
import './App.css';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

function AppContent() {
  const { decadeFate, yearFates } = useBazi();

  return (
    <Layout className="layout">
      <Header>
        <Title level={2} style={{ color: 'white', margin: '10px 0' }}>
          玄学咒语生成器
        </Title>
      </Header>
      <Content style={{ padding: '24px 50px' }}>
        <BaziForm />
        {decadeFate && (
          <>
            <PromptDisplay />
            <BaziChart />
            <FateDisplay
              startingAge={decadeFate.startingAge}
              decadeFates={decadeFate.fates}
              yearFates={yearFates || []}
            />
          </>
        )}
      </Content>
      <Footer style={{ textAlign: 'center' }}>
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