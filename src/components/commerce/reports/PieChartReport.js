import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PieChart, Spinner, Button, DatePicker } from '../../common';
import {
  readStateTurnsReservations,
  onCommerceReportValueChange
} from '../../../actions/CommerceReportsActions';
import { View, ScrollView } from 'react-native';
import moment from 'moment';

class PieChartReport extends Component {
  constructor(props) {
    super(props);
    const { commerceId, startDate, endDate } = props;

    props.readStateTurnsReservations(commerceId, startDate, endDate);
  }
  render() {
    const { data, loading } = this.props;
    const dataPie = [
      {
        name: 'Realizados',
        count: data[0],
        color: 'rgba(199, 44, 65, 1)'
      },
      {
        name: 'Cancelados',
        count: data[1],
        color: 'rgba(199, 44, 65, 0.5)'
      }
    ];

    const { commerceId, startDate, endDate } = this.props;
    if (loading) return <Spinner />;

    return (
      <ScrollView>
        <View
          style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 10 }}
        >
          <DatePicker
            mode="date"
            label="Desde:"
            placeholder="Fecha Desde"
            date={startDate}
            onDateChange={startDate =>
              this.props.onCommerceReportValueChange({
                prop: 'startDate',
                value: moment(startDate)
              })
            }
          />
          <DatePicker
            mode="date"
            label="Hasta:"
            placeholder="Fecha Hasta"
            date={endDate}
            onDateChange={endDate =>
              this.props.onCommerceReportValueChange({
                prop: 'endDate',
                value: moment(endDate)
              })
            }
          />
        </View>
        <Button
          title={'Generar Reporte'}
          onPress={() => {
            this.props.readStateTurnsReservations(
              commerceId,
              startDate,
              endDate,
              endDate
            );
          }}
        />
        <PieChart data={dataPie} accesor="count" />
      </ScrollView>
    );
  }
}

const mapStateToProps = state => {
  const { data, startDate, endDate, loading } = state.commerceReports;
  const { commerceId } = state.commerceData;

  return {
    data,
    startDate,
    endDate,
    commerceId,
    loading
  };
};

export default connect(mapStateToProps, {
  readStateTurnsReservations,
  onCommerceReportValueChange
})(PieChartReport);
