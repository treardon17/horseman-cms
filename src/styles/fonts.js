import { injectGlobal } from 'styled-components'
import variables from './variables'

const fontFormats = ['eot', 'otf', 'svg', 'ttf', 'woff']

const fonts = [
  {
    name: 'Karla',
    variations: ['Bold', 'Regular']
  },
  {
    name: 'Lato',
    variations: ['Bold', 'Regular']
  }
]

fonts.forEach((font) => {
  font.variations.forEach((variation) => {
    fontFormats.forEach((format) => {
      const fontName = `${font.name}-${variation}.${format}`
      console.log(fontName)
      injectGlobal`
        @font-face {
          font-family: ${font.name};
          font-style: ${font.style};
          font-weight: ${font.weight};
          src: ${src};
        }
      `
    })
  })
})
