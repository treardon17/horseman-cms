import styled from 'styled-components'
import variables from './variables'

const inputHeight = '34px'

export default `
.input-field{
  height: ${inputHeight};
  display: flex;
  align-items: center;
  outline: none;
}

.Select{
  height: ${inputHeight};
}

input[type=text]{
  padding: ${variables.spacing.small};
}
`
