import { createElement, forwardRef } from 'react'
import { styled } from './factory.js';
import { getBoxStyle } from '../patterns/box.js';

export const Box = forwardRef(function Box(props, ref) {
  const styleProps = getBoxStyle()
return createElement(styled.div, { ref, ...styleProps, ...props })
})    