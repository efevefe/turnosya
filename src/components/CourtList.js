import React, { Component } from 'react';
import { FlatList, View } from 'react-native';
import { connect } from 'react-redux';
import { Spinner } from './common';
import CourtListItem from './CourtListItem';
import { courtsRead } from '../actions';
import { MAIN_COLOR } from '../constants';

class CourtList extends Component {
  componentWillMount() {
    this.props.courtsRead();
  }

  renderRow({ item }) {
    return <CourtListItem court={item} navigation={this.props.navigation} />;
  }

  renderList() {
    if (this.props.loading) {
      return <Spinner size="large" color={MAIN_COLOR} />;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <FlatList
            data={this.props.courts}
            renderItem={this.renderRow.bind(this)}
            keyExtractor={court => court.id}
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
  const { courts, loading } = state.courtsList;

  return { courts, loading };
};

export default connect(
  mapStateToProps,
  { courtsRead }
)(CourtList);
