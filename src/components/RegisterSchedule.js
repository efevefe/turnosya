import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet } from 'react-native';
import { CardSection, Button, Input } from './common';
import { Ionicons } from '@expo/vector-icons';
import DatePicker from 'react-native-datepicker';
import { onScheduleFormOpen, onScheduleValueChange } from '../actions';

class RegisterSchedule extends Component {
  render() {
    console.log(this.props.mondayTimeClose);
    return (
      <View>
        <View style={styles.viewPickerDate}>
          <Text>Lunes</Text>
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

        <View style={styles.viewPickerDate}>
          <Text>Martes</Text>
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
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewPickerDate: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5
  }
});

const mapStateToProps = state => {
  const {
    mondayTimeOpen,
    mondayTimeClose,
    loading,
    thuesdayTimeOpen,
    thuesdayTimeClose
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
