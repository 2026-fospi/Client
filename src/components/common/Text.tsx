import styled from 'styled-components';

export type TextProps = {
  size?: number;
  weight?: number;
  color?: string;
  align?: 'left' | 'center' | 'right';
  nowrap?: boolean;
  block?: boolean;
};

const Text = styled.span<TextProps>`
  display: ${({ block }) => (block ? 'block' : 'inline')};
  font-size: ${({ size }) => (size === undefined ? undefined : `${size}px`)};
  font-weight: ${({ weight }) => (weight === undefined ? undefined : weight)};
  color: ${({ color }) => color ?? 'inherit'};
  text-align: ${({ align }) => align};
  white-space: ${({ nowrap }) => (nowrap ? 'nowrap' : 'normal')};
`;

export default Text;
