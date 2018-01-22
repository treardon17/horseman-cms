// prefer default export if available
const preferDefault = m => m && m.default || m


exports.layouts = {

}

exports.components = {
  "component---cache-dev-404-page-js": preferDefault(require("/Applications/Developer/Projects/Lofty/CMSs/horseman-cms/.cache/dev-404-page.js")),
  "component---src-pages-index-jsx": preferDefault(require("/Applications/Developer/Projects/Lofty/CMSs/horseman-cms/src/pages/index.jsx"))
}

exports.json = {
  "dev-404-page.json": require("/Applications/Developer/Projects/Lofty/CMSs/horseman-cms/.cache/json/dev-404-page.json"),
  "index.json": require("/Applications/Developer/Projects/Lofty/CMSs/horseman-cms/.cache/json/index.json")
}