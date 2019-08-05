import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet } from 'react-native';
import { CardSection, Button, Input } from './common';
import { Ionicons } from '@expo/vector-icons';
import DatePicker from 'react-native-datepicker';
import { onScheduleFormOpen, onScheduleValueChange } from '../actions';
import { Card, CheckBox } from 'react-native-elements';
import { MAIN_COLOR } from '../constants';

class RegisterSchedule extends Component {
  state = { check: false };

  onCheckBoxPress = () => {
    this.setState({ check: !this.state.check });
  };

  renderDay() {
    console.log(this.state.check);
    if (this.state.check) {
      return (
        <View>
          <View style={styles.viewPickerDate}>
            <DatePicker
              date={this.props.mondayTimeOpen}
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
                  prop: 'mondayTimeOpen',
                  value
                });
              }}
            />

            <DatePicker
              date={this.props.mondayTimeClose}
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
                  prop: 'mondayTimeClose',
                  value
                });
              }}
            />
          </View>
          <CheckBox
            containerStyle={{ marginTop: 10, marginLeft: 5, marginRight: 5 }}
            title="Miercoles"
            iconType="material"
            checkedIcon="clear"
            checkedColor={MAIN_COLOR}
            checkedTitle="Borrar segundo turno"
            checked={this.state.check}
            onPress={this.onCheckBoxPress}
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
          checked={this.state.check}
          onPress={this.onCheckBoxPress}
          containerStyle={{ flex: 1 }}
        />
      );
  }

  render() {
    return (
      <View>
        <Card containerStyle={styles.cardStyle} title="Lunes">
          <CardSection style={styles.viewPickerDate}>
            <DatePicker
              date={this.props.mondayTimeOpen}
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
                  prop: 'mondayTimeOpen',
                  value
                });
              }}
            />

            <DatePicker
              date={this.props.mondayTimeClose}
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
                  prop: 'mondayTimeClose',
                  value
                });
              }}
            />
          </CardSection>
          <CardSection style={styles.viewPickerDate}>
            {this.renderDay()}
          </CardSection>
        </Card>

        <Card containerStyle={styles.cardStyle} title="Martes">
          <CardSection style={styles.viewPickerDate}>
            <DatePicker
              date={this.props.thuesdayTimeOpen}
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
                  prop: 'thuesdayTimeOpen',
                  value
                });
              }}
            />

            <DatePicker
              date={this.props.thuesdayTimeClose}
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
                  prop: 'thuesdayTimeClose',
                  value
                });
              }}
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
  const {
    mondayTimeOpen,
    mondayTimeClose,
    thuesdayTimeOpen,
    thuesdayTimeClose,
    loading
  } = state.registerSchedule;

  return {
    mondayTimeOpen,
    mondayTimeClose,
    thuesdayTimeOpen,
    thuesdayTimeClose,
    loading
  };
};

export default connect(
  mapStateToProps,
  { onScheduleFormOpen, onScheduleValueChange }
)(RegisterSchedule);
