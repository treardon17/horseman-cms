import { observer, toJS } from "mobx-react";
import React from 'react';
import PropTypes from 'prop-types';
import AppState from '../state/AppState.jsx';
import TypeState from '../state/TypeState.js';
import DataState from '../state/DataState.js';
import EmptyPage from '../modules/EmptyPage/EmptyPage.jsx';
import Page from './Page.jsx';
// import modules here
import CreateObject from '../modules/CreateObject/CreateObject';

@observer export default class Objects extends React.Component {
  getDataObjects() {
    const dataObjects = [];
    const userData = DataState.userDataObject;
    if (userData) {
      const instance = userData.data;
      if (instance) {
        const keys = Object.keys(instance);
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          const dataObject = <CreateObject key={`data-object-${i}`} childObject={instance[key]} />;
          dataObjects.push(dataObject);
        }
      }
    }
    return dataObjects;
  }

  render() {
    const dataObjects = this.getDataObjects();
    return (
      <Page id="Objects" title="Objects">
        {dataObjects}
      </Page>
    );
  }
}

Objects.propTypes = {
  state: PropTypes.instanceOf(AppState),
};
