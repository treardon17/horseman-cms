import styled from 'styled-components'
import variables from './variables'

export default `
// @import url('https://fonts.googleapis.com/css?family=Karla|Lato:300,700');

html {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, p {
  color: ${variables.color.base};
}

h1 {
  font-family: "Lato", sans-serif;
  font-size: 28px;
  font-weight: 900;
  line-height: 1.20;
  opacity: 1.00;
  margin-top: 0px;
  margin-bottom: 10px;
  letter-spacing: -0.72px;
  word-spacing: 0.00px;
  text-transform: none;
}

h2 {
  font-family: "Lato", sans-serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.20;
  opacity: 1.00;
  margin-top: 30px;
  margin-bottom: 5px;
  letter-spacing: -0.72px;
  word-spacing: 0.00px;
  text-transform: none;
}

h3 {
  font-family: "Lato", sans-serif;
  font-size: 20px;
  font-weight: 400;
  line-height: 1.20;
  opacity: 1.00;
  margin-top: 30px;
  margin-bottom: 5px;
  letter-spacing: 0.00px;
  word-spacing: 0.00px;
  text-transform: none;
}

p {
  font-family: "Karla", sans-serif;
  font-size: 18px;
  font-weight: 400;
  line-height: 1.60;
  opacity: 1;
  margin-top: 10px;
  margin-bottom: 10px;
  letter-spacing: -0.30px;
  word-spacing: -0.10px;
  text-transform: none;
}

.sub-text {
  font-weight: bold;
  font-size: 12px;
  margin: 0;
}
`