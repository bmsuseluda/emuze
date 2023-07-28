import { createElement, forwardRef } from 'react'
import { styled } from './factory.js';
import { getLinkOverlayStyle } from '../patterns/link-overlay.js';

export const LinkOverlay = forwardRef(function LinkOverlay(props, ref) {
  const styleProps = getLinkOverlayStyle()
return createElement(styled.a, { ref, ...styleProps, ...props })
})    