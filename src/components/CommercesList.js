import React, { Component } from 'react';
import { FlatList, View } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { connect } from 'react-redux';
import { Spinner } from './common';
import CommerceListItem from './CommerceListItem';
import { commercesRead, searchCommerces } from '../actions';
import { MAIN_COLOR } from '../constants';

class CommercesList extends Component {
  state = { search: '' };

  componentWillMount() {
    this.props.commercesRead();
  }
  renderRow({ item }) {
    return (
      <CommerceListItem commerce={item} navigation={this.props.navigation} />
    );
  }

  searchCommerces(search) {
    this.setState({
      search: search
    });
    if (search.length >= 2) {
      setTimeout(() => {
        this.props.searchCommerces(search);
      }, 200);
    } else if (search.length == 0) {
      this.resetSearch();
    }
  }

  resetSearch() {
    this.setState({
      search: ''
    });
    setTimeout(() => {
      this.props.commercesRead();
    }, 50);
  }

  renderList() {
    if (this.props.loading) {
      return <Spinner size="large" color={MAIN_COLOR} />;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <SearchBar
            platform="android"
            placeholder="Busca algun negocio"
            onChangeText={text => this.searchCommerces(text)}
            onClear={this.resetSearch.bind(this)}
            value={this.state.search}
          />

          <FlatList
            data={this.props.commerces}
            renderItem={this.renderRow.bind(this)}
            keyExtractor={commerce => commerce.id}
          />
        </View>
      );
    }
  }

  render() {
    return this.renderList();
  }
}

const mapStateToProps = state => {
  const { commerces, loading } = state.commercesList;
  return { commerces, loading };
};

export default connect(
  mapStateToProps,
  { commercesRead, searchCommerces }
)(CommercesList);
