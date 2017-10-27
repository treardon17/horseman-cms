import React from 'react';
import PropTypes from 'prop-types';
import Page from './Page.jsx';
import AppState from '../state/AppState.jsx';
// import modules here

export default class Assets extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Page id="Assets" title="Assets">
        <div />
      </Page>
    );
  }
}

Assets.propTypes = {
  state: PropTypes.instanceOf(AppState),
};
