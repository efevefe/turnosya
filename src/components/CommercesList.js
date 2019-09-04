import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { InstantSearch, Configure } from 'react-instantsearch/native';
import { refinementUpdate } from '../actions';
import ConnectedSearch from './CommercesList.SearchConnection';
import ConnectedHits from './CommercesList.SearchHits';
import SearchBox from './CommercesList.SearchBox';

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
      <View style={{ flexDirection: 'row' }}>
        <Ionicons
          name="md-search"
          size={28}
          color="white"
          style={{ marginRight: 20 }}
          onPress={this.onSearchPress}
        />
        <Ionicons
          name="ios-funnel"
          size={28}
          color="white"
          style={{ marginRight: 15 }}
          onPress={() => console.log('filtros de busqueda')}
        />
      </View>
    );
  };

  onSearchPress = async () => {
    this.props.navigation.setParams({ header: null });
    await this.setState({ searchVisible: true });
    this.search.focus();
  }

  onCancelPress = () => {
    this.props.navigation.setParams({ header: undefined });
    this.setState({ searchVisible: false });
  }

  renderAlgoliaSearchBar = () => {
    if (this.state.searchVisible) {
      return (
        <SearchBox
          ref={search => this.search = search}
          onCancel={this.onCancelPress}
        />
      );
    }
  }

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
          appId="A3VWXVHSOG"
          apiKey="e12c3e69403b5f10ca72f83fcdc4841c"
          indexName="CommercesIndexTurnosYa"
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
  const { refinement } = state.commercesList;
  return { refinement };
};

export default connect(
  mapStateToProps,
  { refinementUpdate }
)(CommercesList);
