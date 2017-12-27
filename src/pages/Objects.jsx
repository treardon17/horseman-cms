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
    setTimeout(() => {
      const type = TypeState.userMadeTypes.get('d42b09f9-5e8c3695-9f24b6eb');
      console.log('type is', type);
      const instance = type.createObjectInstance();
      console.log('instance is: ', instance);
      const child = <CreateObject key="1" childObject={instance} />;
      this.setState({
        children: [child],
      });
    }, 5000);
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
