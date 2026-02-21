import styled from "styled-components";

const Text = styled.span<{
    fontSize?: number | string
    fontWeight?: number
    fontFamily?: string
    color?: string
    center?: boolean
    width?: number
    noWrap?: boolean
    breakSpaces?: boolean
    wordBreak?: string
    lineHeight?: number | string
    letterSpacing?: number
    lineThrough?: boolean
}>`
    font-family: ${({fontFamily}) => fontFamily ? fontFamily : 'inherit'};
    font-size: ${({fontSize}) => fontSize
            ? `${typeof fontSize == "string" ? fontSize : `${fontSize}px`}`
            : "inherit"};
    font-weight: ${({fontWeight}) => fontWeight ? fontWeight : "inherit"};
    color: ${({color}) => color ? color : "inherit"};
    text-align: ${({center}) => center ? 'center' : 'inherit'};
    width: ${({width}) => width ? `${width}px` : 'unset'};
    ${({noWrap}) => noWrap && 'white-space: nowrap;'}
    ${({breakSpaces}) => breakSpaces && 'white-space: break-spaces;'}
    ${({wordBreak}) => wordBreak && `word-break: ${wordBreak};`}
    line-height: ${({lineHeight}) => lineHeight ? `${lineHeight}` : 'inherit'};
    letter-spacing: ${({letterSpacing}) => letterSpacing ? `${letterSpacing}px` : 'inherit'};
    ${({lineThrough}) => lineThrough && `text-decoration: line-through;`}
`

export default Text;