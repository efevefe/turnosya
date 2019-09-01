import React, { Component } from 'react';
import { FlatList, View, Dimensions } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { Spinner } from './common';
import CommerceListItem from './CommerceListItem';
import {
  commercesRead,
  searchCommerces,
  readFavoriteCommerces
} from '../actions';
import { MAIN_COLOR } from '../constants';

const searchBarWidth = Math.round(Dimensions.get('window').width) - 105;

class CommercesList extends Component {
  state = { search: '' };

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: navigation.getParam('title'),
      headerRight: navigation.getParam('rightIcon')
    };
  };

  componentWillMount() {
    this.props.readFavoriteCommerces();
    this.props.commercesRead();
    this.props.navigation.setParams({
      rightIcon: this.renderFiltersButton(),
      title: this.renderSearchBar()
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.searching !== this.props.searching) {
      this.props.navigation.setParams({ title: this.renderSearchBar() });
    }
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

  renderSearchBar = () => {
    return (
      <SearchBar
        platform="android"
        placeholder="Buscar negocios..."
        placeholderTextColor="white"
        onChangeText={text => this.searchCommerces(text)}
        onClear={this.resetSearch}
        value={this.state.search}
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
        showLoading={this.props.searching}
        loadingProps={{ color: 'white' }}
      />
    );
  };

  onChangeText = async search => {
    await this.setState({ search });
    this.props.navigation.setParams({ title: this.renderSearchBar() });
  };

  searchCommerces = search => {
    this.onChangeText(search);

    if (search.length >= 1) {
      setTimeout(() => {
        this.props.searchCommerces(search);
      }, 200);
    } else if (search.length == 0) {
      this.resetSearch();
    }
  };

  resetSearch = () => {
    this.onChangeText('');

    setTimeout(() => {
      this.props.commercesRead();
    }, 50);
  };

  renderRow({ item }) {
    return (
      <CommerceListItem commerce={item} navigation={this.props.navigation} />
    );
  }

  render() {
    if (this.props.loading) return <Spinner />;

    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={this.props.commerces}
          renderItem={this.renderRow.bind(this)}
          keyExtractor={commerce => commerce.id}
          extraData={this.props.commerces}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { commerces, loading, searching } = state.commercesList;
  return { commerces, loading, searching };
};

export default connect(
  mapStateToProps,
  { commercesRead, searchCommerces, readFavoriteCommerces }
)(CommercesList);
