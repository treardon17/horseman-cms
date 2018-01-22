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

#___gatsby{
  min-height: 100vh;
  .app-wrapper{
    display: flex;
    width: 100%;
    height: 100%;

    .transition-container{
      position: relative;
      flex: auto;
      height: inherit;

      .page-transition{
        height: 100%;
        .route{ width: 100%; }
        .page-container{
          .page-wrapper{
            .page{
              .page-body{
                height: 100%;
                width: 100%;
                margin-top: ${variables.spacing.headerHeight};
              }
            }
          }
        }
      }
    }
  }
}
.page{
  .page-body{
    min-height: 100vh;
    position: relative;
  }
}
`
