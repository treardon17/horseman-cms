import React from 'react';
import PropTypes from 'prop-types';
import AppState from '../state/AppState.jsx';
// import modules here
import TitleSection from '../modules/TitleSection/TitleSection.jsx';

export default class Page extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div
        className="page"
        {...this.props}
      >
        {/* <TitleSection title={this.props.title} titleSecondary="Horseman" /> */}
        <div className="page-body">
          {this.props.children}
        </div>
      </div>
    );
  }
}

Page.propTypes = {
  state: PropTypes.instanceOf(AppState),
  children: PropTypes.instanceOf(Object),
  title: PropTypes.string
};
