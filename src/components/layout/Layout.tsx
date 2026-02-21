import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Flex from '../common/Flex';
import Navbar from './Navbar';

const LayoutContainer = styled(Flex).attrs({
  width: '100%',
})`
  min-height: 100vh;
  flex-direction: column;
`;

const Content = styled(Flex).attrs({ flex: 1 })`
  max-width: 1280px;
  margin: 0 auto;
  padding: 1.5rem 2rem;
  width: 100%;
  box-sizing: border-box;
`;

function Layout() {
  return (
    <LayoutContainer>
      <header style={{ flexShrink: 0 }}>
        <Navbar />
      </header>
      <Content as="main">
        <Outlet />
      </Content>
    </LayoutContainer>
  );
}

export default Layout;
