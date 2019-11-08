import React, { Component } from 'react';
import {
  FlatList,
  Text,
  RefreshControl,
  TouchableHighlight
} from 'react-native';
import { Card } from 'react-native-elements';
import { connect } from 'react-redux';
import { Spinner, EmptyList } from '../common';
import {
  onCommerceCourtTypesRead,
  onCourtReservationValueChange
} from '../../actions';
import { MAIN_COLOR } from '../../constants';

class CommerceCourtTypes extends Component {
  componentDidMount() {
    this.props.navigation.state.routeName === 'commerceProfileView'
      ? this.props.onCommerceCourtTypesRead({
          commerceId: this.props.commerce.objectID,
          loadingType: 'loading'
        })
      : this.props.onCommerceCourtTypesRead({
          commerceId: this.props.commerceId,
          loadingType: 'loading'
        });
  }

  onRefresh = () => {
    return (
      <RefreshControl
        refreshing={this.props.refreshing}
        onRefresh={() => {
          this.props.onCommerceCourtTypesRead({
            commerceId: this.props.commerce.objectID,
            loadingType: 'refreshing'
          });
        }}
        colors={[MAIN_COLOR]}
        tintColor={MAIN_COLOR}
      />
    );
  };

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
        onPress={() =>
          this.props.navigation.state.routeName === 'commerceProfileView'
            ? this.onCourtTypePress(item.name)
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

  renderList = () => {
    const { courtTypesList } = this.props;

    if (courtTypesList.length > 0) {
      return (
        <FlatList
          data={courtTypesList}
          renderItem={this.renderItem}
          keyExtractor={courtType => courtType.name}
          refreshControl={this.onRefresh()}
          contentContainerStyle={{ paddingBottom: 15 }}
        />
      );
    }

    return (
      <EmptyList
        title="Parece que no hay canchas"
        refreshControl={this.onRefresh()}
      />
    );
  };

  render() {
    const { loading } = this.props;

    if (loading) return <Spinner />;

    return this.renderList();
  }
}

const mapStateToProps = state => {
  const { courtTypesList, loading, refreshing } = state.commerceCourtTypes;
  const { commerce } = state.courtReservation;
  const { commerceId } = state.commerceData;

  return { commerce, courtTypesList, loading, refreshing, commerceId };
};

export default connect(
  mapStateToProps,
  {
    onCommerceCourtTypesRead,
    onCourtReservationValueChange
  }
)(CommerceCourtTypes);
