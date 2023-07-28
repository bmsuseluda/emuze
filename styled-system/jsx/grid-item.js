import { createElement, forwardRef } from 'react'
import { styled } from './factory.js';
import { getGridItemStyle } from '../patterns/grid-item.js';

export const GridItem = forwardRef(function GridItem(props, ref) {
  const { colSpan, rowSpan, colStart, rowStart, colEnd, rowEnd, ...restProps } = props
const styleProps = getGridItemStyle({colSpan, rowSpan, colStart, rowStart, colEnd, rowEnd})
return createElement(styled.div, { ref, ...styleProps, ...restProps })
})    