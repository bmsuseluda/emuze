import { createElement, forwardRef } from 'react'
import { styled } from './factory.js';
import { getGridStyle } from '../patterns/grid.js';

export const Grid = forwardRef(function Grid(props, ref) {
  const { gap, columnGap, rowGap, columns, minChildWidth, ...restProps } = props
const styleProps = getGridStyle({gap, columnGap, rowGap, columns, minChildWidth})
return createElement(styled.div, { ref, ...styleProps, ...restProps })
})    