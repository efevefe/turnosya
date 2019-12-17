import React, { Component } from 'react';
import { connect } from 'react-redux';
import { LineChart, Spinner, Input, DatePicker } from '../../common';
import {
  readEarningsOnMonths,
  onCommerceReportValueChange
} from '../../../actions/CommerceReportsActions';
import { View, ScrollView } from 'react-native';
import moment from 'moment';

class LineChartMoneyReport extends Component {
  componentWillMount() {
    this.props.readEarningsOnMonths(this.props.commerceId);
  }

  render() {
    const { startDate, loading, data } = this.props;

    const dataLine = {
      labels: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
      datasets: [
        {
          data: data
        }
      ]
    };

    if (loading) return <Spinner />;
    return (
      <ScrollView style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'flex-start',
            margin: 10
          }}
        >
          <DatePicker
            mode="date"
            label="Año"
            format="YYYY"
            date={startDate}
            onDateChange={startDate =>
              this.props.onCommerceReportValueChange({
                prop: 'startDate',
                value: moment(startDate)
              })
            }
          />
        </View>
        <LineChart data={dataLine} yAxisLabel={'$'} />
      </ScrollView>
    );
  }
}

const mapStateToProps = state => {
  const { data, startDate, loading } = state.commerceReports;
  const { commerceId } = state.commerceData;

  return {
    data,
    startDate,
    commerceId,
    loading
  };
};

export default connect(mapStateToProps, {
  readEarningsOnMonths,
  onCommerceReportValueChange
})(LineChartMoneyReport);
