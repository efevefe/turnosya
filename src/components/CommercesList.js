import React, { Component } from 'react';
import { FlatList, View } from 'react-native';
import { connect } from 'react-redux';
import { Spinner } from './common';
import CommerceListItem from './CommerceListItem';
import { commercesRead } from '../actions';
import { MAIN_COLOR } from '../constants';

class CommercesList extends Component {
  componentWillMount() {
    this.props.commercesRead();
  }
  renderRow({ item }) {
    return (
      <CommerceListItem commerce={item} navigation={this.props.navigation} />
    );
  }

  renderList() {
    if (this.props.loading) {
      return <Spinner size="large" color={MAIN_COLOR} />;
    } else {
      return (
        <View style={{ flex: 1 }}>
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
  { commercesRead }
)(CommercesList);
