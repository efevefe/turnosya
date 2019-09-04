import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { connect } from 'react-redux';
import { Constants } from 'expo';
import { refinementUpdate } from '../actions';
import { MAIN_COLOR, NAVIGATION_HEIGHT } from '../constants';

class SearchBox extends Component {
  render() {
    return (
      <View
        style={styles.mainContainer}
      >
        <SearchBar
          {...this.props}
          platform="android"
          placeholder="Buscar negocios..."
          onChangeText={text => this.props.refinementUpdate(text)}
          onCancel={this.props.onCancel}
          value={this.props.refinement}
          containerStyle={styles.searchBarContainer}
          inputStyle={{ marginTop: 1 }}
          showLoading={this.props.loading}
          searchIcon={{ color: MAIN_COLOR }}
          cancelIcon={{ color: MAIN_COLOR }}
          clearIcon={{ color: MAIN_COLOR }}
          loadingProps={{ color: MAIN_COLOR }}
          selectionColor={MAIN_COLOR}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
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
  },
  searchBarContainer: {
    alignSelf: 'stretch',
    height: NAVIGATION_HEIGHT,
    paddingTop: 4,
    paddingRight: 5,
    paddingLeft: 5,
    marginTop: Constants.statusBarHeight
  }
});

const mapStateToProps = state => {
  const { refinement, loading } = state.commercesList;
  return { refinement, loading };
};

export default connect(
  mapStateToProps,
  { refinementUpdate }
)(SearchBox);
