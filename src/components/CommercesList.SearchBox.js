import React, { Component } from 'react';
import { View } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { connect } from 'react-redux';
import { Constants } from 'expo';
import { refinementUpdate } from '../actions';
import { MAIN_COLOR, NAVIGATION_HEIGHT } from '../constants';

class SearchBox extends Component {
  render() {
    return (
      <View
        style={{
          height: NAVIGATION_HEIGHT + Constants.statusBarHeight,
          alignSelf: 'stretch',
          justifyContent: 'flex-end',
          backgroundColor: MAIN_COLOR,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1
          },
          shadowOpacity: 0.2,
          shadowRadius: 1.41,
          elevation: 2
        }}
      >
        <SearchBar
          //ref={search => (this.searchbar = search)}
          platform="android"
          placeholder="Buscar negocios..."
          onChangeText={text => this.props.refinementUpdate(text)}
          //onClear={this.resetSearch}
          //onCancel={this.onCancelPress}
          value={this.props.refinement}
          containerStyle={{
            alignSelf: 'stretch',
            height: NAVIGATION_HEIGHT,
            paddingTop: 4,
            paddingRight: 5,
            paddingLeft: 5,
            marginTop: Constants.statusBarHeight
          }}
          searchIcon={{ color: MAIN_COLOR, size: 28, marginLeft: 15 }}
          cancelIcon={{ color: MAIN_COLOR }}
          clearIcon={{ color: MAIN_COLOR }}
          selectionColor={MAIN_COLOR}
          //showLoading={this.props.searching}
          loadingProps={{ color: MAIN_COLOR }}
        />
      </View>
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
