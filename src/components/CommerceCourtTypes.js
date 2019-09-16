import React, { Component } from 'react';
import { FlatList, Text, RefreshControl, TouchableHighlight, View } from 'react-native';
import { Card } from 'react-native-elements';
import { connect } from 'react-redux';
import { Spinner, EmptyList } from '../components/common';
import { onCommerceCourtTypesRead } from '../actions';
import { MAIN_COLOR } from '../constants';

class CommerceCourtTypes extends Component {
  state = {
    commerceId: null
  };

  async componentDidMount() {
    await this.setState({
      commerceId: this.props.navigation.getParam('commerceId')
    });

    this.props.onCommerceCourtTypesRead({
      commerceId: this.state.commerceId,
      loadingType: 'loading'
    });
  }

  onRefresh = () => {
    return (
      <RefreshControl
        refreshing={this.props.refreshing}
        onRefresh={() => {
          this.props.onCommerceCourtTypesRead({
            commerceId: this.state.commerceId,
            loadingType: 'refreshing'
          });
        }}
        colors={[MAIN_COLOR]}
        tintColor={MAIN_COLOR}
      />
    );
  };

  renderItem = ({ item }) => {
    return (
      <TouchableHighlight
        onPress={() => this.props.navigation.navigate(
          'commerceSchedule',
          {
            commerceId: this.state.commerceId,
            courtTypeId: item.name
          })}
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
          contentContainerStyle={{ paddingBottom: 15 }}
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

  return { courtTypesList, loading, refreshing };
};

export default connect(
  mapStateToProps,
  { onCommerceCourtTypesRead }
)(CommerceCourtTypes);
