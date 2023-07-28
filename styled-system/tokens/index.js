const tokens = {
  "spacing.1": {
    "value": "0.8rem",
    "variable": "var(--spacing-1)"
  },
  "spacing.2": {
    "value": "2rem",
    "variable": "var(--spacing-2)"
  },
  "spacing.3": {
    "value": "3rem",
    "variable": "var(--spacing-3)"
  },
  "spacing.4": {
    "value": "5rem",
    "variable": "var(--spacing-4)"
  },
  "sizes.1": {
    "value": "1rem",
    "variable": "var(--sizes-1)"
  },
  "sizes.2": {
    "value": "2rem",
    "variable": "var(--sizes-2)"
  },
  "sizes.3": {
    "value": "3rem",
    "variable": "var(--sizes-3)"
  },
  "sizes.4": {
    "value": "4rem",
    "variable": "var(--sizes-4)"
  },
  "sizes.5": {
    "value": "5rem",
    "variable": "var(--sizes-5)"
  },
  "sizes.breakpoint-sm": {
    "value": "640px",
    "variable": "var(--sizes-breakpoint-sm)"
  },
  "sizes.breakpoint-md": {
    "value": "768px",
    "variable": "var(--sizes-breakpoint-md)"
  },
  "sizes.breakpoint-lg": {
    "value": "1024px",
    "variable": "var(--sizes-breakpoint-lg)"
  },
  "sizes.breakpoint-xl": {
    "value": "1280px",
    "variable": "var(--sizes-breakpoint-xl)"
  },
  "sizes.breakpoint-2xl": {
    "value": "1536px",
    "variable": "var(--sizes-breakpoint-2xl)"
  },
  "borders.2": {
    "value": "2px solid black",
    "variable": "var(--borders-2)"
  },
  "borders.3": {
    "value": "4px solid black",
    "variable": "var(--borders-3)"
  },
  "radii.1": {
    "value": "0.8rem",
    "variable": "var(--radii-1)"
  },
  "fonts.quicksandLight": {
    "value": "var(--font-quicksand-light)",
    "variable": "var(--fonts-quicksand-light)"
  },
  "breakpoints.sm": {
    "value": "640px",
    "variable": "var(--breakpoints-sm)"
  },
  "breakpoints.md": {
    "value": "768px",
    "variable": "var(--breakpoints-md)"
  },
  "breakpoints.lg": {
    "value": "1024px",
    "variable": "var(--breakpoints-lg)"
  },
  "breakpoints.xl": {
    "value": "1280px",
    "variable": "var(--breakpoints-xl)"
  },
  "breakpoints.2xl": {
    "value": "1536px",
    "variable": "var(--breakpoints-2xl)"
  },
  "colors.color": {
    "value": "var(--colors-color)",
    "variable": "var(--colors-color)"
  },
  "colors.backgroundColor": {
    "value": "var(--colors-background-color)",
    "variable": "var(--colors-background-color)"
  },
  "colors.transparentBackgroundColor": {
    "value": "var(--colors-transparent-background-color)",
    "variable": "var(--colors-transparent-background-color)"
  },
  "colors.sidebarBackgroundColor": {
    "value": "var(--colors-sidebar-background-color)",
    "variable": "var(--colors-sidebar-background-color)"
  },
  "colors.accent": {
    "value": "var(--colors-accent)",
    "variable": "var(--colors-accent)"
  },
  "colors.colorOnAccent": {
    "value": "var(--colors-color-on-accent)",
    "variable": "var(--colors-color-on-accent)"
  },
  "colors.error": {
    "value": "var(--colors-error)",
    "variable": "var(--colors-error)"
  },
  "gradients.default": {
    "value": "var(--gradients-default)",
    "variable": "var(--gradients-default)"
  },
  "spacing.-1": {
    "value": "calc(var(--spacing-1) * -1)",
    "variable": "var(--spacing-1)"
  },
  "spacing.-2": {
    "value": "calc(var(--spacing-2) * -1)",
    "variable": "var(--spacing-2)"
  },
  "spacing.-3": {
    "value": "calc(var(--spacing-3) * -1)",
    "variable": "var(--spacing-3)"
  },
  "spacing.-4": {
    "value": "calc(var(--spacing-4) * -1)",
    "variable": "var(--spacing-4)"
  }
}

export function token(path, fallback) {
  return tokens[path]?.value || fallback
}

function tokenVar(path, fallback) {
  return tokens[path]?.variable || fallback
}

token.var = tokenVar