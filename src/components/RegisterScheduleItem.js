import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { Card, CheckBox, ButtonGroup } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import { View, StyleSheet, Text } from 'react-native';
import { MAIN_COLOR } from '../constants';
import { onScheduleValueChange } from '../actions';
import { CardSection } from './common';

class RegisterSchedule extends Component {
  state = {
    checked: false,
    prevDays: [],
    firstCloseError: ''
  };

  async componentDidMount() {
    await this.setState({
      checked: this.props.card.secondOpen,
      prevDays: this.props.card.days
    });
  }

  getDisablePicker = () => {
    const { firstOpen } = this.props.card;

    if (firstOpen === '') {
      return true;
    } else {
      return false;
    }
  };

  getDisabledCheckBox = () => {
    if (this.props.card.firstClose === '') {
      return true;
    } else {
      return false;
    }
  };

  renderPickerClose = value => {
    const { firstOpen } = this.props.card;

    console.log('O: ', firstOpen);

    console.log('C: ', value);

    if (firstOpen < value) {
      this.setState({ firstCloseError: '' });
    } else {
      this.setState({ firstCloseError: 'Error' });
    }
  };

  getDisableDays = () => {
    return this.props.selectedDays.filter(
      obj => this.props.card.days.indexOf(obj) === -1
    );
  };

  updateIndex = selectedIndexes => {
    const { card, selectedDays, onScheduleValueChange } = this.props;
    onScheduleValueChange({
      prop: 'days',
      value: { id: card.id, value: selectedIndexes }
    });

    const newValue = selectedIndexes
      .concat(this.state.prevDays)
      .filter((value, index, array) => array.indexOf(value) === index);

    if (newValue.length != this.state.prevDays.length) {
      //Significa que seleccionó un nuevo día

      onScheduleValueChange({
        prop: 'selectedDays',
        value: selectedDays
          .concat(selectedIndexes)
          .filter((value, index, array) => array.indexOf(value) === index)
      });
    } else {
      //Significa que borró un día

      const valueErased = this.state.prevDays.filter(
        obj => selectedIndexes.indexOf(obj) === -1
      );

      onScheduleValueChange({
        prop: 'selectedDays',
        value: selectedDays.filter(obj => valueErased.indexOf(obj) === -1)
      });
    }

    this.setState({ prevDays: selectedIndexes });

    this.props.onScheduleValueChange({
      prop: 'refresh',
      value: !this.props.refresh
    });
  };

  onSecondTurnPress = () => {
    this.props.onScheduleValueChange({
      prop: 'secondOpen',
      value: { id: this.props.card.id, value: '' }
    });
    this.props.onScheduleValueChange({
      prop: 'secondClose',
      value: { id: this.props.card.id, value: '' }
    });
    this.setState({ checked: !this.state.checked });
  }

  renderSecondTurn() {
    if (this.state.checked) {
      return (
        <CardSection style={styles.viewPickerDate}>
          <DatePicker
            date={this.props.card.secondOpen}
            mode="time"
            placeholder="Seleccione hora de apertura"
            confirmBtnText="Confirmar"
            cancelBtnText="Cancelar"
            iconComponent={<Ionicons name="md-time" size={30} />}
            customStyles={{
              dateInput: {
                borderColor: 'transparent'
              },
              placeholderText: {
                textAlign: 'center',
                fontSize: 10
              }
            }}
            onDateChange={value => {
              this.props.onScheduleValueChange({
                prop: 'secondOpen',
                value: { id: this.props.card.id, value }
              });
              this.props.onScheduleValueChange({
                prop: 'refresh',
                value: !this.props.refresh
              });
            }}
          />

          <DatePicker
            date={this.props.card.secondClose}
            mode="time"
            placeholder="Seleccione hora de cierre"
            confirmBtnText="Confirmar"
            cancelBtnText="Cancelar"
            iconComponent={<Ionicons name="md-time" size={30} />}
            customStyles={{
              dateInput: {
                borderColor: 'transparent'
              },
              placeholderText: {
                textAlign: 'center',
                fontSize: 10
              }
            }}
            onDateChange={value => {
              this.props.onScheduleValueChange({
                prop: 'secondClose',
                value: { id: this.props.card.id, value }
              });
              this.props.onScheduleValueChange({
                prop: 'refresh',
                value: !this.props.refresh
              });
            }}
          />
        </CardSection>
      );
    }
  }

