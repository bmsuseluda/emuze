import { createElement, forwardRef } from 'react'
import { styled } from './factory.js';
import { getSquareStyle } from '../patterns/square.js';

export const Square = forwardRef(function Square(props, ref) {
  const { size, ...restProps } = props
const styleProps = getSquareStyle({size})
return createElement(styled.div, { ref, ...styleProps, ...restProps })
})    