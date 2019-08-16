import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { FlatList, View, StyleSheet } from 'react-native';
import { Spinner, Button } from './common';
import { onScheduleValueChange } from '../actions';
import { MAIN_COLOR } from '../constants';
import RegisterScheduleItem from './RegisterScheduleItem';
import { Fab } from 'native-base';

class RegisterSchedule extends Component {
  state = {
    active: false
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
        name="md-checkmark"
        size={28}
        color="white"
        style={{ marginRight: 15 }}
        //onPress={this.onAddPress}
      />
    );
  };

  onAddPress = () => {
    const { cards, selectedDays, onScheduleValueChange } = this.props;
    if (cards.length === 0) {
      onScheduleValueChange({
        prop: 'cards',
        value: cards.concat([{ ...emptyCard, id: 0 }])
      });
    } else if (selectedDays.length < 7 && selectedDays.length > 0) {
      onScheduleValueChange({
        prop: 'cards',
        value: cards.concat([
          { ...emptyCard, id: cards[cards.length - 1].id + 1 }
        ])
      });
    }
  };

  renderRow = ({ item }) => {
    return (
      <RegisterScheduleItem
        card={item}
        navigation={this.props.navigation}
        // onCardChange={this.onCardChange}
      />
    );
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={this.props.cards}
          renderItem={this.renderRow}
          keyExtractor={card => card.id.toString()}
          extraData={this.props}
          style={{ padingBottom: 80 }}
        />
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

const emptyCard = {
  firstOpen: '',
  firstClose: '',
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
  const { cards, selectedDays, loading } = state.registerSchedule;
  return { cards, selectedDays, loading };
};

export default connect(
  mapStateToProps,
  { onScheduleValueChange }
)(RegisterSchedule);
