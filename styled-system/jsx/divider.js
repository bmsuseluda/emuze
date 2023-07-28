import { createElement, forwardRef } from 'react'
import { styled } from './factory.js';
import { getDividerStyle } from '../patterns/divider.js';

export const Divider = forwardRef(function Divider(props, ref) {
  const { orientation, thickness, color, ...restProps } = props
const styleProps = getDividerStyle({orientation, thickness, color})
return createElement(styled.div, { ref, ...styleProps, ...restProps })
})    