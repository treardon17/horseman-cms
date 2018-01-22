import styled from 'styled-components'
import variables from './variables'

export default `
  // MaterialUI buttons
  button[class^='MuiButtonBase'], div[class*='MuiButtonBase']{
    background-color: ${variables.color.shade2};
    color: ${variables.color.white};

    &:hover{
      background-color: ${variables.color.white};
    }
  }

  .square-button{
    margin: ${variables.spacing.small} ${variables.spacing.small / 2};
  }

  .inactive-button{
    opacity: 0.4;
    pointer-events: none;
  }
`
