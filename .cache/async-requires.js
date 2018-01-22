// prefer default export if available
const preferDefault = m => m && m.default || m

exports.components = {
  "component---cache-dev-404-page-js": require("gatsby-module-loader?name=component---cache-dev-404-page-js!/Applications/Developer/Projects/Lofty/CMSs/horseman-cms/.cache/dev-404-page.js"),
  "component---src-pages-index-jsx": require("gatsby-module-loader?name=component---src-pages-index-jsx!/Applications/Developer/Projects/Lofty/CMSs/horseman-cms/src/pages/index.jsx")
}

exports.json = {
  "dev-404-page.json": require("gatsby-module-loader?name=path---dev-404-page!/Applications/Developer/Projects/Lofty/CMSs/horseman-cms/.cache/json/dev-404-page.json"),
  "index.json": require("gatsby-module-loader?name=path---index!/Applications/Developer/Projects/Lofty/CMSs/horseman-cms/.cache/json/index.json")
}

exports.layouts = {

}