  render() {
    const buttons = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
    console.log('open', this.props.card.firstOpen);

    console.log('close', this.props.card.firstClose);
    console.log('E: ', this.state.firstCloseError);

    return (
      <View>
        <Card containerStyle={styles.cardStyle} title="Horarios">
          <CardSection style={styles.viewPickerDate}>
            <DatePicker
              date={this.props.card.firstOpen}
              mode="time"
              placeholder="Seleccione hora de apertura"
              confirmBtnText="Confirmar"
              cancelBtnText="Cancelar"
              iconComponent={<Ionicons name="md-time" size={30} />}
              customStyles={{
                dateInput: {
                  borderColor: 'transparent'
                },
                placeholderText: {
                  textAlign: 'center',
                  fontSize: 10
                }
              }}
              onDateChange={value => {
                this.props.onScheduleValueChange({
                  prop: 'firstOpen',
                  value: { id: this.props.card.id, value }
                });
                this.props.onScheduleValueChange({
                  prop: 'refresh',
                  value: !this.props.refresh
                });
              }}
            />
            <DatePicker
              date={this.props.card.firstClose}
              mode="time"
              placeholder="Seleccione hora de cierre"
              confirmBtnText="Confirmar"
              cancelBtnText="Cancelar"
              iconComponent={<Ionicons name="md-time" size={30} />}
              customStyles={{
                dateInput: {
                  borderColor: 'transparent'
                },
                placeholderText: {
                  textAlign: 'center',
                  fontSize: 10
                },
                disabled: {
                  backgroundColor: 'transparent'
                }
              }}
              onDateChange={value => {
                this.props.onScheduleValueChange({
                  prop: 'firstClose',
                  value: { id: this.props.card.id, value }
                });
                this.props.onScheduleValueChange({
                  prop: 'refresh',
                  value: !this.props.refresh
                });
                this.renderPickerClose(value);
              }}
              disabled={this.getDisablePicker()}
            />
          </CardSection>

          {this.renderSecondTurn()}

          <CardSection>
            <CheckBox
              containerStyle={{ flex: 1 }}
              title="Agregar segundo turno"
              iconType="material"
              checkedIcon='clear'
              uncheckedIcon='add'
              checkedColor={MAIN_COLOR}
              uncheckedColor={MAIN_COLOR}
              checkedTitle="Borrar segundo turno"
              checked={this.state.checked}
              onPress={this.onSecondTurnPress}
              disabled={!this.props.card.firstClose}
            />
          </CardSection>

          <CardSection>
            <ButtonGroup
              onPress={index => this.updateIndex(index)}
              selectedIndexes={this.props.card.days}
              disabled={this.getDisableDays()}
              buttons={buttons}
              selectMultiple
              containerStyle={{ borderWidth: 0, height: 50 }}
              innerBorderStyle={{ width: 0 }}
              buttonStyle={{
                borderWidth: 2,
                borderColor: 'white',
                borderRadius: 25,
                width: 50
              }}
              selectedButtonStyle={{ backgroundColor: MAIN_COLOR }}
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
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardStyle: {
    padding: 5,
    paddingTop: 10,
    borderRadius: 10
  }
});

const mapStateToProps = state => {
  const { selectedDays, refresh } = state.registerSchedule;

  return {
    selectedDays,
    refresh
  };
};

export default connect(
  mapStateToProps,
  { onScheduleValueChange }
)(RegisterSchedule);
