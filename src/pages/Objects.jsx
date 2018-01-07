import React from 'react';
import PropTypes from 'prop-types';
import AppState from '../state/AppState.jsx';
import TypeState from '../state/TypeState.js';
import DataState from '../state/DataState.js';
import EmptyPage from '../modules/EmptyPage/EmptyPage.jsx';
import Page from './Page.jsx';
// import modules here
import CreateObject from '../modules/CreateObject/CreateObject';

export default class Objects extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      children: null,
    };

    this.setupChildren();
  }

  setupChildren() {
    DataState.getData('c90e3392-bc664dfc-45d6f25d').then((instance) => {
      // console.log('instance', instance);
      const child = <CreateObject key="1" childObject={instance} />;
      this.setState({
        children: [child],
      });
    });
  }

  render() {
    // let child = null;
    // if (moduleTypes.length > 0) {
    //   child = moduleTypes;
    // } else {
    //   child = (<EmptyPage title="No Module Types" message="Press the + button in the bottom right to add a module" />);
    // }

    return (
      <Page id="Objects" title="Objects">
        {this.state.children}
      </Page>
    );
  }
}

Objects.propTypes = {
  state: PropTypes.instanceOf(AppState),
};
