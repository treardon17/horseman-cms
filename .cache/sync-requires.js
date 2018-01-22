// prefer default export if available
const preferDefault = m => m && m.default || m


exports.layouts = {

}

exports.components = {
  "component---cache-dev-404-page-js": preferDefault(require("/Applications/Developer/Projects/Lofty/CMSs/horseman-cms/.cache/dev-404-page.js")),
  "component---src-pages-assets-jsx": preferDefault(require("/Applications/Developer/Projects/Lofty/CMSs/horseman-cms/src/pages/Assets.jsx")),
  "component---src-pages-home-jsx": preferDefault(require("/Applications/Developer/Projects/Lofty/CMSs/horseman-cms/src/pages/Home.jsx")),
  "component---src-pages-modules-jsx": preferDefault(require("/Applications/Developer/Projects/Lofty/CMSs/horseman-cms/src/pages/Modules.jsx")),
  "component---src-pages-objects-jsx": preferDefault(require("/Applications/Developer/Projects/Lofty/CMSs/horseman-cms/src/pages/Objects.jsx")),
  "component---src-pages-page-jsx": preferDefault(require("/Applications/Developer/Projects/Lofty/CMSs/horseman-cms/src/pages/Page.jsx")),
  "component---src-pages-settings-jsx": preferDefault(require("/Applications/Developer/Projects/Lofty/CMSs/horseman-cms/src/pages/Settings.jsx")),
  "component---src-pages-users-jsx": preferDefault(require("/Applications/Developer/Projects/Lofty/CMSs/horseman-cms/src/pages/Users.jsx"))
}

exports.json = {
  "dev-404-page.json": require("/Applications/Developer/Projects/Lofty/CMSs/horseman-cms/.cache/json/dev-404-page.json"),
  "assets.json": require("/Applications/Developer/Projects/Lofty/CMSs/horseman-cms/.cache/json/assets.json"),
  "home.json": require("/Applications/Developer/Projects/Lofty/CMSs/horseman-cms/.cache/json/home.json"),
  "modules.json": require("/Applications/Developer/Projects/Lofty/CMSs/horseman-cms/.cache/json/modules.json"),
  "objects.json": require("/Applications/Developer/Projects/Lofty/CMSs/horseman-cms/.cache/json/objects.json"),
  "page.json": require("/Applications/Developer/Projects/Lofty/CMSs/horseman-cms/.cache/json/page.json"),
  "settings.json": require("/Applications/Developer/Projects/Lofty/CMSs/horseman-cms/.cache/json/settings.json"),
  "users.json": require("/Applications/Developer/Projects/Lofty/CMSs/horseman-cms/.cache/json/users.json")
}