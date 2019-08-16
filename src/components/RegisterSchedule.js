import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { FlatList, View, StyleSheet } from 'react-native';
import { Spinner, Button } from './common';
import { onScheduleValueChange } from '../actions';
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
    const { cards, selectedDays, onScheduleValueChange } = this.props;
    if (cards.length === 0) {
      onScheduleValueChange({
        prop: 'cards',
        value: cards.concat([{ ...emptyCard, id: 0 }])
      });
    } else if (
      selectedDays.length < 7 &&
      selectedDays.length > 0
    ) {
      onScheduleValueChange({
        prop: 'cards',
        value: cards.concat([{ ...emptyCard, id: cards[cards.length - 1].id + 1 }])
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

  renderList() {
    const { cards, loading } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={cards}
          renderItem={this.renderRow}
          keyExtractor={card => card.id.toString()}
          extraData={this.props}
        />
        <Button
          style={styles.cardStyle}
          title="Guardar"
          loading={loading}
        //onPress={this.onButtonPressHandler.bind(this)}
        />
      </View>
    );
  }

  render() {
    return this.renderList();
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
