import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { InstantSearch, Configure } from 'react-instantsearch/native';
import { IconButton, Spinner, EmptyList } from './common';
import getEnvVars from '../../environment';
import { refinementUpdate, commerceSearching } from '../actions';
import ConnectedHits from './CommercesList.SearchHits';
import ConnectedSearchBox from './CommercesList.SearchBox';
import ConnectedStateResults from './CommercesList.StateResults';

const { algoliaConfig } = getEnvVars();
const { appId, searchApiKey, commercesIndex } = algoliaConfig;

class CommercesList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      areaName: props.navigation.state.params.areaName,
      searchVisible: false
    };

    props.navigation.setParams({
      rightIcons: this.renderRightButtons(),
      header: undefined
    });
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: 'Buscar negocios',
      headerRight: navigation.getParam('rightIcons'),
      header: navigation.getParam('header')
    };
  };

  renderRightButtons = () => {
    return (
      <View style={{ flexDirection: 'row', alignSelf: 'stretch' }}>
        <IconButton icon="md-search" onPress={this.onSearchPress} />
        <IconButton
          icon="ios-funnel"
          onPress={() => console.log('filtros de busqueda')}
        />
      </View>
    );
  };

  onSearchPress = async () => {
    this.props.navigation.setParams({ header: null });
    this.setState({ searchVisible: true });
    //this.search.focus();
  };

  onCancelPress = () => {
    this.props.navigation.setParams({ header: undefined });
    this.setState({ searchVisible: false });
  };

  renderAlgoliaSearchBar = () => {
    if (this.state.searchVisible) {
      return (
        <ConnectedSearchBox
          autoFocus={true}
          showLoadingIndicator
          //ref={search => (this.search = search)}
          onCancel={this.onCancelPress}
        />
      );
    }
  };

  enableConfiguration = () => {
    return this.state.areaName ? (
      <Configure filters={`areaName:\'${this.state.areaName}\'`} />
    ) : null;
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <InstantSearch
          appId={appId}
          apiKey={searchApiKey}
          indexName={commercesIndex}
          stalledSearchDelay={0}
        >
          {this.renderAlgoliaSearchBar()}
          {this.enableConfiguration()}
          <ConnectedStateResults />
          <ConnectedHits />
        </InstantSearch>
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
)(CommercesList);
