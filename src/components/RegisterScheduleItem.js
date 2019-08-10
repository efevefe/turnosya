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
  state = { checked: false };

  async componentDidMount() {
    await this.setState({
      checked: !!this.props.card.secondOpen
    });
  }

  updateIndex = selectedIndexes => {
    this.props.onScheduleValueChange({
      prop: 'days',
      value: selectedIndexes
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
                  value: { id: this.props.card.id, value }
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
              }}
            />
          </CardSection>

          <CardSection>{this.renderSecondTurn()}</CardSection>

          <CardSection>
            <ButtonGroup
              onPress={index => this.updateIndex(index)}
              selectedIndexes={this.props.card.days}
              disabled={this.props.selectedDays}
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
  { onScheduleValueChange }
)(RegisterSchedule);
