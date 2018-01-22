// get port
const port = parseInt(process.env.PORT);

module.exports = {
  siteMetadata: {
    title: `Gatsby Default Starter`,
  },
  proxy: {
    prefix: '/api',
    url: `http://127.0.0.1:${port + 30}`
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/src/data/`
      }
    },
    `gatsby-plugin-react-helmet`,
    `gatsby-transformer-json`,
    `gatsby-plugin-styled-components`,
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [`Montserrat`, `Raleway`]
      }
    }
  ],
}
