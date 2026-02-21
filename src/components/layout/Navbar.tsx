import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import Flex from '../common/Flex';
import Text from '../common/Text';

const navItems = [
  { to: '/exchange', label: '거래소' },
  { to: '/holdings', label: '보유 자산' },
  { to: '/events', label: '이벤트' },
  { to: '/mypage', label: '마이페이지' },
] as const;

const Nav = styled(Flex)`
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--surface);
  border-bottom: 1px solid var(--line);
  padding: 0.75rem 0;
  backdrop-filter: saturate(180%) blur(8px);
`;

const List = styled(Flex).attrs({
  row: true,
  gap: 8,
  verticalCenter: true,
})`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const NavLinkStyled = styled(NavLink)`
  padding: 0.5rem 1rem;
  color: var(--text-muted);
  text-decoration: none;
  border-radius: 6px;
  transition: background-color 0.2s, color 0.2s;
    
  &:hover {
    color: var(--text);
    background: var(--surface-2);
  }

  &.active {
    color: var(--text);
    font-weight: 500;
    background: var(--surface-2);
  }
`;

function Navbar() {
  return (
    <Nav>
      <Flex width="100%" maxWidth={1280} padding="0 2rem" row verticalCenter>
        <Flex flex={1} row verticalCenter gap={12}>
          <Text as="span" weight={700} size={16} style={{ letterSpacing: '-0.02em' }}>
            fospi
          </Text>
        </Flex>
        <List as="ul">
        {navItems.map(({ to, label }) => (
          <li key={to}>
            <NavLinkStyled
              to={to}
              className={({ isActive }) => (isActive ? 'active' : '')}
              end={to === '/exchange'}
            >
              <Text>{label}</Text>
            </NavLinkStyled>
          </li>
        ))}
        </List>
      </Flex>
    </Nav>
  );
}

export default Navbar;
