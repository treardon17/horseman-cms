import React from 'react';
import PropTypes from 'prop-types';
import AppState from '../state/AppState.jsx';
import Page from './Page.jsx';
// import modules here
import TitleSection from '../modules/TitleSection/TitleSection.jsx';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Page id="Home" title="Home">
        <div />
      </Page>
    );
  }
}

Home.propTypes = {
  state: PropTypes.instanceOf(AppState),
};
