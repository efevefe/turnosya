import React, { Component } from 'react'
import { View, FlatList, RefreshControl} from 'react-native'
import { Divider, ListItem } from 'react-native-elements'
import { connect } from 'react-redux'
import { Spinner, EmptyList, MenuItem, Menu } from '../common'
import { onCommerceNotificationsRead, onCommerceNotificationDelete } from '../../actions'
import { MAIN_COLOR } from '../../constants'
import moment from 'moment'
import { stringFormatMinutes } from '../../utils'

class CommerceNotificationsList extends Component {
  state = {
    optionsVisible: false,
    selectNotification: null,
  }

  componentDidMount() {
    this.props.onCommerceNotificationsRead(this.props.commerceId)
  }

  onNotificationPerfilPress = () => {
    const clientId = this.state.selectNotification.sentFor
    this.props.navigation.navigate('clientProfileView', { clientId })
    this.setState({ optionsVisible: false })
  }

  onNotificationDeletePress = () => {
    const { commerceId } = this.props
    this.props.onCommerceNotificationDelete({
      commerceId,
      notificationId: this.state.selectNotification.id,
    })
    this.setState({ optionsVisible: false })
  }

  onOptionsPress = selectNotification => {
    this.setState({
      selectNotification,
      optionsVisible: true,
    })
  }

  renderRow = ({ item }) => {
    const { title, body, id } = item
    date = moment(item.date.toDate())
    return (
      <ListItem
        title={title}
        rightTitle={`Hace ${stringFormatMinutes(moment().diff(date, 'minutes')).toString()}`}
        rightTitleStyle={{ fontSize: 12 }}
        subtitle={body}
        subtitleStyle={{ fontSize: 12 }}
        rightIcon={{
          name: 'md-more',
          type: 'ionicon',
          containerStyle: { height: 20, width: 10 },
          onPress: () => this.onOptionsPress(item),
        }}
        onLongPress={() => this.onOptionsPress(item)}
        bottomDivider
      />
    )
  }

  onRefresh = () => {
    return (
      <RefreshControl
        refreshing={this.props.refreshing}
        onRefresh={() => this.props.onCommerceNotificationsRead(this.props.commerceId)}
        colors={[MAIN_COLOR]}
        tintColor={MAIN_COLOR}
      />
    )
  }

  renderList() {
    if (this.props.notifications.length)
      return (
        <FlatList
          data={this.props.notifications}
          renderItem={this.renderRow.bind(this)}
          keyExtractor={notification => notification.id}
          extraData={this.props.notifications}
          refreshControl={this.onRefresh()}
        />
      )

    return <EmptyList title="No tiene notificaciones" />
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.props.loading ? <Spinner style={{ position: 'relative' }} /> : this.renderList()}

        <Menu
          title={'Opciones'}
          onBackdropPress={() => this.setState({ optionsVisible: false })}
          isVisible={this.state.optionsVisible}
        >
          <MenuItem title="Perfil" icon="md-person" onPress={this.onNotificationPerfilPress} />
          <Divider style={{ backgroundColor: 'grey' }} />
          <MenuItem title="Eliminar" icon="md-trash" onPress={this.onNotificationDeletePress} />
        </Menu>
      </View>
    )
  }
}

const mapStateToProps = state => {
  const { notifications, loading } = state.commerceNotificationsList
  const { commerceId } = state.commerceData
  return { notifications, loading, commerceId }
}

export default connect(mapStateToProps, {
  onCommerceNotificationsRead,
  onCommerceNotificationDelete,
})(CommerceNotificationsList)
