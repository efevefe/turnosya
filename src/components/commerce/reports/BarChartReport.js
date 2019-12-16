import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BarChart, Spinner, Input, DatePicker } from '../../common';
import { readReservationOnDays } from '../../../actions/CommerceReportsActions';
import { View, ScrollView } from 'react-native';

class BarChartReport extends Component {
  componentWillMount() {
    this.props.readReservationOnDays();
  }

  render() {
    const data = {
      labels: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
      datasets: [
        {
          data: this.props.data
        }
      ]
    };
    console.log('DAYS', this.props.data);
    console.log(this.props.loading);
    if (this.props.loading) return <Spinner />;
    return (
      <ScrollView style={{ flex: 1 }}>
        <View
          style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 10 }}
        >
          <DatePicker
            mode="date"
            label="Desde:"
            placeholder="Opcional"
            //   onDateChange={}
          />
          <DatePicker
            mode="date"
            label="Hasta:"
            placeholder=""
            //   onDateChange={}
          />
        </View>
        <BarChart data={data} style={{ marginTop: 20 }} />
      </ScrollView>
    );
  }
}

const mapStateToProps = state => {
  const { data, loading } = state.commerceReports;

  return {
    data,
    loading
  };
};

export default connect(mapStateToProps, { readReservationOnDays })(
  BarChartReport
);
