module.exports = {
    "extends": "airbnb",
    "parser": "babel-eslint",
    "plugins": [
      "react",
      "jsx-a11y",
      "import"
    ],
    "rules": {
      "semi": [2, "never"],
      "react/jsx-filename-extension": 0,
      "react/prop-types": 0,
      "react/require-default-props": 0,
      "no-undef": 0,
      "no-unused-vars": 0,
      "jsx-a11y/anchor-is-valid": 0,
      "comma-dangle": 0,
      "no-console": 0,
      "no-underscore-dangle": 0,
      "class-methods-use-this": 0,
      "brace-style": 0,
      "prefer-promise-reject-errors": 0,
      "allowTemplateLiterals": true
    },
    "env": {
      "browser": true,
      "node": true
    }
};
