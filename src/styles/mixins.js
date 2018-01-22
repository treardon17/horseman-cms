import { css } from 'styled-components'

// sizes for media query mixin
const sizes = {
  desktop: 992,
  tablet: 768,
  phone: 376
}

// Iterate through the sizes and create a media template
const media = Object.keys(sizes).reduce((acc, label) => {
  acc[label] = (...args) => css`
    @media (max-width: ${sizes[label] / 16}em) {
      ${css(...args)}
    }
  `
  return acc
}, {})

const image = {
  containImage: `
    background-position: center center;
    background-repeat: no-repeat;
    background-size: contain;
  `,
  coverImage: `
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
  `
}

export default {
  media
}
