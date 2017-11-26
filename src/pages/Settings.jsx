import React from 'react';
import PropTypes from 'prop-types';
import Page from './Page.jsx';
import AppState from '../state/AppState.jsx';
// import modules here

export default class Settings extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Page id="Settings" title="Settings">
        <div />
      </Page>
    );
  }
}

Settings.propTypes = {
  state: PropTypes.instanceOf(AppState),
};
