import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { InstantSearch, Configure } from 'react-instantsearch/native';
import { IconButton } from './common';
import getEnvVars from '../../environment';
import { refinementUpdate, readFavoriteCommerces } from '../actions';
import ConnectedSearch from './CommercesList.SearchConnection';
import ConnectedHits from './CommercesList.SearchHits';
import SearchBox from './CommercesList.SearchBox';

const { algoliaConfig } = getEnvVars();
const { appId, searchApiKey, commercesIndex } = algoliaConfig;

class CommercesList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      areaName: props.navigation.state.params.areaName,
      searchVisible: false
    };
    
    props.readFavoriteCommerces();
    
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
        <IconButton
          icon="md-search"
          onPress={this.onSearchPress}
        />
        <IconButton
          icon="ios-funnel"
          onPress={() => console.log('filtros de busqueda')}
        />
      </View>
    );
  };

  onSearchPress = async () => {
    this.props.navigation.setParams({ header: null });
    await this.setState({ searchVisible: true });
    this.search.focus();
  };

  onCancelPress = () => {
    this.props.navigation.setParams({ header: undefined });
    this.setState({ searchVisible: false });
  };

  renderAlgoliaSearchBar = () => {
    if (this.state.searchVisible) {
      return (
        <SearchBox
          ref={search => (this.search = search)}
          onCancel={this.onCancelPress}
        />
      );
    }
  };

  // No me gusta como quedó esto... Ya veré bien como lo cambio mi prioridad era mergear de una vez
  enableConfiguration = () => {
    return this.state.areaName ? (
      <Configure filters={`areaName:\'${this.state.areaName}\'`} />
    ) : null;
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.renderAlgoliaSearchBar()}
        <InstantSearch
          appId={appId}
          apiKey={searchApiKey}
          indexName={commercesIndex}
        >
          {this.enableConfiguration()}
          <ConnectedSearch />
          <ConnectedHits />
        </InstantSearch>
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { refinement ,favoriteCommerces} = state.commercesList;
  return { refinement,favoriteCommerces };
};

export default connect(
  mapStateToProps,
  { refinementUpdate,readFavoriteCommerces }
)(CommercesList);
