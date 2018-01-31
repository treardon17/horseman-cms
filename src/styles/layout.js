import styled from 'styled-components'
import variables from './variables'

export default `
html, body{
  margin: 0;
  padding: 0;
  background-color: ${variables.color.white};
}

body {
  font-family: 'Lato';
  text-align: center;
}

*{
  box-sizing: border-box;
}

.test{
  background-color: black;
  margin: ${variables.spacing.large};
  height: ${variables.spacing.medium};

  &:first-of-type{
    margin-top: 0;
  }
}

// #___gatsby{
//   min-height: 100vh;
// }

.page-wrapper{
  min-height: 100vh;
  position: relative;
  display: flex;

  .page-container{
    flex: auto;
    position: relative;

    .page-body{
      width: 100%;
    }
  }
}
`
