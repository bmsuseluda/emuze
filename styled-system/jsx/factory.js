import { createElement, forwardRef, useMemo } from 'react'
import { css, cx, cva, assignCss } from '../css/index.js';
import { splitProps, normalizeHTMLProps } from '../helpers.js';
import { isCssProperty } from './is-valid-prop.js';

function styledFn(Dynamic, configOrCva = {}) {
  const cvaFn = configOrCva.__cva__ || configOrCva.__recipe__ ? configOrCva : cva(configOrCva)
  
  const StyledComponent = forwardRef(function StyledComponent(props, ref) {
    const { as: Element = Dynamic, ...restProps } = props

    const [variantProps, styleProps, htmlProps, elementProps] = useMemo(() => {
      return splitProps(restProps, cvaFn.variantKeys, isCssProperty, normalizeHTMLProps.keys)
    }, [restProps])

    function recipeClass() {
      const { css: cssStyles, ...propStyles } = styleProps
      const styles = assignCss(propStyles, cssStyles)
      return cx(cvaFn(variantProps), css(styles), elementProps.className)
    }
    
    function cvaClass() {
      const { css: cssStyles, ...propStyles } = styleProps
      const cvaStyles = cvaFn.resolve(variantProps)
      const styles = assignCss(cvaStyles, propStyles, cssStyles)
      return cx(css(styles), elementProps.className)
    }

    const classes = configOrCva.__recipe__ ? recipeClass : cvaClass

    return createElement(Element, {
      ref,
      ...elementProps,
      ...normalizeHTMLProps(htmlProps),
      className: classes(),
    })
  })
  
  StyledComponent.displayName = `styled.${Dynamic}`
  return StyledComponent
}

function createJsxFactory() {
  const cache = new Map()

  return new Proxy(styledFn, {
    apply(_, __, args) {
      return styledFn(...args)
    },
    get(_, el) {
      if (!cache.has(el)) {
        cache.set(el, styledFn(el))
      }
      return cache.get(el)
    },
  })
}

export const styled = createJsxFactory()
