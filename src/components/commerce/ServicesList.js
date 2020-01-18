import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { FlatList, View } from 'react-native';
import { Fab } from 'native-base';
import { Spinner, EmptyList } from '../common';
import ServicesListItem from './ServicesListItem';
import { onServicesRead, onFormOpen } from '../../actions';
import { MAIN_COLOR } from '../../constants';

class ServicesList extends Component {
  componentDidMount() {
    this.unsubscribeServicesRead = this.props.onServicesRead(
      this.props.commerceId
    );
  }

  componentWillUnmount() {
    this.unsubscribeServicesRead && this.unsubscribeServicesRead();
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
    if (this.props.services.length > 0) {
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

  return { services, loading, commerceId };
};

export default connect(mapStateToProps, { onServicesRead, onFormOpen })(
  ServicesList
);
