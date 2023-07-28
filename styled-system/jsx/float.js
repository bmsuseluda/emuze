import { createElement, forwardRef } from 'react'
import { styled } from './factory.js';
import { getFloatStyle } from '../patterns/float.js';

export const Float = forwardRef(function Float(props, ref) {
  const { offsetX, offsetY, offset, placement, ...restProps } = props
const styleProps = getFloatStyle({offsetX, offsetY, offset, placement})
return createElement(styled.div, { ref, ...styleProps, ...restProps })
})    