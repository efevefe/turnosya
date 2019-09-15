import React, { Component } from 'react';
import { FlatList, Text, RefreshControl, TouchableHighlight } from 'react-native';
import { Card } from 'react-native-elements';
import { connect } from 'react-redux';
import { Spinner, EmptyList } from '../components/common';
import { 
  onCommerceCourtTypesRead, 
  onCourtReservationValueChange 
} from '../actions';
import { MAIN_COLOR } from '../constants';

class CommerceCourtTypes extends Component {
  componentDidMount() {
    this.props.onCommerceCourtTypesRead({
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
            commerceId: this.props.commerceId,
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
  }

  renderItem = ({ item }) => {
    return (
      <TouchableHighlight
        onPress={() => this.onCourtTypePress(item.name)}
        underlayColor='transparent'
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
        />
      );
    }

    return (
      <EmptyList
        title='Parece que no hay canchas'
        refreshControl={this.onRefresh()}
      />
    );
  }

  render() {
    const { loading } = this.props;

    if (loading) return <Spinner />;

    return this.renderList();
  }
}

const mapStateToProps = state => {
  const { courtTypesList, loading, refreshing } = state.commerceCourtTypes;
  const commerceId = state.courtReservation.commerce.objectID;

  return { commerceId, courtTypesList, loading, refreshing };
};

export default connect(
  mapStateToProps,
  { 
    onCommerceCourtTypesRead,
    onCourtReservationValueChange
   }
)(CommerceCourtTypes);
