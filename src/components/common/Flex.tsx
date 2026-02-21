import styled from 'styled-components';

type Align = 'stretch' | 'flex-start' | 'center' | 'flex-end' | 'baseline';
type Justify =
  | 'flex-start'
  | 'center'
  | 'flex-end'
  | 'space-between'
  | 'space-around'
  | 'space-evenly';

export type FlexProps = {
  row?: boolean;
  column?: boolean;
  wrap?: boolean;
  gap?: number;

  center?: boolean;
  verticalCenter?: boolean;
  horizontalCenter?: boolean;

  align?: Align;
  justify?: Justify;

  flex?: number | string;
  width?: number | string;
  maxWidth?: number | string;
  height?: number | string;
  padding?: string;
  margin?: string;
};

function toCssSize(v?: number | string) {
  if (v === undefined) return undefined;
  return typeof v === 'number' ? `${v}px` : v;
}

const Flex = styled.div<FlexProps>`
  display: flex;

  flex-direction: ${({ row, column }) => {
    if (row) return 'row';
    if (column) return 'column';
    return 'row';
  }};
  flex-wrap: ${({ wrap }) => (wrap ? 'wrap' : 'nowrap')};
  gap: ${({ gap }) => (gap === undefined ? undefined : `${gap}px`)};

  align-items: ${({ center, verticalCenter, align }) => {
    if (center || verticalCenter) return 'center';
    return align ?? 'stretch';
  }};
  justify-content: ${({ center, horizontalCenter, justify }) => {
    if (center || horizontalCenter) return 'center';
    return justify ?? 'flex-start';
  }};

  flex: ${({ flex }) => (flex === undefined ? undefined : flex)};
  width: ${({ width }) => toCssSize(width)};
  max-width: ${({ maxWidth }) => toCssSize(maxWidth)};
  height: ${({ height }) => toCssSize(height)};
  padding: ${({ padding }) => padding};
  margin: ${({ margin }) => margin};
  box-sizing: border-box;
`;

export default Flex;
