import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import { CardSection } from './common';
import { Ionicons } from '@expo/vector-icons';
import DatePicker from 'react-native-datepicker';
import { onScheduleFormOpen, onScheduleValueChange } from '../actions';
import { Card, CheckBox, ButtonGroup } from 'react-native-elements';
import { MAIN_COLOR } from '../constants';

class RegisterSchedule extends Component {
  state = { checked: false };

  async componentDidMount() {
    await this.setState({
      checked: !!this.props.card.secondOpen
    });
  }

  updateIndex = selectedIndexes => {
    // this.props.onScheduleValueChange({
    //   prop: 'days',
    //   value: selectedIndexes
    // });
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
                  value
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
                  prop: 'secondOpen',
                  value
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
                value: ''
              });
              this.props.onScheduleValueChange({
                prop: 'secondClose',
                value: ''
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

  // { firstOpen, firstClose, secondOpen, secondClose, days } = this.props.card

  render() {
    const buttons = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
    // const { selectedIndexes } = this.state;
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
                  value
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
                  value
                });
              }}
            />
          </CardSection>

          <CardSection>{this.renderSecondTurn()}</CardSection>

          <CardSection>
            <ButtonGroup
              onPress={index => this.updateIndex(index)}
              selectedIndexes={this.props.card.days}
              disabled={this.props.card.days}
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
  const { selectedDays } = state.registerSchedule;

  return {
    selectedDays
  };
};

export default connect(
  mapStateToProps,
  { onScheduleFormOpen, onScheduleValueChange }
)(RegisterSchedule);
