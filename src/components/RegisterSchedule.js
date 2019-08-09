import React, { Component } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Spinner, Button } from './common';
import RegisterScheduleItem from './RegisterScheduleItem';
import {} from '../actions';
import { MAIN_COLOR } from '../constants';
import { Ionicons } from '@expo/vector-icons';

class RegisterSchedule extends Component {
  state = {
    cards: [
      {
        id: 1,
        firstOpen: '10:00',
        firstClose: '13:00',
        days: [1, 2, 3]
      }
    ],
    days: []
  };

  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: navigation.getParam('rightIcon')
    };
  };

  componentWillMount() {
    this.props.navigation.setParams({ rightIcon: this.renderAddButton() });
  }

  renderAddButton = () => {
    return (
      <Ionicons
        name="md-add"
        size={28}
        color="white"
        style={{ marginRight: 15 }}
        onPress={this.onAddPress}
      />
    );
  };

  onAddPress = () => {
    this.setState({ cards: this.state.cards.concat([card2]) });
  };

  renderRow = ({ item }) => {
    return (
      <RegisterScheduleItem card={item} navigation={this.props.navigation} />
    );
  };

  renderList() {
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={this.state.cards}
          renderItem={this.renderRow}
          keyExtractor={card => card.id}
        />
        <Button
          style={styles.cardStyle}
          title="Guardar"
          loading={this.props.loading}
          //onPress={this.onButtonPressHandler.bind(this)}
        />
      </View>
    );
  }

  render() {
    return this.renderList();
  }
}

const card2 = {
  id: 2,
  firstOpen: '10:00',
  firstClose: '13:00',
  disableDays: [1, 2, 3],
  days: []
};

const styles = StyleSheet.create({
  cardStyle: {
    padding: 5,
    paddingTop: 10,
    borderRadius: 10
  }
});

const mapStateToProps = state => {
  const { loading } = state.registerSchedule;
  return { loading };
};

export default connect(
  mapStateToProps,
  {}
)(RegisterSchedule);
