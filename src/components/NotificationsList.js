import React, { Component } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { Divider, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import { Spinner, EmptyList, MenuItem, Menu } from './common';
import {
  onClientNotificationsRead,
  onClientNotificationDelete,
  onCommerceNotificationsRead,
  onCommerceNotificationDelete
} from '../actions';
import { MAIN_COLOR } from '../constants';
import moment from 'moment';
import { notificationsToFormatString } from '../utils';

class NotificationsList extends Component {
  state = {
    optionsVisible: false,
    selectedNotification: null,
    type: null
  };

  componentDidMount() {
    this.onNotificationsRead()
  }

  componentWillUnmount() {
    this.unsubscribeNotificationsRead && this.unsubscribeNotificationsRead();
  }

  onNotificationsRead = () => {
    this.unsubscribeNotificationsRead && this.unsubscribeNotificationsRead();
    
    if (this.props.navigation.state.routeName === 'commerceNotificationslist') {
    this.unsubscribeNotificationsRead = this.props.onCommerceNotificationsRead(this.props.commerceId);
    this.setState({ type: 'commerce' });
    } else {
    this.unsubscribeNotificationsRead = this.props.onClientNotificationsRead(this.props.clientId);
    this.setState({ type: 'client' });
    }
    }

  onProfilePress = () => {
    if (this.state.type === 'client') {
      let commerceId = this.state.selectedNotification.sentBy;
      this.props.navigation.navigate('commerceProfileView', { commerceId });
    } else {
      const clientId = this.state.selectedNotification.sentBy;
      this.props.navigation.navigate('clientProfileView', { clientId });
    }
    this.setState({ optionsVisible: false });
  };

  onNotificationDeletePress = () => {
    if (this.state.type === 'client') {
      const { clientId } = this.props;
      this.props.onClientNotificationDelete({
        clientId,
        notificationId: this.state.selectedNotification.id
      });
    } else {
      const { commerceId } = this.props;
      this.props.onCommerceNotificationDelete({
        commerceId,
        notificationId: this.state.selectedNotification.id
      });
    }
    this.setState({ optionsVisible: false });
  };

  onOptionsPress = selectedNotification => {
    this.setState({
      selectedNotification,
      optionsVisible: true
    });
  };

  renderRow = ({ item }) => {
    console.log(item.date);
    return (
      <ListItem
        title={item.title}
        rightTitle={`Hace ${notificationsToFormatString(moment().diff(item.date, 'minutes')).toString()}`}
        rightTitleStyle={{ fontSize: 12 }}
        subtitle={item.body}
        subtitleStyle={{ fontSize: 12 }}
        rightIcon={{
          name: 'md-more',
          type: 'ionicon',
          containerStyle: { height: 20, width: 10 },
          onPress: () => this.onOptionsPress(item)
        }}
        onLongPress={() => this.onOptionsPress(item)}
        bottomDivider
      />
    );
  };

  onRefresh = () => {
    return (
      <RefreshControl
        refreshing={this.props.refreshing}
        onRefresh={this.onNotificationsRead}
        colors={[MAIN_COLOR]}
        tintColor={MAIN_COLOR}
      />
    );
  };

  render() {
    if (this.props.loading) return <Spinner />;
    if (this.props.notifications.length)
      return (
        <View style={{ flex: 1 }}>
          <FlatList
            data={this.props.notifications}
            renderItem={this.renderRow.bind(this)}
            keyExtractor={notification => notification.id}
            extraData={this.props.notifications}
            refreshControl={this.onRefresh()}
          />

          <Menu
            title={'Opciones'}
            onBackdropPress={() => this.setState({ optionsVisible: false })}
            isVisible={this.state.optionsVisible}
          >
            <MenuItem title="Perfil" icon="md-person" onPress={this.onProfilePress} />
            <Divider style={{ backgroundColor: 'grey' }} />
            <MenuItem title="Eliminar" icon="md-trash" onPress={this.onNotificationDeletePress} />
          </Menu>
        </View>
      );
    return <EmptyList title="No tiene notificaciones" onRefresh={this.onRefresh()} />;
  }
}

const mapStateToProps = state => {
  const { notifications, loading } = state.notificationsList;
  const { clientId } = state.clientData;
  const { commerceId } = state.commerceData;
  return { notifications, loading, clientId, commerceId };
};

export default connect(mapStateToProps, {
  onClientNotificationsRead,
  onClientNotificationDelete,
  onCommerceNotificationsRead,
  onCommerceNotificationDelete
})(NotificationsList);
