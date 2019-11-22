import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { commerceSearching } from '../../actions';

import { connectStateResults } from 'react-instantsearch/connectors';

class StateResults extends Component {
  componentDidUpdate = () => {
    this.props.commerceSearching(this.props.isSearchStalled);
  };

  render = () => <View></View>;
}

const ConnectedStateResults = connectStateResults(StateResults);

export default connect(
  null,
  { commerceSearching }
)(ConnectedStateResults);
