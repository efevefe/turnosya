import React, { Component } from 'react';
import { Dimensions } from 'react-native';
import moment from 'moment';
import { CardSection, DatePicker } from '../../common';

const pickerWidth = Math.round(Dimensions.get('window').width) / 3.1;

class ReportPeriodPicker extends Component {
  state = { startDateError: '', endDateError: '' };

  componentDidUpdate(prevProps) {
    if (prevProps.startDate !== this.props.startDate || prevProps.endDate !== this.props.endDate)
      this.periodError();
  }

  periodError = () => {
    if (this.props.startDate && this.props.endDate && this.props.startDate >= this.props.endDate)
      return this.setState({
        startDateError: 'La fecha desde debe ser menor a la fecha hasta',
        endDateError: 'La fecha hasta debe ser mayor a la fecha desde'
      }, () => this.props.onValueChange(this.state.startDateError || this.state.endDateError));

    this.setState({ startDateError: '', endDateError: '' },
      () => this.props.onValueChange(this.state.startDateError || this.state.endDateError));
  }

  render() {
    return (
      <CardSection
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          paddingTop: 10
        }}
      >
        <DatePicker
          date={this.props.startDate}
          mode="date"
          label="Desde:"
          placeholder="Fecha desde"
          pickerWidth={pickerWidth}
          errorMessage={this.state.startDateError}
          onDateChange={date => this.props.onStartDateChange(moment(date))}
        />
        <DatePicker
          date={this.props.endDate}
          mode="date"
          label="Hasta:"
          placeholder="Opcional"
          pickerWidth={pickerWidth}
          errorMessage={this.state.endDateError}
          onDateChange={date => this.props.onEndDateChange(moment(date))}
        />
      </CardSection >
    );
  }
}

export default ReportPeriodPicker;