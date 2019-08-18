import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Card,
  CheckBox,
  ButtonGroup,
  Text,
  Divider
} from 'react-native-elements';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MAIN_COLOR } from '../constants';
import {
  onScheduleValueChange,
  onScheduleCardValueChange,
  onScheduleCardDelete
} from '../actions';
import { CardSection, DatePicker } from './common';


const buttonSize = Math.round(Dimensions.get('window').width) / 8.5;

class ScheduleRegister extends Component {
  state = {
    checked: false,
    firstShiftEndError: '',
    secondShiftStartError: '',
    secondShiftEndError: ''
  };

  async componentDidMount() {
    await this.setState({
      checked: !!this.props.card.secondShiftStart,
      prevDays: this.props.card.days
    });
  }

  getDisabledCheckBox = () => {
    return (
      this.props.card.firstShiftEnd === '' ||
      this.state.firstShiftEndError !== ''
    );
  };

  getDisabledSecondPickerEnd = () => {
    return (
      !this.props.card.secondShiftStart ||
      this.state.secondShiftStartError !== ''
    );
  };

  renderPickerFirstShiftEnd = () => {
    const { firstShiftStart, firstShiftEnd } = this.props.card;

    if (firstShiftStart < firstShiftEnd || firstShiftEnd == '') {
      this.setState({ firstShiftEndError: '' });
    } else {
      this.setState({
        firstShiftEndError: `Hora de cierre debe ser \n mayor a la de apertura`
      });
      this.onSecondTurnPress();
    }
  };

  renderPickerSecondShiftStart = () => {
    const { firstShiftEnd, secondShiftStart } = this.props.card;

    secondShiftStart > firstShiftEnd || secondShiftStart === ''
      ? this.setState({ secondShiftStartError: '' })
      : this.setState({
          secondShiftStartError: `Segundo turno debe \n ser mayor al primero`
        });
  };

  renderPickerSecondShiftEnd = () => {
    const { secondShiftStart, secondShiftEnd } = this.props.card;

    secondShiftStart < secondShiftEnd
      ? this.setState({ secondShiftEndError: '' })
      : this.setState({
          secondShiftEndError: `Hora de cierre debe ser \n mayor a la de apertura`
        });
  };

  getDisabledDays = () => {
    return this.props.selectedDays.filter(
      day => !this.props.card.days.includes(day)
    );
  };

  updateIndex = selectedIndexes => {
    const {
      card,
      selectedDays,
      onScheduleCardValueChange,
      onScheduleValueChange
    } = this.props;

    if (selectedIndexes.length > card.days.length) {
      //On day Added
      onScheduleValueChange({
        prop: 'selectedDays',
        value: selectedDays.concat([
          selectedIndexes[selectedIndexes.length - 1]
        ])
      });
    } else {
      //On day Deleted
      const valueErased = card.days.filter(
        day => !selectedIndexes.includes(day)
      )[0];

      onScheduleValueChange({
        prop: 'selectedDays',
        value: selectedDays.filter(day => day !== valueErased)
      });
    }

    onScheduleCardValueChange({ id: card.id, days: selectedIndexes });
  };

  onSecondTurnPress = () => {
    const { checked } = this.state;

    if (this.state.firstShiftEndError === '') {
      this.setState({ checked: !checked });

      this.props.onScheduleCardValueChange({
        id: this.props.card.id,
        secondShiftStart: null,
        secondShiftEnd: null
      });
    } else {
      this.setState({ checked: false });
    }
  };

