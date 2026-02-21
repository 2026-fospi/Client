import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import Flex from '../../../components/common/Flex';
import Text from '../../../components/common/Text';

const navItems = [
  { to: '/', label: '거래소' },
  { to: '/holdings', label: '보유 자산' },
  { to: '/events', label: '이벤트' },
  { to: '/mypage', label: '마이페이지' },
] as const;

const Nav = styled(Flex)`
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  padding: 0.75rem 0;
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
  color: #757575;
  text-decoration: none;
  border-radius: 6px;
  transition: background-color 0.2s, color 0.2s;
    
  &:hover {
    color: #000000;
  }

  &.active {
    color: #000000;
    font-weight: 500;
  }
`;

function Navbar() {
  return (
    <Nav center>
      <List as="ul">
        {navItems.map(({ to, label }) => (
          <li key={to}>
            <NavLinkStyled
              to={to}
              className={({ isActive }) => (isActive ? 'active' : '')}
              end={to === '/'}
            >
              <Text>{label}</Text>
            </NavLinkStyled>
          </li>
        ))}
      </List>
    </Nav>
  );
}

export default Navbar;
