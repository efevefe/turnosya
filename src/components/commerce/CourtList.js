import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FlatList, View } from 'react-native';
import { Fab } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { Spinner, EmptyList } from '../common';
import CourtListItem from './CourtListItem';
import { onCourtsRead, onCourtFormOpen } from '../../actions';
import { MAIN_COLOR } from '../../constants';
import PermissionsAssigner from '../common/PermissionsAssigner';
import { ROLES } from '../../constants';

class CourtList extends Component {
  componentDidMount() {
    this.unsubscribeCourtsRead = this.props.onCourtsRead(this.props.commerceId);
  }

  componentWillUnmount() {
    this.unsubscribeCourtsRead && this.unsubscribeCourtsRead();
  }

  onAddPress = () => {
    this.props.onCourtFormOpen();
    this.props.navigation.navigate('courtForm');
  };

  isCourtDisabled = court => {
    const { disabledTo, disabledFrom } = court;
    return disabledFrom && (!disabledTo || disabledTo >= moment());
  };

  renderRow({ item }) {
    return (
      <CourtListItem
        court={{
          ...item,
          disabled: this.isCourtDisabled(item)
        }}
        commerceId={this.props.commerceId}
        navigation={this.props.navigation}
      />
    );
  }

  renderList = () => {
    if (this.props.courts.length) {
      return (
        <FlatList
          data={this.props.courts}
          renderItem={this.renderRow.bind(this)}
          keyExtractor={court => court.id}
          contentContainerStyle={{ paddingBottom: 95 }}
        />
      );
    }

    return <EmptyList title="No hay ninguna cancha" />;
  };

  render() {
    if (this.props.loading) return <Spinner />;

    return (
      <View style={{ flex: 1 }}>
        {this.renderList()}

        <PermissionsAssigner requiredRole={ROLES.ADMIN}>
          <Fab
            style={{ backgroundColor: MAIN_COLOR }}
            position="bottomRight"
            onPress={() => this.onAddPress()}
          >
            <Ionicons name="md-add" />
          </Fab>
        </PermissionsAssigner>
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { courts, loading } = state.courtsList;
  const { commerceId } = state.commerceData;

  return { courts, loading, commerceId };
};

export default connect(mapStateToProps, { onCourtsRead, onCourtFormOpen })(
  CourtList
);
