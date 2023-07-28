import { createElement, forwardRef } from 'react'
import { styled } from './factory.js';
import { getCircleStyle } from '../patterns/circle.js';

export const Circle = forwardRef(function Circle(props, ref) {
  const { size, ...restProps } = props
const styleProps = getCircleStyle({size})
return createElement(styled.div, { ref, ...styleProps, ...restProps })
})    