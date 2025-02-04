import { Layout, Typography } from 'antd';
import BaziForm from './components/BaziForm';
import BaziChart from './components/BaziChart';
import { BaziProvider } from './contexts/BaziContext';
import { FateDisplay } from './components/FateDisplay';
import { LogDisplay } from './components/LogDisplay';
import { useBazi } from './contexts/BaziContext';
import './App.css';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

function AppContent() {
  const { decadeFate, yearFates, logs } = useBazi();

  return (
    <Layout className="layout">
      <Header>
        <Title level={2} style={{ color: 'white', margin: '10px 0' }}>
          八字分析
        </Title>
      </Header>
      <Content style={{ padding: '24px 50px' }}>
        <BaziForm />
        <BaziChart />
        {decadeFate && (
          <FateDisplay
            startingAge={decadeFate.startingAge}
            decadeFates={decadeFate.fates}
            yearFates={yearFates || []}
          />
        )}
        <LogDisplay messages={logs} />
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        八字分析 ©{new Date().getFullYear()}
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