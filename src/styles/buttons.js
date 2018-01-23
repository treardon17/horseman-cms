import styled from 'styled-components'
import variables from './variables'

export const Button = styled.button`
  cursor: pointer;
  background-color: ${variables.color.shade2};
  color: ${variables.color.white};
  padding: ${variables.spacing.small} ${variables.spacing.medium};
  outline: none;

  &:hover{
    background-color: ${variables.color.shade1};
  }

  &.square-button{
    margin: ${variables.spacing.small} ${variables.spacing.small / 2};
  }

  &.inactive-button{
    opacity: 0.4;
    pointer-events: none;
  }
`
