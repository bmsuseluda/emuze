import { createElement, forwardRef } from 'react'
import { styled } from './factory.js';
import { getAspectRatioStyle } from '../patterns/aspect-ratio.js';

export const AspectRatio = forwardRef(function AspectRatio(props, ref) {
  const { ratio, ...restProps } = props
const styleProps = getAspectRatioStyle({ratio})
return createElement(styled.div, { ref, ...styleProps, ...restProps })
})    