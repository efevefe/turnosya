import React, { Component } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  TouchableWithoutFeedback,
  Text,
  StyleSheet
} from 'react-native';
import { Divider } from 'react-native-elements';
import { connect } from 'react-redux';
import { Spinner, EmptyList, CardSection, IconButton } from '../common';
import { onCommerceNotificationsRead } from '../../actions';
import { MAIN_COLOR } from '../../constants';
import moment from 'moment';

class CommerceNotificationsList extends Component {
  state = {
    expand: null
  };

  componentDidMount() {
    this.props.onCommerceNotificationsRead(this.props.commerceId);
  }

  expandInfo = item => {
    if (this.state.expand === item.id) {
      return (
        <CardSection>
          <Text
            style={styles.regularText}
          >{`Por: ${item.name} - Servicio: ${item.service}`}</Text>
        </CardSection>
      );
    }
  };

  renderIcon = title => {
    if (title === 'Turno Cancelado')
      return (
        <View style={{ flexDirection: 'row', alignSelf: 'stretch' }}>
          <Text style={styles.bigText}>{title}</Text>
          <IconButton icon="md-search" />
        </View>
      );
    else {
      return (
        <View style={{ flexDirection: 'row', alignSelf: 'stretch' }}>
          <Text style={styles.bigText}>{title}</Text>
          <IconButton icon="md-search" containerStyle={{ paddingRight: 0 }} />
        </View>
      );
    }
  };
  renderRow = ({ item }) => {
    const { title, body, date, id } = item;
    return (
      <TouchableWithoutFeedback
        onPress={() => this.setState({ expand: id })}
        delayPressOut={3000}
        onPressOut={() => this.setState({ expand: null })}
      >
        <View>
          {this.renderIcon(title)}
          <CardSection>
            <Text style={styles.mediumText}>{body}</Text>
          </CardSection>

          {this.expandInfo(item)}
          <Divider style={styles.divider} />
        </View>
      </TouchableWithoutFeedback>
    );
    /*  <ListItem
          title={title}
          rightTitle={moment(date.toDate()).format('DD/MM HH:mm')}
          subtitle={body}
          badge={{ value: null }}
          bottomDivider
          onPress={() =>
            this.props.navigation.navigate('commerceNotificationsDetails', {
              notification: item,
              title: item.title
            })
          }
        />
      );
    return (
      <ListItem
        title={title}
        rightTitle={moment(date.toDate()).format('DD/MM HH:mm')}
        subtitle={body}
        bottomDivider
        onPress={() =>
          this.props.navigation.navigate('commerceNotificationsDetails', {
            notification: item,
            title: item.title
          })
        }
      /> */
  };

  onRefresh = () => {
    return (
      <RefreshControl
        refreshing={this.props.refreshing}
        onRefresh={() =>
          this.props.onCommerceNotificationsRead(this.props.commerceId)
        }
        colors={[MAIN_COLOR]}
        tintColor={MAIN_COLOR}
      />
    );
  };

  renderList() {
    if (this.props.notifications.length)
      return (
        <FlatList
          data={this.props.notifications}
          renderItem={this.renderRow.bind(this)}
          keyExtractor={notification => notification.id}
          refreshControl={this.onRefresh()}
        />
      );

    return <EmptyList title="No tiene notificaciones" />;
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.props.loading ? (
          <Spinner style={{ position: 'relative' }} />
        ) : (
          this.renderList()
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  bigText: {
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'left'
  },
  mediumText: {
    fontSize: 14
  },
  regularText: {
    fontSize: 12
  },
  divider: {
    margin: 10,
    marginLeft: 40,
    marginRight: 40,
    backgroundColor: 'grey'
  },
  cardSections: {
    alignItems: 'center'
  }
});
const mapStateToProps = state => {
  const { notifications, loading } = state.commerceNotificationsList;
  const { commerceId } = state.commerceData;
  return { notifications, loading, commerceId };
};

export default connect(mapStateToProps, { onCommerceNotificationsRead })(
  CommerceNotificationsList
);
