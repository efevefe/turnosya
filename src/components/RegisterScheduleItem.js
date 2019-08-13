import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { Card, CheckBox, ButtonGroup } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import { View, StyleSheet } from 'react-native';
import { MAIN_COLOR } from '../constants';
import { onScheduleValueChange } from '../actions';
import { CardSection } from './common';

class RegisterSchedule extends Component {
  state = { checked: false, prevDays: [] };

  async componentDidMount() {
    await this.setState({
      checked: !!this.props.card.secondOpen,
      prevDays: this.props.card.days
    });
  }

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

  renderSecondTurn() {
    if (this.state.checked) {
      return (
        <View>
          <View style={styles.viewPickerDate}>
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
          </View>
          <CheckBox
            containerStyle={{ flex: 1 }}
            title="Agregar segundo turno"
            iconType="material"
            checkedIcon="clear"
            checkedColor={MAIN_COLOR}
            checkedTitle="Borrar segundo turno"
            checked={this.state.checked}
            onPress={() => {
              this.props.onScheduleValueChange({
                prop: 'secondOpen',
                value: { id: this.props.card.id, value: '' }
              });
              this.props.onScheduleValueChange({
                prop: 'secondClose',
                value: { id: this.props.card.id, value: '' }
              });
              this.setState({ checked: !this.state.checked });
            }}
          />
        </View>
      );
    } else
      return (
        <CheckBox
          title="Agragar segundo turno"
          iconType="material"
          uncheckedIcon="add"
          uncheckedColor={MAIN_COLOR}
          checked={this.state.checked}
          onPress={() => this.setState({ checked: !this.state.checked })}
          containerStyle={{ flex: 1 }}
        />
      );
  }

  render() {
    const buttons = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
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
              }}
            />
          </CardSection>

          <CardSection>{this.renderSecondTurn()}</CardSection>

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
