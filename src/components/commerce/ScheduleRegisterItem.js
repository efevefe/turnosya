import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Card,
  CheckBox,
  ButtonGroup,
  Text,
  Divider
} from 'react-native-elements';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MAIN_COLOR } from '../../constants';
import {
  onScheduleValueChange,
  onScheduleCardValueChange,
  onScheduleCardDelete
} from '../../actions';
import { CardSection, DatePicker, Toast } from '../common';

const buttonSize = Math.round(Dimensions.get('window').width) / 8.5;

class ScheduleRegister extends Component {
  state = {
    checked: false,
    firstShiftEndError: '',
    secondShiftStartError: '',
    secondShiftEndError: ''
  };

  componentDidMount() {
    this.setState({
      checked: !!this.props.card.secondShiftStart,
      prevDays: this.props.card.days
    });
  }

  componentDidUpdate(prevProps) {
    const { firstShiftStart, firstShiftEnd, secondShiftStart, secondShiftEnd } = this.props.card;

    if (
      prevProps.card.firstShiftStart !== firstShiftStart ||
      prevProps.card.firstShiftEnd !== firstShiftEnd ||
      prevProps.card.secondShiftStart !== secondShiftStart ||
      prevProps.card.secondShiftEnd !== secondShiftEnd
    ) {
      this.firstShiftStartError();
      this.firstShiftEndError();
      this.secondShiftStartError();
      this.secondShiftEndError();
    }
  }

  firstShiftStartError = () => {
    const { firstShiftStart, firstShiftEnd } = this.props.card;

    if (firstShiftEnd) {
      if (firstShiftStart >= firstShiftEnd) {
        this.setState({ firstShiftStartError: 'La hora de apertura debe ser anterior al de cierre' });
      } else {
        this.setState({ firstShiftStartError: '' });
      }
    }
  }

  firstShiftEndError = () => {
    const { firstShiftStart, firstShiftEnd, secondShiftStart } = this.props.card;

    if (firstShiftEnd) {
      if (firstShiftStart >= firstShiftEnd) {
        this.setState({ firstShiftEndError: 'La hora de cierre debe ser posterior a la de apertura' });
      } else if (secondShiftStart && firstShiftEnd >= secondShiftStart) {
        this.setState({ firstShiftEndError: 'El primer turno debe finalzar antes del segundo' });
      } else {
        this.setState({ firstShiftEndError: '' });
      }
    }
  };

  secondShiftStartError = () => {
    const { secondShiftStart, secondShiftEnd, firstShiftEnd } = this.props.card;

    if (secondShiftStart) {
      if (secondShiftStart <= firstShiftEnd) {
        this.setState({ secondShiftStartError: 'El segundo turno debe arrancar despues del primero' });
      } else if (secondShiftEnd && secondShiftStart >= secondShiftEnd) {
        this.setState({ secondShiftStartError: 'La hora de apertura debe ser anterior a la de cierre' });
      } else {
        this.setState({ secondShiftStartError: '' });
      }
    }
  }

  secondShiftEndError = () => {
    const { secondShiftStart, secondShiftEnd } = this.props.card;

    if (secondShiftEnd) {
      if (secondShiftEnd <= secondShiftStart) {
        this.setState({ secondShiftEndError: 'La hora de cierre debe ser posterior a la de apertura' });
      } else {
        this.setState({ secondShiftEndError: '' })
      }
    }
  }

  onSecondTurnPress = () => {
    const { checked, firstShiftStartError, firstShiftEndError } = this.state;

    if (this.props.card.firstShiftEnd && !firstShiftStartError && !firstShiftEndError) {
      this.setState({ checked: !checked });

      this.props.onScheduleCardValueChange({
        id: this.props.card.id,
        secondShiftStart: null,
        secondShiftEnd: null
      });
    } else {
      if (!checked) Toast.show({ text: 'Debe completar el primer turno para agregar un segundo' });
      this.setState({ checked: false });
    }
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
        value: [...selectedDays, selectedIndexes[selectedIndexes.length - 1]]
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

    onScheduleCardValueChange({ id: card.id, days: [...selectedIndexes].sort((a, b) => a - b) });
  };

  renderSecondTurn() {
    if (this.state.checked) {
      return (
        <CardSection style={styles.viewPickerDate}>
          <DatePicker
            date={this.props.card.secondShiftStart}
            label="Desde las:"
            placeholder="Hora de apertura"
            onDateChange={value => {
              this.props.onScheduleCardValueChange({
                id: this.props.card.id,
                secondShiftStart: value
              });
            }}
            errorMessage={this.state.secondShiftStartError}
          />

          <DatePicker
            date={this.props.card.secondShiftEnd}
            label="Hasta las:"
            placeholder="Hora de cierre"
            onDateChange={value => {
              this.props.onScheduleCardValueChange({
                id: this.props.card.id,
                secondShiftEnd: value
              });
            }}
            disabled={!this.props.card.secondShiftStart}
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
              onDateChange={value => {
                this.props.onScheduleCardValueChange({
                  id: this.props.card.id,
                  firstShiftStart: value
                });
              }}
              errorMessage={this.state.firstShiftStartError}
            />
            <DatePicker
              date={this.props.card.firstShiftEnd}
              label="Hasta las:"
              placeholder="Hora de cierre"
              onDateChange={value => {
                this.props.onScheduleCardValueChange({
                  id: this.props.card.id,
                  firstShiftEnd: value
                });
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
            />
          </CardSection>

          <CardSection style={styles.buttonGroupCard}>
            <ButtonGroup
              Component={TouchableWithoutFeedback}
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
    justifyContent: 'space-around'
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
  const { selectedDays } = state.commerceSchedule;

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
