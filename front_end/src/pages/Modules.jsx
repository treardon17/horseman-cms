import React from 'react';
import PropTypes from 'prop-types';
import Page from './Page.jsx';
import AppState from '../state/AppState.jsx';
// import modules here

export default class Modules extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Page id="Modules" title="Modules">
        <div />
      </Page>
    );
  }
}

Modules.propTypes = {
  state: PropTypes.instanceOf(AppState),
};
