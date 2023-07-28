import { createElement, forwardRef } from 'react'
import { styled } from './factory.js';
import { getSpacerStyle } from '../patterns/spacer.js';

export const Spacer = forwardRef(function Spacer(props, ref) {
  const { size, ...restProps } = props
const styleProps = getSpacerStyle({size})
return createElement(styled.div, { ref, ...styleProps, ...restProps })
})    