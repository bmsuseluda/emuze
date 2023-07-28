/* eslint-disable */
export type Token = "spacing.1" | "spacing.2" | "spacing.3" | "spacing.4" | "sizes.1" | "sizes.2" | "sizes.3" | "sizes.4" | "sizes.5" | "sizes.breakpoint-sm" | "sizes.breakpoint-md" | "sizes.breakpoint-lg" | "sizes.breakpoint-xl" | "sizes.breakpoint-2xl" | "borders.2" | "borders.3" | "radii.1" | "fonts.quicksandLight" | "breakpoints.sm" | "breakpoints.md" | "breakpoints.lg" | "breakpoints.xl" | "breakpoints.2xl" | "colors.color" | "colors.backgroundColor" | "colors.transparentBackgroundColor" | "colors.sidebarBackgroundColor" | "colors.accent" | "colors.colorOnAccent" | "colors.error" | "gradients.default" | "spacing.-1" | "spacing.-2" | "spacing.-3" | "spacing.-4"

export type SpacingToken = "1" | "2" | "3" | "4" | "-1" | "-2" | "-3" | "-4"

export type SizeToken = "1" | "2" | "3" | "4" | "5" | "breakpoint-sm" | "breakpoint-md" | "breakpoint-lg" | "breakpoint-xl" | "breakpoint-2xl"

export type BorderToken = "2" | "3"

export type RadiusToken = "1"

export type FontToken = "quicksandLight"

export type BreakpointToken = "sm" | "md" | "lg" | "xl" | "2xl"

export type ColorToken = "color" | "backgroundColor" | "transparentBackgroundColor" | "sidebarBackgroundColor" | "accent" | "colorOnAccent" | "error"

export type GradientToken = "default"

export type Tokens = {
		spacing: SpacingToken
		sizes: SizeToken
		borders: BorderToken
		radii: RadiusToken
		fonts: FontToken
		breakpoints: BreakpointToken
		colors: ColorToken
		gradients: GradientToken
} & { [token: string]: never }

export type TokenCategory = "zIndex" | "opacity" | "colors" | "fonts" | "fontSizes" | "fontWeights" | "lineHeights" | "letterSpacings" | "sizes" | "shadows" | "spacing" | "radii" | "borders" | "durations" | "easings" | "animations" | "blurs" | "gradients" | "breakpoints" | "assets"