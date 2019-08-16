import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { FlatList, View, StyleSheet } from 'react-native';
import { Spinner, Button } from './common';
import { onScheduleValueChange } from '../actions';
import { MAIN_COLOR } from '../constants';
import RegisterScheduleItem from './RegisterScheduleItem';

class RegisterSchedule extends Component {
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
    const { cards, onScheduleValueChange } = this.props;
    if (
      this.props.selectedDays.length < 7 &&
      this.props.cards[cards.length - 1].days.length > 0
    ) {
      onScheduleValueChange({
        prop: 'cards',
        value: cards.concat([{ ...emptyCard, id: cards.length }])
      });
    }
  };

  // onCardChange = ({ prop, value }) => {
  //   this.props.onScheduleValueChange({ prop, value });
  // };

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
}

const emptyCard = {
  firstOpen: '',
  firstClose: '',
  disableDays: [],
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
