import React, { Component } from 'react';
import {
  FlatList,
  Text,
  TouchableHighlight
} from 'react-native';
import { Card } from 'react-native-elements';
import { connect } from 'react-redux';
import { EmptyList } from '../common';
import {
  onCourtReservationValueChange
} from '../../actions';

class CommerceCourtTypes extends Component {
  onCourtTypePress = courtType => {
    this.props.onCourtReservationValueChange({
      prop: 'courtType',
      value: courtType
    });

    this.props.navigation.navigate('commerceSchedule');
  };

  renderItem = ({ item }) => {
    return (
      <TouchableHighlight
        onPress={this.props.navigation.state.routeName === 'commerceProfileView'
          && (() => this.onCourtTypePress(item.name))}
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
        <FlatList
          data={courtTypesList}
          renderItem={this.renderItem}
          keyExtractor={courtType => courtType.name}
          contentContainerStyle={{ paddingBottom: 15 }}
        />
      );
    }

    return (
      <EmptyList
        title="Parece que no hay canchas"
      />
    );
  };
}

const mapStateToProps = state => {
  const { courtTypesList } = state.commerceCourtTypes;
  return { courtTypesList };
};

export default connect(
  mapStateToProps,
  {
    onCourtReservationValueChange
  }
)(CommerceCourtTypes);
