const color = {
  white: '#ffffff',
  gray90: '#e5e5e5',
  gray80: '#cccccc',
  gray70: '#b2b2b2',
  gray60: '#999999',
  gray50: '#7f7f7f',
  gray40: '#666666',
  gray30: '#4c4c4c',
  gray20: '#333333',
  gray10: '#191919',
  black: '#000000',
  brandPrimary: '#000000',
  base: '#122235',
  shade1: '#44637F',
  shade2: '#A4BAD1',
  shade3: '#DBE4ED',
  shade4: '#FEFFFF'
}

const spacing = {
  small: '10px',
  medium: '20px',
  large: '40px',
  extraLarge: '60px',
  closedMenuIconSize: '45px',
  headerHeight: '70px'
}

const zIndex = {
  bottom: -1,
  lower: 100,
  middle: 200,
  upper: 300,
  top: 400
}

const border = {
  radius: '4px',
  style: `2px solid ${color.base}`
}

const transition = {
  slow: '0.33s'
}

const boxShadow = {
  regular: '1px 1px 45px rgba($base, 0.7)'
}

export default {
  color,
  spacing,
  zIndex,
  border,
  transition,
  boxShadow
}
