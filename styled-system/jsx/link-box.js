import { createElement, forwardRef } from 'react'
import { styled } from './factory.js';
import { getLinkBoxStyle } from '../patterns/link-box.js';

export const LinkBox = forwardRef(function LinkBox(props, ref) {
  const styleProps = getLinkBoxStyle()
return createElement(styled.div, { ref, ...styleProps, ...props })
})    