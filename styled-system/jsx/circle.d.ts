/* eslint-disable */
import type { FunctionComponent } from 'react'
import type { CircleProperties } from '../patterns/circle'
import type { HTMLStyledProps } from '../types/jsx'

export type CircleProps = CircleProperties & Omit<HTMLStyledProps<'div'>, keyof CircleProperties >


export declare const Circle: FunctionComponent<CircleProps>