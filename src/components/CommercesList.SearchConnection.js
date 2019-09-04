import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { connectSearchBox } from 'react-instantsearch/connectors';
import PropTypes from 'prop-types';

class SearchConnection extends Component {
  componentDidUpdate() {
    this.props.refine(this.props.refinement);
  }

  render() {
    return <View />;
  }
}

SearchConnection.propTypes = {
  refine: PropTypes.func.isRequired
};

const ConnectedSearch = connectSearchBox(SearchConnection);

const mapStateToProps = state => {
  const { refinement } = state.commercesList;
  return { refinement };
};

export default connect(
  mapStateToProps,
  null
)(ConnectedSearch);
