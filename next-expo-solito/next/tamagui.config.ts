import { createInterFont } from '@tamagui/font-inter'
import { color, radius, size, space, zIndex } from '@tamagui/theme-base'
import { createTamagui, createTokens, createTheme } from 'tamagui'

const inter = createInterFont()

const tokens = createTokens({
  size,
  space,
  zIndex,
  color,
  radius,
})

const lightTheme = createTheme({
  background: '#fff',
  backgroundHover: tokens.color.gray3,
  backgroundPress: tokens.color.gray4,
  backgroundFocus: tokens.color.gray5,
  borderColor: tokens.color.gray4,
  borderColorHover: tokens.color.gray6,
  color: tokens.color.gray12,
  colorHover: tokens.color.gray11,
  colorPress: tokens.color.gray10,
  colorFocus: tokens.color.gray6,
  shadowColor: tokens.color.grayA5,
  shadowColorHover: tokens.color.grayA6,
})

// note: we set up a consistent theme type to validate the rest:
type BaseTheme = typeof lightTheme

// the rest of the themes use BaseTheme
const dark: BaseTheme = {
  background: '#000',
  backgroundHover: tokens.color.gray2Dark,
  backgroundPress: tokens.color.gray3Dark,
  backgroundFocus: tokens.color.gray4Dark,
  borderColor: tokens.color.gray3Dark,
  borderColorHover: tokens.color.gray4Dark,
  color: '#ddd',
  colorHover: tokens.color.gray11Dark,
  colorPress: tokens.color.gray10Dark,
  colorFocus: tokens.color.gray6Dark,
  shadowColor: tokens.color.grayA6,
  shadowColorHover: tokens.color.grayA7,
}

// use `as const` at the end here to be sure its strictly typed
export const themes = {
  dark,
} as const

const config = createTamagui({
  themes,
  tokens,
  fonts: {
    heading: inter,
    body: inter,
  },
})

export type Conf = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default config
