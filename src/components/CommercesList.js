import React, { Component } from 'react';
import { FlatList, View } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { connect } from 'react-redux';
import { Constants } from 'expo';
import { Spinner, EmptyList, HeaderButton } from './common';
import CommerceListItem from './CommerceListItem';
import {
  commercesRead,
  searchCommerces,
  commercesReadArea,
  searchCommercesArea
} from '../actions';
import { MAIN_COLOR, NAVIGATION_HEIGHT } from '../constants';

class CommercesList extends Component {
  state = { search: '', searchVisible: false };

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: 'Buscar negocios',
      headerRight: navigation.getParam('rightIcons'),
      header: navigation.getParam('header')
    };
  };

  componentWillMount() {
    const { state, setParams } = this.props.navigation;
    state.params
      ? this.props.commercesReadArea(state.params.idArea)
      : this.props.commercesRead();

    setParams({
      rightIcons: this.renderRightButtons(),
      header: undefined
    });
  }

  renderRightButtons = () => {
    return (
      <View style={{ flexDirection: 'row', alignSelf: 'stretch' }}>
        <HeaderButton
          icon="md-search"
          onPress={this.onSearchPress}
        />
        <HeaderButton
          icon="ios-funnel"
          onPress={() => console.log('filtros de busqueda')}
        />
      </View>
    );
  };

  onSearchPress = async () => {
    this.props.navigation.setParams({ header: null });
    await this.setState({ searchVisible: true });
    this.searchbar.focus();
  }

  onCancelPress = () => {
    this.props.navigation.setParams({ header: undefined });
    this.setState({ searchVisible: false });
  }

  renderSearchBar = () => {
    if (this.state.searchVisible) {
      return (
        <View style={{
          height: NAVIGATION_HEIGHT + Constants.statusBarHeight,
          alignSelf: 'stretch',
          justifyContent: 'flex-end',
          backgroundColor: MAIN_COLOR,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.20,
          shadowRadius: 1.41,
          elevation: 2
        }}>
          <SearchBar
            ref={search => this.searchbar = search}
            platform="android"
            placeholder="Buscar negocios..."
            onChangeText={text => this.searchCommerces(text)}
            onClear={this.resetSearch}
            onCancel={this.onCancelPress}
            value={this.state.search}
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
            showLoading={this.props.searching}
            loadingProps={{ color: MAIN_COLOR }}
          />
        </View>
      );
    }
  };

  onChangeText = search => {
    this.setState({ search });
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

  renderList = () => {
    const { commerces } = this.props;

    if (commerces.length > 0) {
      return (<FlatList
        data={commerces}
        renderItem={this.renderRow}
        keyExtractor={commerce => commerce.id}
      />
      );
    }

    return (
      <EmptyList title='No se encontraron negocios.' />
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.renderSearchBar()}

        {this.props.loading
          ? <Spinner style={{ position: 'relative' }} />
          : this.renderList()}
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
