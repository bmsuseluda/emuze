import { createElement, forwardRef } from 'react'
import { styled } from './factory.js';
import { getVstackStyle } from '../patterns/vstack.js';

export const VStack = forwardRef(function VStack(props, ref) {
  const { justify, gap, ...restProps } = props
const styleProps = getVstackStyle({justify, gap})
return createElement(styled.div, { ref, ...styleProps, ...restProps })
})    