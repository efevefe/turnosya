import React, { Component } from 'react';
import { Dimensions } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { connect } from 'react-redux';
import { refinementUpdate } from '../actions';
import { MAIN_COLOR } from '../constants';

const searchBarWidth = Math.round(Dimensions.get('window').width) - 105;

class SearchBox extends Component {
  render() {
    return (
      <SearchBar
        platform="android"
        placeholder="Buscar negocios..."
        placeholderTextColor="white"
        onChangeText={text => this.props.refinementUpdate(text)}
        onClear={this.resetSearch}
        value={this.props.refinement}
        containerStyle={{
          alignSelf: 'stretch',
          height: 50,
          width: searchBarWidth,
          backgroundColor: MAIN_COLOR,
          paddingTop: 4
        }}
        searchIcon={{ color: 'white', size: 28 }}
        cancelIcon={{ color: 'white' }}
        clearIcon={{ color: 'white' }}
        selectionColor="white"
        inputStyle={{ marginLeft: 10, fontSize: 18, color: 'white' }}
        leftIconContainerStyle={{ paddingLeft: 0, marginLeft: 0 }}
      />
    );
  }
}

const mapStateToProps = state => {
  const { refinement } = state.commercesList;
  return { refinement };
};

export default connect(
  mapStateToProps,
  { refinementUpdate }
)(SearchBox);
