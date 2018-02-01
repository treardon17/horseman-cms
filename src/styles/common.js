import styled, { injectGlobal } from 'styled-components'
import { Button } from './buttons'
import fonts from './fonts'
import inputs from './inputs'
import layout from './layout'
import reactSelect from './plugins/reactSelect'

/* eslint-disable */
injectGlobal`
  ${inputs}
  ${layout}
`
/* eslint-enable */

const MainHeader = styled.div`
  font-size: 20px;
  font-family: Montserrat;
`

export default {
  MainHeader,
  Button
}
