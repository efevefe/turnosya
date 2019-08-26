import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { InstantSearch } from 'react-instantsearch/native';
import { refinementUpdate } from '../actions';
import ConnectedSearch from './CommercesList.SearchConnection';
import ConnectedHits from './CommercesList.SearchHits';
import SearchBox from './CommercesList.SearchBox';

class CommercesList extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: navigation.getParam('title'),
      headerRight: navigation.getParam('rightIcon')
    };
  };

  componentWillMount() {
    // cambiar
    this.props.navigation.setParams({
      rightIcon: this.renderFiltersButton(),
      title: this.renderAlgoliaSearchBar()
    });
  }

  renderFiltersButton = () => {
    return (
      <Ionicons
        name="ios-funnel"
        size={28}
        color="white"
        style={{ marginRight: 15 }}
        onPress={() => console.log('filtros de busqueda')}
      />
    );
  };

  renderAlgoliaSearchBar = () => <SearchBox />;

  render() {
    return (
      <View style={{ flex: 1 }}>
        <InstantSearch
          appId="A3VWXVHSOG"
          apiKey="e12c3e69403b5f10ca72f83fcdc4841c"
          indexName="CommercesIndexTurnosYa"
        >
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
