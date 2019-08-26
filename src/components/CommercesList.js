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
  commercesReadArea,
  searchCommercesArea
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
    const { state, setParams } = this.props.navigation;
    state.params
      ? this.props.commercesReadArea(state.params.idArea)
      : this.props.commercesRead();

    setParams({
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
        leftIconContainerStyle={{ paddingLeft: 0, marginLeft: 25 }}
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
    const { idArea } = this.props.navigation.state.params;
    const { searchCommerces, searchCommercesArea } = this.props;
    this.onChangeText(search);
    if (search.length >= 1) {
      setTimeout(() => {
        idArea ? searchCommercesArea(search, idArea) : searchCommerces(search);
      }, 200);
    } else if (search.length == 0) {
      this.resetSearch();
    }
  };

  resetSearch = () => {
    this.onChangeText('');

    const { idArea } = this.props.navigation.state.params;
    const { commercesRead, commercesReadArea } = this.props;

    setTimeout(() => {
      idArea ? commercesReadArea(idArea) : commercesRead();
    }, 50);
  };

  renderRow = ({ item }) => {
    return (
      <CommerceListItem commerce={item} navigation={this.props.navigation} />
    );
  };

  render() {
    const { loading, commerces } = this.props;
    if (loading) return <Spinner />;

    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={commerces}
          renderItem={this.renderRow}
          keyExtractor={commerce => commerce.id}
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
  { commercesRead, searchCommerces, commercesReadArea, searchCommercesArea }
)(CommercesList);
