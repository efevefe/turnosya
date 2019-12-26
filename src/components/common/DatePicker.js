import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import RNDatePicker from 'react-native-datepicker';
import { Ionicons } from '@expo/vector-icons';
import { MAIN_COLOR } from '../../constants';

const pickerWidth = Math.round(Dimensions.get('window').width) / 2.7;

class DatePicker extends Component {
  renderErrorMessage = () => {
    if (this.props.errorMessage) {
      return (
        <Text style={styles.errorMessageStyle}>{this.props.errorMessage}</Text>
      );
    }
  };

  renderLabel = color => {
    if (this.props.label) {
      return (
        <Text style={[styles.labelStyle, { color }]}>{this.props.label}</Text>
      );
    }
  }

  displayFormat = () => {
    switch (this.props.mode) {
      case 'datetime':
        return 'DD/MM/YYYY HH:mm';
      case 'date':
        return 'DD/MM/YYYY';
      default:
        return 'HH:mm';
    }
  }

  render() {
    const enabled = this.props.disabled ? false : true;
    const color = enabled ? MAIN_COLOR : '#c4c4c4';
    const borderBottomWidth = enabled ? 1.5 : 1;

    return (
      <View style={{ width: pickerWidth }}>
        {this.renderLabel(color)}
        <RNDatePicker
          {...this.props}
          mode={this.props.mode || 'time'}
          format={this.props.format || this.displayFormat()}
          confirmBtnText="Confirmar"
          cancelBtnText="Cancelar"
          iconComponent={
            <Ionicons
              name={this.props.mode ? "md-calendar" : "md-time"}
              color={color}
              size={20}
            />
          }
          customStyles={{
            dateInput: styles.dateInput,
            dateText: styles.dateText,
            placeholderText: styles.placeholderText,
            disabled: styles.disabled,
            dateTouchBody: {
              borderBottomWidth: borderBottomWidth,
              borderColor: color,
              paddingRight: 5
            }
          }}
          style={{ width: pickerWidth }}
        />
        {this.renderErrorMessage()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  labelStyle: {
    fontSize: 12,
    fontWeight: 'normal'
  },
  errorMessageStyle: {
    margin: 5,
    marginHorizontal: 0,
    color: 'red',
    fontSize: 12
  },
  dateInput: {
    borderWidth: 0
  },
  dateText: {
    alignSelf: 'flex-start',
    fontSize: 13,
    marginLeft: 5
  },
  placeholderText: {
    alignSelf: 'flex-start',
    fontSize: 13,
    marginLeft: 5
  },
  disabled: {
    backgroundColor: 'transparent'
  }
});

export { DatePicker };