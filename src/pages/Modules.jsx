import { observer } from "mobx-react";
import React from 'react';
import PropTypes from 'prop-types';
import Page from './Page.jsx';
import AppState from '../state/AppState.jsx';
import TypeState from '../state/TypeState.js';
import ObjectType from '../../core/definitions/objectType';
// import modules here
import ConstructType from '../modules/ConstructType/ConstructType';
import EmptyPage from '../modules/EmptyPage/EmptyPage.jsx';

@observer export default class Modules extends React.Component {
  constructor(props) {
    super(props);

    // TypeState.addOrUpdateType({ name: 'hero module' }).then((addedType) => {
    //   addedType.add({ name: 'title-section', type: { primary: ObjectType.types.string } });
    //   TypeState.addOrUpdateType(addedType);
    // });
  }

  // getModuleTypes() {
  //   const moduleTypes = [];
  //   const types = TypeState.orderedUserMadeTypeList;
  //   for (let i = 0; i < types.length; i++) {
  //     const type = types[i].data;
  //     moduleTypes.push(
  //       <ConstructType key={`construct-type-${type.id}`} type={type} />
  //     );
  //   }
  //   return moduleTypes;
  // }
  //
  // render() {
  //   const moduleTypes = this.getModuleTypes();
  //   let child = null;
  //   if (moduleTypes.length > 0) {
  //     child = moduleTypes;
  //   } else {
  //     child = (<EmptyPage title="No Modules" message="Press the + button in the bottom right to add a module" />);
  //   }
  //   return (
  //     <Page id="Modules" title="Modules">
  //       {child}
  //     </Page>
  //   );
  // }

  render() {
    return (
      <div className="modules" />
    );
  }
}

Modules.propTypes = {
  state: PropTypes.instanceOf(AppState),
};
