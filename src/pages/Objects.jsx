import React from 'react';
import PropTypes from 'prop-types';
import AppState from '../state/AppState.jsx';
import Page from './Page.jsx';
// import modules here

export default class Objects extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Page id="Objects" title="Objects">
        <div />
      </Page>
    );
  }
}

Objects.propTypes = {
  state: PropTypes.instanceOf(AppState),
};