  renderSecondTurn() {
    if (this.state.checked) {
      return (
        <CardSection style={styles.viewPickerDate}>
          <DatePicker
            date={this.props.card.secondShiftStart}
            mode="time"
            label="Desde las:"
            placeholder="Hora de apertura"
            onDateChange={async value => {
              await this.props.onScheduleCardValueChange({
                id: this.props.card.id,
                secondShiftStart: value
              });
              this.renderPickerSecondShiftStart();
            }}
            errorMessage={this.state.secondShiftStartError}
          />

          <DatePicker
            date={this.props.card.secondShiftEnd}
            label="Hasta las:"
            placeholder="Hora de cierre"
            onDateChange={async value => {
              await this.props.onScheduleCardValueChange({
                id: this.props.card.id,
                secondShiftEnd: value
              });
              this.renderPickerSecondShiftEnd();
            }}
            disabled={this.getDisabledSecondPickerEnd()}
            errorMessage={this.state.secondShiftEndError}
          />
        </CardSection>
      );
    }
  }

  render() {
    return (
      <View>
        <Card containerStyle={styles.cardStyle}>
          <View style={styles.headerContainer}>
            <View style={styles.titleContainer}>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Horarios</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Ionicons
                name="md-close"
                color="black"
                size={25}
                onPress={() =>
                  this.props.onScheduleCardDelete(this.props.card.id)
                }
              />
            </View>
          </View>
          <Divider style={{ backgroundColor: '#c4c4c4', margin: 10 }} />
          <CardSection style={styles.viewPickerDate}>
            <DatePicker
              date={this.props.card.firstShiftStart}
              label="Desde las:"
              placeholder="Hora de apertura"
              onDateChange={async value => {
                await this.props.onScheduleCardValueChange({
                  id: this.props.card.id,
                  firstShiftStart: value
                });
                this.renderPickerFirstShiftEnd();
              }}
            />
            <DatePicker
              date={this.props.card.firstShiftEnd}
              label="Hasta las:"
              placeholder="Hora de cierre"
              onDateChange={async value => {
                await this.props.onScheduleCardValueChange({
                  id: this.props.card.id,
                  firstShiftEnd: value
                });
                this.renderPickerFirstShiftEnd();
                this.renderPickerSecondShiftStart();
              }}
              disabled={!this.props.card.firstShiftStart}
              errorMessage={this.state.firstShiftEndError}
            />
          </CardSection>

          {this.renderSecondTurn()}

          <CardSection>
            <CheckBox
              containerStyle={{ flex: 1 }}
              title="Agregar segundo turno"
              iconType="material"
              checkedIcon="clear"
              uncheckedIcon="add"
              checkedColor={MAIN_COLOR}
              uncheckedColor={MAIN_COLOR}
              checkedTitle="Borrar segundo turno"
              checked={this.state.checked}
              onPress={this.onSecondTurnPress}
              disabled={this.getDisabledCheckBox()}
            />
          </CardSection>

          <CardSection style={styles.buttonGroupCard}>
            <ButtonGroup
              onPress={index => this.updateIndex(index)}
              selectedIndexes={this.props.card.days}
              disabled={this.getDisabledDays()}
              buttons={['D', 'L', 'M', 'M', 'J', 'V', 'S']}
              selectMultiple
              containerStyle={{
                borderWidth: 0,
                height: buttonSize,
                marginTop: 0
              }}
              innerBorderStyle={{ width: 0 }}
              buttonStyle={{
                borderWidth: 2,
                borderColor: 'white',
                borderRadius: buttonSize / 2,
                width: buttonSize
              }}
              selectedButtonStyle={{ backgroundColor: MAIN_COLOR }}
              selectedTextStyle={{ color: 'white' }}
              textStyle={{ color: MAIN_COLOR }}
              disabledTextStyle={{ color: 'grey' }}
            />
          </CardSection>
        </Card>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewPickerDate: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
  },
  cardStyle: {
    padding: 5,
    paddingTop: 10,
    borderRadius: 10
  },
  buttonGroupCard: {
    paddingTop: 0
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginLeft: 15,
    marginRight: 15
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    marginLeft: 15
  }
});

const mapStateToProps = state => {
  const { selectedDays } = state.scheduleRegister;

  return {
    selectedDays
  };
};

export default connect(
  mapStateToProps,
  {
    onScheduleValueChange,
    onScheduleCardValueChange,
    onScheduleCardDelete
  }
)(ScheduleRegister);
