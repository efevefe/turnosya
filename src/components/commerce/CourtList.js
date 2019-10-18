import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FlatList, View } from 'react-native';
import { Fab } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { Spinner, EmptyList } from '../common';
import CourtListItem from './CourtListItem';
import { courtsRead } from '../../actions';
import { MAIN_COLOR } from '../../constants';

class CourtList extends Component {
  componentDidMount() {
    this.unsubscribeCourtsRead = this.props.courtsRead(this.props.commerceId);
  }

  componentWillUnmount() {
    this.unsubscribeCourtsRead && this.unsubscribeCourtsRead();
  }

  renderRow({ item }) {
    return (
      <CourtListItem
        court={item}
        commerceId={this.props.commerceId}
        navigation={this.props.navigation}
      />
    );
  }

  onAddPress = () => {
    this.props.navigation.navigate('courtForm');
  };

  renderList = () => {
    if (this.props.courts.length > 0) {
      return (
        <FlatList
          data={this.props.courts}
          renderItem={this.renderRow.bind(this)}
          keyExtractor={court => court.id}
          contentContainerStyle={{ paddingBottom: 95 }}
        />
      );
    }

    return <EmptyList title='No hay ninguna cancha' />;
  }

  render() {
    if (this.props.loading) return <Spinner />;

    return (
      <View style={{ flex: 1 }}>
        {this.renderList()}

        <Fab
          style={{ backgroundColor: MAIN_COLOR }}
          position="bottomRight"
          onPress={() => this.onAddPress()}
        >
          <Ionicons name="md-add" />
        </Fab>
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { courts, loading } = state.courtsList;
  const { commerceId } = state.commerceData;

  return { courts, loading, commerceId };
};

export default connect(
  mapStateToProps,
  { courtsRead }
)(CourtList);
