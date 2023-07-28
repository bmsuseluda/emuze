import { createElement, forwardRef } from 'react'
import { styled } from './factory.js';
import { getCenterStyle } from '../patterns/center.js';

export const Center = forwardRef(function Center(props, ref) {
  const { inline, ...restProps } = props
const styleProps = getCenterStyle({inline})
return createElement(styled.div, { ref, ...styleProps, ...restProps })
})    