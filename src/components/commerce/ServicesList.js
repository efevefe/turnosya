import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { FlatList, View } from 'react-native';
import { Fab } from 'native-base';
import { Spinner, EmptyList } from '../common';
import ServicesListItem from './ServicesListItem';
import { onFormOpen } from '../../actions';
import { MAIN_COLOR } from '../../constants';

class ServicesList extends Component {
  renderRow({ item }) {
    return (
      <ServicesListItem
        service={item}
        commerceId={this.props.commerceId}
        navigation={this.props.navigation}
        employeeId={this.props.employeeId}
      />
    );
  }

  onAddPress = () => {
    this.props.onFormOpen();
    this.props.navigation.navigate('serviceForm');
  };

  renderAddButton = () => {
    return (
      <Fab
        style={{ backgroundColor: MAIN_COLOR }}
        position="bottomRight"
        onPress={() => this.onAddPress()}
      >
        <Ionicons name="md-add" />
      </Fab>
    );
  };

  renderList = () => {
    if (this.props.services.length) {
      return (
        <FlatList
          data={this.props.services}
          renderItem={this.renderRow.bind(this)}
          keyExtractor={service => service.id}
          contentContainerStyle={{ paddingBottom: 95 }}
        />
      );
    }

    return <EmptyList title="No hay ningun servicio" />;
  };

  render() {
    if (this.props.loading) {
      return <Spinner />;
    }

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
  const { services, loading } = state.servicesList;
  const { commerceId } = state.commerceData;
  const { employeeId } = state.roleData;

  return { services, loading, commerceId, employeeId };
};

export default connect(mapStateToProps, { onFormOpen })(ServicesList);
