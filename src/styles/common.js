import styled, { injectGlobal } from 'styled-components'
import buttons from './buttons'
import fonts from './fonts'
import inputs from './inputs'
import layout from './layout'

/* eslint-disable */
injectGlobal`
  ${fonts}
  ${buttons}
  ${inputs}
  ${layout}
`
/* eslint-enable */

const MainHeader = styled.div`
  font-size: 20px;
  font-family: Montserrat;
`

export default {
  MainHeader
}
