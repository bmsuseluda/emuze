/* eslint-disable */
import type { FunctionComponent } from 'react'
import type { VstackProperties } from '../patterns/vstack'
import type { HTMLStyledProps } from '../types/jsx'

export type VstackProps = VstackProperties & Omit<HTMLStyledProps<'div'>, keyof VstackProperties >


export declare const VStack: FunctionComponent<VstackProps>