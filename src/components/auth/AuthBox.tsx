import styled from 'styled-components';

type AuthBoxProps = {
  $width?: string;
  $minHeight?: string;
  $radius?: string;
  $padding?: string;
};

const AuthBox = styled.div<AuthBoxProps>`
  position: relative;
  width: ${({ $width }) => $width ?? 'min(660px, 100%)'};
  min-height: ${({ $minHeight }) => $minHeight ?? 'min(760px, calc(100vh - 24px))'};
  border-radius: ${({ $radius }) => $radius ?? '60px'};
  background: #ffffff;
  box-shadow: 0 0 29.5px 2px rgba(0, 0, 0, 0.08);
  padding: ${({ $padding }) => $padding ?? '74px 46px 62px'};
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`;

export default AuthBox;
