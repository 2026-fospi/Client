import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import Flex from '../common/Flex';

const navItems = [
  { to: '/exchange', label: '거래소' },
  { to: '/holdings', label: '보유 자산' },
  { to: '/events', label: '이벤트' },
] as const;

const Nav = styled(Flex)`
  position: sticky;
  top: 0;
  z-index: 10;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  height: 84px;
`;

const Inner = styled.div`
  position: relative;
  width: min(1735px, 100%);
  height: 100%;
  margin: 0 auto;
  padding: 0 40px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
`;

const Logo = styled.span`
  font-family: 'Hakgyoansim Allimjang OTF', 'Pretendard', sans-serif;
  font-size: 26px;
  color: #1783ff;
  line-height: 1;
  font-weight: 700;
`;

const List = styled(Flex).attrs<{ $itemCount: number }>({
  row: true,
  gap: 71,
  verticalCenter: true,
})`
  list-style: none;
  margin: 0;
  padding: 0;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);

  @media (max-width: 900px) {
    gap: 28px;
  }
`;

const NavLinkStyled = styled(NavLink)`
  color: #757575;
  text-decoration: none;
  font-family: 'Pretendard', sans-serif;
  font-size: 22px;
  font-weight: 400;
  line-height: 1;
  transition: color 0.2s;

  &:hover {
    color: #333333;
  }

  &.active {
    color: #000000;
    font-weight: 500;
  }

  @media (max-width: 900px) {
    font-size: 17px;
  }
`;

function Navbar() {
  return (
    <Nav>
      <Inner>
        <Logo>FOSPI</Logo>
        <List as="ul" $itemCount={navItems.length}>
          {navItems.map(({ to, label }) => (
            <li key={to}>
              <NavLinkStyled
                to={to}
                className={({ isActive }) => (isActive ? 'active' : '')}
                end={to === '/exchange'}
              >
                {label}
              </NavLinkStyled>
            </li>
          ))}
        </List>
      </Inner>
    </Nav>
  );
}

export default Navbar;
