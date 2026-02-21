import styled, {css} from "styled-components";

export interface FlexProps {
    inline?: boolean;
    row?: boolean;
    gap?: number | string;
    flexWrap?: boolean;
    spaceBetween?: boolean;
    spaceAround?: boolean;
    spaceEvenly?: boolean;
    verticalCenter?: boolean;
    verticalTop?: boolean;
    verticalBottom?: boolean;
    horizontalCenter?: boolean;
    center?: boolean;
    width?: number | string;
    height?: number | string;
    flex?: number;
    spaced?: boolean;
    flexStart?: boolean;
    flexEnd?: boolean;
    flexShrink?: number;
    reverse?: boolean;
}

const Flex = styled.div<FlexProps>`
    ${({inline}) => `display: ${inline ? 'inline-flex' : 'flex'};`};
    ${({row, reverse}) => `flex-direction: ${row ? 'row' : 'column'}${reverse ? "-reverse" : ""};`};
    ${({flexWrap}) => flexWrap ? `flex-wrap: wrap;` : ''}
    ${({gap}) => gap ? `gap: ${typeof gap === "string" ? gap : `${gap}px`};` : ''}
    ${({spaceBetween}) => spaceBetween ? `justify-content: space-between;` : ''}
    ${({spaceAround}) => spaceAround ? `justify-content: space-around;` : ''}
    ${({spaceEvenly}) => spaceEvenly ? `justify-content: space-evenly;` : ''}
    ${({row, verticalCenter, horizontalCenter, verticalTop, verticalBottom}) => {
        if (row) return (verticalCenter
                        ? `align-items: center;`
                        : verticalTop
                                ? 'align-items: flex-start;'
                                : verticalBottom
                                        ? 'align-items: flex-end;'
                                        : '')
                + (horizontalCenter ? `justify-content: center;` : '');
        return (horizontalCenter ? `align-items: center;` : '')
                + (verticalCenter
                        ? `justify-content: center;`
                        : verticalBottom
                                ? 'justify-content: flex-end;'
                                : '');
    }}
    ${({center}) => center ? `align-items: center; justify-content: center;` : ''}
    ${({flexStart, row}) => flexStart ? (row ? `justify-content: flex-start;` : `align-items: flex-start;`) : ''}
    ${({flexEnd, row}) => flexEnd ? (row ? `justify-content: flex-end;` : `align-items: flex-end;`) : ''}
    ${({width}) => width ? `width: ${cssSize(width)};` : ''}
    ${({height}) => height ? `height: ${cssSize(height)};` : ''}
    ${({flex}) => flex ? `flex: ${flex};` : ''}
    ${({flexShrink}) => flexShrink === undefined ? '' : `flex-shrink: ${flexShrink};`}
    ${({spaced}) => spaced ? css`
        > * {
            margin-right: 8px;

            &:last-child {
                margin-right: 0;
            }
        }` : ''}
`;

function cssSize(s: number | string) {
    if (typeof s === "number") return `${s}px`;
    return s;
}

export default Flex;