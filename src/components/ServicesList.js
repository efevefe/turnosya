import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { FlatList, View } from 'react-native';
import { Fab } from 'native-base';
import { Spinner, EmptyList } from './common';
import ServicesListItem from './ServicesListItem';
import { servicesRead } from '../actions';
import { MAIN_COLOR } from '../constants';

class ServicesList extends Component {
  componentWillMount() {
    this.props.servicesRead(this.props.commerceId);
  }

  renderRow({ item }) {
    return (
      <ServicesListItem
        service={item}
        commerceId={this.props.commerceId}
        navigation={this.props.navigation}
      />
    );
  }

  onAddPress = () => {
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
  }

  renderList = () => {
    if (this.props.services.length > 0) {
      return (
        <View style={{ flex: 1 }}>
          <FlatList
            data={this.props.services}
            renderItem={this.renderRow.bind(this)}
            keyExtractor={service => service.id}
            contentContainerStyle={{ paddingBottom: 95 }}
          />
          {this.renderAddButton()}
        </View>
      );
    }

    return (
      <EmptyList title="No hay ningun servicio." >
        {this.renderAddButton()}
      </EmptyList>
    );
  }

  render() {
    if (this.props.loading) {
      return <Spinner />;
    }

    return this.renderList();
  }
}
const mapStateToProps = state => {
  const { services, loading } = state.servicesList;
  const { commerceId } = state.commerceData;

  return { services, loading, commerceId };
};

export default connect(
  mapStateToProps,
  { servicesRead }
)(ServicesList);
