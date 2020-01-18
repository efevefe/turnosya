import React, { Component } from 'react';
import { FlatList, Text, TouchableHighlight, View } from 'react-native';
import { Card } from 'react-native-elements';
import { connect } from 'react-redux';
import { EmptyList } from '../common';
import { onCourtReservationValueChange } from '../../actions';
import VerifyEmailModal from '../client/VerifyEmailModal';
import { isEmailVerified } from '../../utils';

class CommerceCourtTypes extends Component {
  state = { modal: false };

  onCourtTypePress = async courtType => {
    try {
      if (await isEmailVerified()) {
        this.props.onCourtReservationValueChange({ courtType });
        this.props.navigation.navigate('commerceSchedule');
      } else {
        this.setState({ modal: true });
      }
    } catch (e) {
      console.error(e);
    }
  };

  onModalClose = () => {
    this.setState({ modal: false });
  };

  renderModal = () => {
    if (this.state.modal)
      return <VerifyEmailModal onModalCloseCallback={this.onModalClose} />;
  };

  renderItem = ({ item }) => {
    return (
      <TouchableHighlight
        onPress={
          this.props.navigation.state.routeName === 'commerceProfileView'
            ? () => this.onCourtTypePress(item.name)
            : null
        }
        underlayColor="transparent"
      >
        <Card
          image={item.image ? { uri: item.image } : null}
          imageStyle={{ height: 80 }}
          containerStyle={{
            overflow: 'hidden',
            borderRadius: 10
          }}
        >
          <Text>{item.name}</Text>
        </Card>
      </TouchableHighlight>
    );
  };

  render() {
    const { courtTypesList } = this.props;

    if (courtTypesList.length) {
      return (
        <View>
          <FlatList
            data={courtTypesList}
            renderItem={this.renderItem}
            keyExtractor={courtType => courtType.name}
            contentContainerStyle={{ paddingBottom: 15 }}
          />
          {this.renderModal()}
        </View>
      );
    }

    return <EmptyList title="Parece que no hay canchas" />;
  }
}

const mapStateToProps = state => {
  const { courtTypesList } = state.commerceCourtTypes;
  return { courtTypesList };
};

export default connect(mapStateToProps, {
  onCourtReservationValueChange
})(CommerceCourtTypes);
