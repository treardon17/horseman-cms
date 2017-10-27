import React from 'react';
import PropTypes from 'prop-types';
import Page from './Page.jsx';
import AppState from '../state/AppState.jsx';
// import modules here

export default class Users extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Page id="Users" title="Users">
        <div className="test" />
        <div className="test" />
        <div className="test" />
        <div className="test" />
        <div className="test" />
        <div className="test" />
        <div className="test" />
        <div className="test" />
        <div className="test" />
        <div className="test" />
        <div className="test" />
        <div className="test" />
        <div className="test" />
        <div className="test" />
        <div className="test" />
        <div className="test" />
        <div className="test" />
      </Page>
    );
  }
}

Users.propTypes = {
  state: PropTypes.instanceOf(AppState),
};
