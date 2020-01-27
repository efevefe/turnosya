import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { onCommercesListValueChange } from '../../actions';

import { connectStateResults } from 'react-instantsearch/connectors';

class StateResults extends Component {
  componentDidUpdate = () => {
    this.props.onCommercesListValueChange({
      searching: this.props.isSearchStalled
    });
  };

  render = () => <View></View>;
}

const ConnectedStateResults = connectStateResults(StateResults);

export default connect(null, { onCommercesListValueChange })(ConnectedStateResults);
