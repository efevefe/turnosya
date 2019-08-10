import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { MAIN_COLOR } from '../constants';
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
    const { cards, onScheduleValueChange } = this.props;

    onScheduleValueChange({
      prop: 'cards',
      value: cards.concat([{ ...emptyCard, id: cards.length }])
    });
  };

  renderRow = ({ item }) => {
    return (
      <RegisterScheduleItem card={item} navigation={this.props.navigation} />
    );
  };

  renderList() {
    const { cards, loading } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={cards.length > 0 ? cards : [{ ...emptyCard, id: 0 }]}
          renderItem={this.renderRow}
          keyExtractor={card => card.id.toString()}
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
